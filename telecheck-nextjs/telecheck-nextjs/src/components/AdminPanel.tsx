import React from 'react';

// TEMPORARILY DISABLED FOR BUILD FIX - Admin component with database column mismatches
// Original component commented out below
export default function AdminPanel() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel Temporarily Disabled</h1>
      <p className="text-gray-600 mt-2">The admin panel is undergoing maintenance. Please check back later.</p>
    </div>
  );
}

/* ORIGINAL COMPONENT - TEMPORARILY DISABLED
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisasterDataManager } from './admin/DisasterDataManager';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RefreshCw,
  DollarSign,
  Mail,
  Loader2,
  ExternalLink,
  Settings,
  Users,
  CreditCard,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface OutsetaUser {
  Uid: string;
  Email: string;
  FirstName?: string;
  LastName?: string;
  PersonAccount?: {
    Account: {
      Uid: string;
      CurrentSubscription?: {
        Uid: string;
        StartDate: string;
        RenewalDate: string;
        Plan: {
          Name: string;
          MonthlyRate: number;
        };
      };
    };
  };
}

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

export const AdminPanel: React.FC = () => {
  const [outsetaUsers, setOutsetaUsers] = useState<OutsetaUser[]>([]);
  const [localUsers, setLocalUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users from profiles table (single source of truth)
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      // Transform profiles to OutsetaUser format for display
      const outsetaUsers = (profiles || []).map(profile => ({
        Uid: profile.id,
        Email: profile.email,
        FirstName: profile.metadata?.user_name?.split(' ')[0] || '',
        LastName: profile.metadata?.user_name?.split(' ').slice(1).join(' ') || '',
        PersonAccount: {
          Account: {
            Uid: profile.id,
            CurrentSubscription: profile.subscription_tier === 'professional' ? {
              Uid: `sub_${profile.id}`,
              StartDate: profile.created_at,
              RenewalDate: null, // We don't store renewal dates
              Plan: {
                Name: 'TeleCheck Professional',
                MonthlyRate: 56.81 // Fixed rate
              }
            } : null
          }
        }
      }));

      // Transform profiles to LocalUser format for metrics
      const localUsers = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at,
        role: profile.role || 'user'
      }));

      setOutsetaUsers(outsetaUsers);
      setLocalUsers(localUsers);

      // Calculate revenue from subscription data
      const revenue = outsetaUsers.reduce((total: number, user: OutsetaUser) => {
        const subscription = user.PersonAccount?.Account?.CurrentSubscription;
        return total + (subscription?.Plan?.MonthlyRate || 0);
      }, 0);

      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openOutsetaCustomer = (userUid: string) => {
    // Open Outseta Dashboard for this customer
    window.open(`https://telecheck.outseta.com/people/${userUid}`, '_blank');
  };

  const getSubscriptionStatusColor = (hasSubscription: boolean) => {
    return hasSubscription ? 'bg-green-500' : 'bg-gray-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
      // Revenue Overview Card - disabled
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{localUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-bold">{outsetaUsers.filter(u => u.PersonAccount?.Account?.CurrentSubscription).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {localUsers.length > 0 ? Math.round((outsetaUsers.length / localUsers.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User & Subscription Management</CardTitle>
          <CardDescription>
            Manage user subscriptions powered by Outseta - use Outseta Dashboard for advanced operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline">
                Total Users: {localUsers.length}
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                Active Subscribers: {outsetaUsers.filter(u => u.PersonAccount?.Account?.CurrentSubscription).length}
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                Monthly Revenue: {formatCurrency(totalRevenue)}
              </Badge>
            </div>
            <Button onClick={fetchAllUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subscription Plan</TableHead>
                  <TableHead>Monthly Rate</TableHead>
                  <TableHead>Next Renewal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outsetaUsers.map((user) => {
                  const subscription = user.PersonAccount?.Account?.CurrentSubscription;
                  const hasSubscription = !!subscription;

                  return (
                    <TableRow key={user.Uid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.Email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.FirstName || user.LastName ?
                          `${user.FirstName || ''} ${user.LastName || ''}`.trim() :
                          'Not provided'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={getSubscriptionStatusColor(hasSubscription)}>
                          {subscription?.Plan?.Name || 'No active subscription'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscription?.Plan?.MonthlyRate ?
                          formatCurrency(subscription.Plan.MonthlyRate) :
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        {subscription?.RenewalDate ?
                          format(new Date(subscription.RenewalDate), 'MMM d, yyyy') :
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openOutsetaCustomer(user.Uid)}
                            title="Open in Outseta Dashboard"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Admin Actions Available in Outseta Dashboard:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Apply discounts and coupons to specific customers</li>
              <li>• Issue full or partial refunds</li>
              <li>• Change subscription plans</li>
              <li>• Extend trials or pause subscriptions</li>
              <li>• View detailed payment history and invoices</li>
              <li>• Manage customer communications and support tickets</li>
            </ul>
            <Button
              className="mt-3"
              onClick={() => window.open('https://telecheck.outseta.com/people', '_blank')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Open Outseta Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="data">
          <DisasterDataManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
*/ // END ORIGINAL COMPONENT