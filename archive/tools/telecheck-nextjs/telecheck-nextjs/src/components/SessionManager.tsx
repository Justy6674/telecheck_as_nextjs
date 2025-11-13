import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useToast } from '@/hooks/use-toast';

export const SessionManager: React.FC = () => {
  const { sessions, loading, signOutOtherSessions, signOutSession } = useSessionManager();
  const { toast } = useToast();

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('tablet') || device.toLowerCase().includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const handleSignOutOther = async () => {
    await signOutOtherSessions();
    toast({
      title: 'Sessions Signed Out',
      description: 'All other sessions have been terminated.',
    });
  };

  const handleSignOutSession = async (sessionId: string) => {
    await signOutSession(sessionId);
    toast({
      title: 'Session Signed Out',
      description: 'Session has been terminated.',
    });
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading sessions...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Active Sessions</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your active login sessions across devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded-lg">
            <div className="space-y-1">
              <div className="font-medium flex items-center gap-2 text-foreground">
                {getDeviceIcon(session.device)}
                {session.device}
                {session.current && <Badge variant="default" className="text-xs">Current</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {session.location} • {session.ip}
              </div>
              <div className="text-sm text-muted-foreground">
                {session.timezone}
              </div>
              <div className="text-xs text-muted-foreground">
                Last active: {new Date(session.last_active).toLocaleString()}
              </div>
            </div>
            {!session.current && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSignOutSession(session.id)}
              >
                Sign Out
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleSignOutOther}>
          Sign Out Other Sessions
        </Button>
      </CardFooter>
    </Card>
  );
};