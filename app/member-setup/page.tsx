"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MemberOnboarding from '@/components/MemberOnboarding';

export default function MemberSetup() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to home (Outseta handles password setup)
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // If user is authenticated, show onboarding
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
          <MemberOnboarding onComplete={() => router.push('/members')} userEmail={user.Email || ''} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-6">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Setting up your account...</h2>
        <p className="text-slate-300">Please complete your registration with Outseta first.</p>
      </div>
    </div>
  );
}


