import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, DollarSign, ExternalLink, Settings, BarChart3 } from 'lucide-react';

/**
 * Outseta Admin Tools
 * Direct links to Outseta dashboard for subscription and customer management
 */
export const AdminOutsetaTools = () => {
  const { toast } = useToast();

  const openOutsetaDashboard = (section: string) => {
    const baseUrl = 'https://telecheck.outseta.com';
    const urls = {
      customers: `${baseUrl}/app/crm/people`,
      subscriptions: `${baseUrl}/app/billing/subscriptions`,
      revenue: `${baseUrl}/app/billing/revenue`,
      settings: `${baseUrl}/app/settings`,
      support: `${baseUrl}/app/support/tickets`,
      analytics: `${baseUrl}/app/analytics`
    };

    const url = urls[section as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Invalid section specified",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Outseta Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Management */}
            <Card className="border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customer Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => openOutsetaDashboard('customers')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Customers
                </Button>
                <Badge variant="secondary" className="w-full justify-center">
                  Manage users, profiles, and accounts
                </Badge>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <Card className="border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Billing & Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => openOutsetaDashboard('subscriptions')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Subscriptions
                </Button>
                <Button
                  onClick={() => openOutsetaDashboard('revenue')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Revenue Analytics
                </Button>
                <Badge variant="secondary" className="w-full justify-center">
                  Plans, invoices, and payments
                </Badge>
              </CardContent>
            </Card>

            {/* Support Management */}
            <Card className="border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Support Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => openOutsetaDashboard('support')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Support Tickets
                </Button>
                <Badge variant="secondary" className="w-full justify-center">
                  Help desk and knowledge base
                </Badge>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => openOutsetaDashboard('analytics')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  onClick={() => openOutsetaDashboard('settings')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Badge variant="secondary" className="w-full justify-center">
                  Business metrics and configuration
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">✅ Outseta Integration Active</h4>
            <p className="text-sm text-slate-300">
              All subscription management is now handled by Outseta. No more Stripe issues!
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1">
              <li>• Payments: Outseta handles all billing</li>
              <li>• Auth: Outseta manages user accounts</li>
              <li>• Support: Built-in help desk system</li>
              <li>• Analytics: Real-time business metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};