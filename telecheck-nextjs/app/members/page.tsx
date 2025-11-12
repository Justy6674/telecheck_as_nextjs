"use client";

import React, { useState, useEffect } from "react";
import { PostcodeChecker } from "@/components/PostcodeChecker";
import { SavedChecks } from "@/components/SavedChecks";
import { CustomerFeedback } from "@/components/CustomerFeedback";
import { ManageBilling } from "@/components/ManageBilling";
import MemberOnboarding from "@/components/MemberOnboarding";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Shield, BarChart3, User, FileText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { AdminPanel } from "@/components/AdminPanel";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";

// Extend window to include Outseta
declare global {
  interface Window {
    Outseta: any;
  }
}

const Members = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check admin status from Supabase profiles table
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Query Supabase profiles table for admin users
        const { data: adminProfiles, error } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('role', 'admin');

        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }

        // Check if current user email matches any admin
        if (window.Outseta) {
          window.Outseta.getUser().then((user) => {
            if (user?.Email) {
              setUserEmail(user.Email);
              // Check if user email is in admin profiles
              const isAdminUser = adminProfiles?.some(profile =>
                profile.email.toLowerCase() === user.Email.toLowerCase()
              );
              console.log('🔧 Admin check (Supabase):', {
                userEmail: user.Email,
                adminProfiles: adminProfiles?.map(p => p.email),
                isAdminUser
              });
              setIsAdmin(isAdminUser || false);
            }
          }).catch((error) => {
            console.log('No user found:', error);
          });
        }
      } catch (error) {
        console.error('Error in admin check:', error);
      }
    };

    const handleLogout = () => {
      setUserEmail("");
      setIsAdmin(false);
    };

    // Check immediately and on Outseta events
    checkAdminStatus();
    window.addEventListener('outseta:authenticated', checkAdminStatus);
    window.addEventListener('outseta:logout', handleLogout);

    return () => {
      window.removeEventListener('outseta:authenticated', checkAdminStatus);
      window.removeEventListener('outseta:logout', handleLogout);
    };
  }, []);

  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!userEmail || onboardingChecked) {
        return;
      }

      try {
        setOnboardingChecked(true);

        // **EMERGENCY FIX**: Check localStorage first, skip database to unblock users
        const localStorageKey = `telecheck_onboarding_${userEmail}`;
        const hasCompletedOnboardingLocal = localStorage.getItem(localStorageKey) === 'true';

        if (hasCompletedOnboardingLocal) {
          console.log('✅ EMERGENCY: Found onboarding completion in localStorage - skipping wizard');
          setShowOnboarding(false);

          // Remove URL parameter if present
          const showOnboardingParam = searchParams.get('onboarding') === 'true';
          if (showOnboardingParam) {
            console.log('🔧 Removing onboarding URL parameter');
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('onboarding');
            window.history.replaceState({}, '', newUrl);
          }
          return;
        }

        // **EMERGENCY**: Only show onboarding if explicitly requested via URL
        const showOnboardingParam = searchParams.get('onboarding') === 'true';
        if (showOnboardingParam) {
          console.log('🆕 URL parameter detected - showing onboarding wizard');
          setShowOnboarding(true);

          // Remove URL parameter immediately
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('onboarding');
          window.history.replaceState({}, '', newUrl);
        } else {
          console.log('✅ EMERGENCY: No URL parameter - skipping onboarding to unblock user');
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
        setShowOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [userEmail, onboardingChecked, searchParams]);

  const handleOnboardingComplete = async () => {
    try {
      // **EMERGENCY FIX**: Force onboarding to complete without database calls
      console.log('🚨 EMERGENCY: Forcing onboarding completion to unblock users');
      setShowOnboarding(false);

      // Also save to localStorage as backup
      if (userEmail) {
        localStorage.setItem(`telecheck_onboarding_${userEmail}`, 'true');
        console.log('💾 Saved onboarding completion to localStorage as backup');
      }

      console.log('✅ Emergency onboarding completion - users can now access app');
    } catch (error) {
      console.error('Failed emergency onboarding completion:', error);
      // Even if localStorage fails, still hide the wizard
      setShowOnboarding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" data-o-auth-required>
      {/* Members Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">TeleCheck</h1>
              <p className="text-xs text-white/70 hidden sm:block">Members Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="blue"
              size="sm"
              onClick={() => navigate('/clinic-analysis')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Clinic Analysis
            </Button>
            <Button
              variant="blue"
              size="sm"
              onClick={() => navigate('/reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              My Reports
            </Button>
            {isAdmin && (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/admin')}
                className="bg-primary hover:bg-primary/90"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}

            {/* Account dropdown using Outseta's no-code approach */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-foreground/20 text-foreground hover:bg-foreground/10">
                  <User className="h-4 w-4 mr-2" />
                  <span data-o-member="FirstName">Member</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-o-profile
                  data-mode="popup"
                  onClick={() => {
                    console.log('Profile clicked, Outseta available:', !!window.Outseta);
                    if (window.Outseta) {
                      console.log('JWT Payload:', window.Outseta.getJwtPayload());
                    }
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-o-logout-link
                  onClick={() => {
                    console.log('Logout clicked');
                    if (window.Outseta && window.Outseta.auth) {
                      window.Outseta.auth.logout();
                    }
                    navigate('/');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, <span data-o-member="FirstName">Member</span>!
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-6 max-w-2xl mx-auto">
            Check telehealth eligibility and manage your saved searches
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="pb-6 sm:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Main tools grid - Full access for subscribers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <PostcodeChecker />
              <SavedChecks />
            </div>

            {/* Billing Management Section - Show for all authenticated users */}
            <div className="mt-8">
              <div className="text-center">
                <ManageBilling />
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-8">
              <div className="max-w-2xl mx-auto">
                <CustomerFeedback />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Member Onboarding Wizard - Show for new subscribers */}
      {showOnboarding && (
        <MemberOnboarding
          onComplete={handleOnboardingComplete}
          userEmail={userEmail}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Members;