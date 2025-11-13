import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserX,
  Gift,
  RefreshCw,
  DollarSign,
  Calendar,
  Mail,
  AlertCircle,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface User {
  user_id: string;
  email: string;
  created_at: string;
  subscription_tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
}

export function UserSubscriptionManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<'cancel' | 'discount' | 'refund' | null>(null);
  const [discountPercent, setDiscountPercent] = useState('20');
  const [refundAmount, setRefundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data ?? []) as unknown as User[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      const message = error instanceof Error ? error.message : 'Unexpected error occurred';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (user: User) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-cancel-subscription', {
        body: {
          subscriptionId: user.stripe_subscription_id,
          userId: user.user_id
        }
      });

      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description: `Cancelled subscription for ${user.email}`,
      });

      // Update local state
      setUsers(users.map(u =>
        u.user_id === user.user_id
          ? { ...u, stripe_subscription_status: 'canceled', subscription_tier: 'free' }
          : u
      ));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const applyDiscount = async (user: User) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-apply-discount', {
        body: {
          customerId: user.stripe_customer_id,
          percentOff: parseInt(discountPercent),
          duration: 'repeating',
          durationInMonths: 3
        }
      });

      if (error) throw error;

      toast({
        title: "Discount Applied",
        description: `Applied ${discountPercent}% discount to ${user.email}`,
      });
    } catch (error) {
      console.error('Error applying discount:', error);
      toast({
        title: "Error",
        description: "Failed to apply discount",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const issueRefund = async (user: User) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-issue-refund', {
        body: {
          customerId: user.stripe_customer_id,
          amount: Math.round(parseFloat(refundAmount) * 100) // Convert to cents
        }
      });

      if (error) throw error;

      toast({
        title: "Refund Issued",
        description: `Refunded $${refundAmount} to ${user.email}`,
      });
    } catch (error) {
      console.error('Error issuing refund:', error);
      toast({
        title: "Error",
        description: "Failed to issue refund",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setActionDialog(null);
      setSelectedUser(null);
      setRefundAmount('');
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'canceled': return 'bg-red-500';
      case 'past_due': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Subscription Management</CardTitle>
          <CardDescription>
            Manage user subscriptions, apply discounts, and process refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline">
                Total Users: {users.length}
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                Active: {users.filter(u => u.stripe_subscription_status === 'active').length}
              </Badge>
              <Badge variant="outline" className="bg-red-50">
                Cancelled: {users.filter(u => u.stripe_subscription_status === 'canceled').length}
              </Badge>
            </div>
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.subscription_tier === 'professional' ? 'default' : 'secondary'}>
                        {user.subscription_tier || 'free'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.stripe_subscription_status && (
                        <Badge className={getStatusColor(user.stripe_subscription_status)}>
                          {user.stripe_subscription_status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.stripe_subscription_status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog('cancel');
                              }}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog('discount');
                              }}
                            >
                              <Gift className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog('refund');
                              }}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={actionDialog === 'cancel'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the subscription for {selectedUser?.email}?
              This action will take effect at the end of their billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && cancelSubscription(selectedUser)}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Discount Dialog */}
      <Dialog open={actionDialog === 'discount'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
            <DialogDescription>
              Apply a discount to {selectedUser?.email}'s subscription
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount %
              </Label>
              <Input
                id="discount"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="col-span-3"
                type="number"
                min="5"
                max="100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Duration</Label>
              <div className="col-span-3">
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && applyDiscount(selectedUser)}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Apply Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Refund Dialog */}
      <Dialog open={actionDialog === 'refund'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Issue a refund to {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (AUD)
              </Label>
              <Input
                id="amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="col-span-3"
                type="number"
                step="0.01"
                placeholder="56.81"
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will immediately refund the specified amount to the customer's original payment method.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && issueRefund(selectedUser)}
              disabled={processing || !refundAmount}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Issue Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}