'use client';

import { useOutsetaUser } from './useOutsetaUser';

export interface Entitlements {
  professional: boolean;
  admin: boolean;
  clinic_analysis: boolean;
  pdf_exports: boolean;
  priority_support: boolean;
  unlimited_users: boolean;
  postcode_checks: string | number;
}

export function useEntitlements() {
  const { user, isAuthenticated, isLoading, hasActiveSubscription } = useOutsetaUser();

  if (!isAuthenticated || !user) {
    return {
      entitlements: {
        professional: false,
        admin: false,
        clinic_analysis: false,
        pdf_exports: false,
        priority_support: false,
        unlimited_users: false,
        postcode_checks: 0,
      } as Entitlements,
      loading: isLoading,
      hasActiveSubscription: false,
    };
  }

  // Check if user is admin
  const isAdmin = (user.Email || '').toLowerCase() === 'doenscale@icloud.com';

  // CRITICAL FIX: All authenticated users are considered professional users
  // Since hasActiveSubscription is true for all authenticated users in useOutsetaUser
  const isProfessionalUser = hasActiveSubscription || isAdmin;

  return {
    entitlements: {
      professional: isProfessionalUser,
      admin: isAdmin,
      clinic_analysis: isProfessionalUser,
      pdf_exports: isProfessionalUser,
      priority_support: isProfessionalUser,
      unlimited_users: isProfessionalUser,
      postcode_checks: isProfessionalUser ? 'unlimited' : 5,
    } as Entitlements,
    loading: isLoading,
    hasActiveSubscription: hasActiveSubscription || isAdmin,
  };
}