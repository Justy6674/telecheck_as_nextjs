import React from 'react';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, ArrowRight } from 'lucide-react';

interface RequireFeatureProps {
  feature: 'professional' | 'clinic_analysis' | 'pdf_exports' | 'priority_support' | 'unlimited_users';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

/**
 * STRIPE SAAS BLUEPRINT: Feature gating component
 * Shows content only if user has the required feature entitlement
 */
export const RequireFeature: React.FC<RequireFeatureProps> = ({
  feature,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { entitlements, loading, hasActiveSubscription } = useEntitlements();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const hasFeature = entitlements[feature];

  if (hasFeature) {
    return <>{children}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt if requested
  if (showUpgrade) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-lg text-gray-700">
            Professional Feature
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {getFeatureDescription(feature)} is available with TeleCheck Professional.
          </p>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-700 font-medium mb-2">
              Professional Plan Includes:
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Unlimited postcode checks</li>
              <li>✅ Bulk clinic analysis tools</li>
              <li>✅ PDF export capabilities</li>
              <li>✅ Priority customer support</li>
              <li>✅ Multiple users per clinic</li>
            </ul>
          </div>

          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Professional
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-gray-500">
            $56.81 AUD/month • Cancel anytime
          </p>
        </CardContent>
      </Card>
    );
  }

  // Just show a lock icon if no upgrade prompt requested
  return (
    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="text-center">
        <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Professional feature required</p>
      </div>
    </div>
  );
};

/**
 * Hook for checking feature access in code
 */
export const useFeatureAccess = () => {
  const { entitlements, hasActiveSubscription, loading } = useEntitlements();

  return {
    hasFeature: (feature: keyof typeof entitlements) => entitlements[feature] === true,
    hasUnlimitedChecks: entitlements.postcode_checks === 'unlimited',
    getRemainingChecks: () => entitlements.postcode_checks,
    hasActiveSubscription,
    loading,
    // Specific checks
    canUseClinicAnalysis: entitlements.clinic_analysis,
    canExportPDF: entitlements.pdf_exports,
    hasPrioritySupport: entitlements.priority_support,
    hasUnlimitedUsers: entitlements.unlimited_users,
  };
};

function getFeatureDescription(feature: string): string {
  switch (feature) {
    case 'professional':
      return 'Professional tier features';
    case 'clinic_analysis':
      return 'Bulk clinic analysis with 40 individual metrics';
    case 'pdf_exports':
      return 'PDF export functionality';
    case 'priority_support':
      return 'Priority customer support';
    case 'unlimited_users':
      return 'Multiple users per clinic';
    default:
      return 'This feature';
  }
}

export default RequireFeature;