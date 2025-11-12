"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Activity, Shield, Zap, Users, Clock, CheckCircle, ArrowRight, ArrowDown, ArrowUp, Phone, Monitor, Stethoscope, Settings, MapPin, FileText, AlertTriangle, ChevronLeft, ChevronRight, ChevronDown, Heart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { ComingSoonDialog } from "@/src/components/ComingSoonDialog";
import { AuthDialog } from "@/src/components/AuthDialog";
import { LoginDialog } from "@/src/components/LoginDialog";
import AdminPanel from "@/src/components/AdminPanel";
import { LiveInTwoWeeksDialog } from "@/src/components/LiveInTwoWeeksDialog";
import { useAuth } from "@/src/hooks/useAuth";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { Logo } from "@/src/components/Logo";
import { BWHero } from "@/src/components/BWHero";
import { MiniDisasterCounter } from "@/src/components/MiniDisasterCounter";
import PatientEligibilityChecker from "@/src/components/PatientEligibilityChecker";
import { supabase } from "@/src/integrations/supabase/client";

// Hero image from Supabase Storage
const HERO_IMAGE_URL = "https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/hero-images/TCHeroFrontPage.png";
export const Landing = () => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [liveInTwoWeeksOpen, setLiveInTwoWeeksOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const redirectAttempted = useRef(false);

  const handleSubscribeClick = () => {
    // Take everyone to pricing page
    router.push('/pricing');
  };
  // REMOVED: Automatic redirect to members - let users stay on home page if they want
  // Users can manually click "Go to Dashboard" if they want to access members area

  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen site-bg flex items-center justify-center">
        <div className="text-center">
          <Logo className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p className="text-foreground/80">Loading...</p>
          <p className="text-xs text-foreground/60 mt-2">Debug: loading={String(loading)}, user={user?.email || 'none'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)'}}>
      {/* Dark theme background effects */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.5), transparent, rgba(30, 41, 59, 0.3))'}}></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <Header />
      
        <BWHero
          title="TeleCheck"
          subtitle="Check Medicare Telehealth Eligibility"
          description={
            <>
              An app to help patients and practitioners determine Medicare telehealth eligibility
            </>
          }
          backgroundImage={HERO_IMAGE_URL}
        >
          {/* Clean Subscribe Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={handleSubscribeClick}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 font-bold px-8 py-6 text-lg shadow-2xl hover:shadow-red-500/25 transition-all hover:scale-105"
            >
              Subscribe $56.81/month
            </Button>
          </div>
        </BWHero>

        {/* Who is this for? Section */}
        <section className="py-16 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)'}}>
          {/* Modern background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-32"></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(15, 23, 42, 0.2), transparent, rgba(30, 41, 59, 0.2))'}}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="w-full max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Who is this for?</h3>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">Choose your path to Medicare telehealth eligibility</p>
              </div>
              
              {/* Cards - responsive layout with equal heights */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Patients Card */}
                <div className="flex-1 bg-black/30 backdrop-blur-xl border-2 border-blue-400/30 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/60 hover:ring-4 hover:ring-blue-400/20 hover:shadow-blue-500/30 hover:bg-black/40 min-h-[480px] flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-blue-400/20">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">For Patients</h4>
                    <p className="text-blue-200/80 text-base">Quick eligibility check for Medicare rebates</p>
                  </div>
                  <ul className="space-y-4 mb-8 text-white flex-grow">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                      <span className="text-base">Check eligibility instantly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                      <span className="text-base">Find disaster exemptions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                      <span className="text-base">Know your Medicare rebate eligibility</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => scrollToSection('exemptions')}
                    size="lg"
                    variant="blue"
                    className="w-full font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    Start Quick Check
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>

                {/* Practitioners Card */}
                <div className="flex-1 bg-black/30 backdrop-blur-xl border-2 border-red-400/30 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-red-400/60 hover:ring-4 hover:ring-red-400/20 hover:shadow-red-500/30 hover:bg-black/40 min-h-[480px] flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-red-400/20">
                      <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">For Practitioners</h4>
                    <p className="text-red-200/80 text-base">Professional tools for clinic management</p>
                  </div>
                  <ul className="space-y-4 mb-8 text-white flex-grow">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                      <span className="text-base">Bulk patient analysis</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                      <span className="text-base">Generate clinic reports</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                      <span className="text-base">Save & export patient checks</span>
                    </li>
                  </ul>
                  <Button
                    onClick={handleSubscribeClick}
                    size="lg"
                    className="w-full font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  >
                    Subscribe $56.81/month
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Important notice - compact */}
              <div className="mt-8 px-4">
                <div className="bg-black/70 backdrop-blur-lg border border-orange-400/50 rounded-lg p-4 max-w-3xl mx-auto shadow-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Important Notice</h3>
                      <p className="text-sm text-white/90 leading-relaxed">
                        If you haven't seen your practitioner/GP in the last 12 months, you need to fit an exemption category or private billing usually applies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Sample Report Preview Section - THIS IS WHAT YOU'RE PAYING FOR */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                💰 See What You Get With Your Subscription
              </h3>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
                Professional clinic analysis reports that help you identify Medicare telehealth opportunities
              </p>
            </div>

            {/* Report Preview Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Geographic Intelligence Preview */}
              <div className="bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-8 h-8 text-purple-400" />
                  <h4 className="text-xl font-bold text-white">Geographic Intelligence Report</h4>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Patient Distribution</span>
                    <span className="text-green-400 font-bold">5,420 postcodes analyzed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Virtual Catchment</span>
                    <span className="text-blue-400 font-bold">Australia-wide</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Telehealth Reach</span>
                    <span className="text-purple-400 font-bold">No distance limitations</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">State Coverage</span>
                    <span className="text-amber-400 font-bold">NSW 42%, VIC 31%, QLD 27%</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-sm text-white/90">
                    <strong>Pattern Analysis:</strong> Your telehealth-only practice has unlimited geographic reach with 85% of patients in disaster-affected areas eligible for Medicare rebates.
                  </p>
                </div>
              </div>

              {/* Medicare Eligibility Preview */}
              <div className="bg-black/40 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-8 h-8 text-green-400" />
                  <h4 className="text-xl font-bold text-white">Medicare Eligibility Analysis</h4>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Disasters</span>
                    <span className="text-green-400 font-bold">387 eligible zones</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Overall Eligibility</span>
                    <span className="text-green-400 font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">MBS Item 91189</span>
                    <span className="text-green-400 font-bold">Qualified ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Revenue Opportunity</span>
                    <span className="text-yellow-400 font-bold">$39.10 per consult</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-white/90">
                    <strong>Time-Based Risk:</strong> 12-month window (65%), 2-year window (20%), 5+ years (15%). Focus on recent disaster zones for highest Medicare compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-white/70 mb-6 text-lg">
                Full analysis includes 40+ metrics across geographic, Medicare, operational, and business intelligence categories
              </p>
              <Button
                size="lg"
                onClick={handleSubscribeClick}
                variant="red"
                className="font-bold px-10 py-6 text-xl shadow-2xl hover:shadow-red-500/25 transition-all hover:scale-105 bg-gradient-to-r from-red-500 to-pink-500"
              >
                Subscribe $56.81/month - Get Analysis
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <p className="text-white/60 mt-4 text-sm">
                $56.81 AUD/month • Instant access • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Medicare Exemption Criteria Section */}
        <section id="exemptions" className="py-20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-gray-900 border-t-4 border-primary/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-success rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="scroll-reveal max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-4 bg-gray-900/60 backdrop-blur-lg border-2 border-primary/40 rounded-full px-8 py-4 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <CheckCircle className="h-8 w-8 animate-pulse" />
                  <span className="text-2xl font-bold text-white">Medicare Eligibility Check</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                  Do You Qualify for <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Medicare Telehealth Rebates?</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Check if you meet any exemption criteria below to access Medicare rebates without the 12-month relationship requirement
                </p>
              </div>
              
              {/* Enhanced Exemption Cards */}
              <div className="bg-slate-900/80 backdrop-blur-lg border-2 border-slate-600/50 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 relative mb-12">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-success/20 to-transparent rounded-tr-full opacity-50"></div>
                
                
                <div className="relative z-10">
                  {/* Clear qualifying statement */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-green-500/20 backdrop-blur-sm border-2 border-green-400/40 rounded-full px-6 py-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <span className="text-base font-semibold text-green-400">You may be eligible right now</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      If ANY of these apply, you can access Medicare telehealth rebates — no 12-month relationship needed.
                    </h3>
                  </div>
                  
                  {/* Mobile scroll indicator */}
                  
                  {/* Modern Eligibility List */}
                  <div className="max-w-4xl mx-auto space-y-3">
                     {/* Under 12 months */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                       <div className="flex items-center gap-3 sm:gap-4 w-full">
                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-bold text-sm">1</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">Under 12 months old?</h4>
                           <p className="text-gray-700 text-sm sm:text-base leading-snug">Children under 12 months are exempt from the relationship requirement</p>
                         </div>
                       </div>
                     </div>

                     {/* Experiencing homelessness */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                       <div className="flex items-center gap-3 sm:gap-4 w-full">
                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-bold text-sm">2</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">Experiencing homelessness?</h4>
                           <p className="text-gray-700 text-sm sm:text-base leading-snug">People who are homeless are exempt from the relationship requirement</p>
                         </div>
                       </div>
                     </div>

                     {/* Aboriginal Medical Service */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                       <div className="flex items-center gap-3 sm:gap-4 w-full">
                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-bold text-sm">3</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">Aboriginal Medical Service patient?</h4>
                           <p className="text-gray-700 text-sm sm:text-base leading-snug">Patients of Aboriginal Medical Services are exempt</p>
                         </div>
                       </div>
                     </div>

                     {/* COVID-19 */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                       <div className="flex items-center gap-3 sm:gap-4 w-full">
                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-bold text-sm">4</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">COVID-19 isolation/quarantine?</h4>
                           <p className="text-gray-700 text-sm sm:text-base leading-snug">Due to State/Territory public health orders</p>
                         </div>
                       </div>
                     </div>

                     {/* Natural disaster - FEATURED */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                       <div className="flex items-center gap-3 sm:gap-4 w-full">
                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-bold text-sm">5</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1 sm:mb-2">
                             <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">Natural disaster area resident?</h4>
                             <div className="flex items-center gap-1 bg-green-100 border border-green-300 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                               <span>LIVE</span>
                             </div>
                           </div>
                           <p className="text-gray-700 text-sm sm:text-base leading-snug mb-3">Living in declared natural disaster LGA</p>
                           <div className="flex flex-col gap-2">
                             <button 
                               onClick={() => scrollToSection('checker')} 
                               className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                             >
                               📍 Check Your Postcode Now
                             </button>
                             <div className="w-full">
                               <MiniDisasterCounter />
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Sexual/reproductive health */}
                     <div className="bg-slate-100 border-2 border-slate-400 rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[100px] flex items-center">
                      <div className="flex items-center gap-3 sm:gap-4 w-full">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">6</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">Sexual/reproductive health consultation?</h4>
                          <p className="text-gray-700 text-sm sm:text-base leading-snug">Blood Borne Virus and Sexual/Reproductive Health consultations are exempt</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Important Update Notice */}
                  <div className="text-center">
                    <div className="mt-6 md:mt-8 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-2 border-accent/40 rounded-2xl p-6 shadow-inner backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Clock className="h-6 w-6 animate-spin-slow" />
                        <span className="text-base font-semibold">Important Update</span>
                      </div>
                      <div className="text-base text-white leading-relaxed">
                        <strong>Note:</strong> From 1 Nov 2025, new clinical relationship criteria apply to Nurse Practitioner telehealth items with the same exemptions above.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="prominent"
                  className="px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg rounded-2xl w-full sm:w-auto min-h-[48px]"
                  onClick={() => scrollToSection('checker')}
                >
                  Check My Area for Disaster Declarations
                  <ArrowDown className="ml-3 h-6 w-6 animate-bounce-horizontal" />
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Enhanced Patient/Client Eligibility Section */}
      <section id="checker" className="py-20 mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 border-t-4 border-primary/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-success rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="scroll-reveal max-w-6xl mx-auto">
            {/* Enhanced Patient Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 bg-slate-900/60 backdrop-blur-lg border-2 border-blue-500/40 rounded-full px-8 py-4 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <Stethoscope className="h-8 w-8 text-blue-400 animate-pulse" />
                <span className="text-2xl font-bold text-white">For Australian Healthcare Consumers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Check Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Medicare Rebate Status</span>
              </h2>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                Enter your postcode to see if you can claim Medicare telehealth rebates due to disaster declarations in your area
              </p>
            </div>
            
            {/* Enhanced Bordered Content Area */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-slate-900/90 backdrop-blur-lg border-4 border-blue-500/70 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-500 relative hover:border-blue-400/80 text-left h-auto"
            >
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-success/20 to-transparent rounded-tl-full"></div>
              
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      📱 Telehealth Eligibility Checker
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      <strong>Haven't seen your practitioner in person for 12+ months?</strong><br />
                      Check if you qualify for Medicare telehealth rebates through disaster exemptions or other special circumstances.
                    </p>
                    <Button 
                      variant="prominent" 
                      size="lg" 
                      className="mt-6 text-lg px-8 py-6 min-h-[56px] pointer-events-none"
                    >
                      Click to check your eligibility • Takes 30 seconds
                    </Button>
                  </div>
                  <ChevronDown className="h-8 w-8 text-blue-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="bg-slate-900/90 backdrop-blur-lg border-4 border-blue-500/70 rounded-3xl p-10 shadow-2xl shadow-blue-500/20 hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-500 relative hover:border-blue-400/80 mt-4">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-success/20 to-transparent rounded-tl-full"></div>
              
              <div className="relative z-10">
                <PatientEligibilityChecker />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="scroll-reveal text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Built for Australian Healthcare Consumers</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Transparent information about your Medicare entitlements and rebate opportunities
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="floating-tile bg-none bg-slate-900/90 animate-float group border-2 border-blue-500/50 hover:border-blue-400/70 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center mb-6 group-hover:animate-glow backdrop-blur-sm">
                  <Stethoscope className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Empower Your Practitioner</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Provide your healthcare practitioner with verified disaster data to confidently claim Medicare rebates.
                </p>
              </CardContent>
            </Card>

            <Card className="floating-tile bg-none bg-slate-900/90 animate-float group border-2 border-blue-500/50 hover:border-blue-400/70 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/40 rounded-full flex items-center justify-center mb-6 group-hover:animate-glow backdrop-blur-sm">
                  <Shield className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Know Your Medicare Eligibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand exactly when you're entitled to Medicare telehealth rebates during disaster periods.
                </p>
              </CardContent>
            </Card>

            <Card className="floating-tile bg-none bg-slate-900/90 animate-float group border-2 border-blue-500/50 hover:border-blue-400/70 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/40 rounded-full flex items-center justify-center mb-6 group-hover:animate-glow backdrop-blur-sm">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Consumer & Practitioner Partnership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bridge the gap between consumer awareness and practitioner verification for seamless Medicare claims.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="scroll-reveal text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">How TeleCheck Works</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Empowering both consumers and practitioners with Medicare rebate clarity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For You (Consumer) */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-blue-400">For Consumer/Patient</h3>
              
              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <MapPin className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-blue-400">Check your postcode</h4>
                <p className="text-white/80 text-sm">
                  Enter your postcode to check for disaster declarations in your area
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-blue-400">Get your summary</h4>
                <p className="text-white/80 text-sm">
                  Receive a clear summary of your Medicare rebate status
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <Stethoscope className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-blue-400">Discuss with practitioner</h4>
                <p className="text-white/80 text-sm">
                  Discuss your eligibility status with your practitioner during your consultation
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-blue-400">Claim your rebates</h4>
                <p className="text-white/80 text-sm">
                  Your practitioner can confidently bill Medicare for eligible consultations
                </p>
              </div>
            </div>

            {/* For Your Practitioner */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-red-400">For Your Practitioner</h3>
              
              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <Shield className="h-8 w-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-red-400">Official verification</h4>
                <p className="text-white/80 text-sm">
                  Access official disaster declaration data from government sources
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <Activity className="h-8 w-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-red-400">Real-time updates</h4>
                <p className="text-white/80 text-sm">
                  Monitor disaster declarations with 24/7 automated updates
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <Settings className="h-8 w-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-red-400">Easy access</h4>
                <p className="text-white/80 text-sm">
                  Quick verification tool for checking patient disaster exemption status
                </p>
              </div>

              <div className="floating-tile bg-none bg-slate-800/95 text-center p-6 group border-2 border-blue-500/60 hover:border-blue-400/80 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow backdrop-blur-sm">
                  <Zap className="h-8 w-8 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-red-400">Confident billing</h4>
                <p className="text-white/80 text-sm">
                  Bill Medicare with confidence using verified disaster exemption data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />

      <ComingSoonDialog 
        open={comingSoonOpen} 
        onOpenChange={setComingSoonOpen}
      />
      <AuthDialog 
        open={authOpen} 
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          // Let Outseta handle redirects naturally
          console.log('Auth success - letting Outseta handle redirect');
        }}
      />
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
      />

      {adminPanelOpen && <AdminPanel />}

      <LiveInTwoWeeksDialog
        open={liveInTwoWeeksOpen}
        onOpenChange={setLiveInTwoWeeksOpen}
        onContinue={() => {
          // Navigate to pricing page for clean checkout
          router.push('/pricing');
        }}
      />
    </div>
  );
};