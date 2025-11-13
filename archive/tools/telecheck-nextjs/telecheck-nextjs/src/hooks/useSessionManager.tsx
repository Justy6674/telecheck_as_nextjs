import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  last_active: string;
  created_at: string;
  current: boolean;
  timezone: string;
  user_agent: string;
}

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get real browser information
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Android')) os = 'Android';

    return { browser, os, userAgent };
  };

  // Get real timezone
  const getTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Australia/Sydney'; // Fallback
    }
  };

  // Get real IP and location
  const getLocationInfo = async (): Promise<{ ip: string; location: string }> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip || 'Unknown',
        location: `${data.city || 'Unknown'}, ${data.region || ''} ${data.country_name || ''}`.trim()
      };
    } catch (error) {
      console.error('Failed to get location info:', error);
      return { ip: 'Unknown', location: 'Unknown' };
    }
  };

  // Create or update current session
  const updateCurrentSession = async () => {
    if (!user?.id) return;

    try {
      const { browser, os, userAgent } = getBrowserInfo();
      const timezone = getTimezone();
      const { ip, location } = await getLocationInfo();

      const sessionData = {
        user_id: user.id,
        session_token: crypto.randomUUID(),
        device_fingerprint: `${browser}-${os}-${navigator.platform}`,
        ip_address: ip,
        user_agent: userAgent,
        last_activity: new Date().toISOString(),
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        is_active: true,
        metadata: {
          browser,
          os,
          timezone,
          location
        }
      };

      // Insert or update session
      const { data, error } = await supabase
        .from('user_sessions')
        .upsert(sessionData, { 
          onConflict: 'user_id,ip_address,user_agent'
        })
        .select()
        .single();

      if (error) throw error;

      const metadata = data.metadata as any;
      const currentSessionInfo: SessionInfo = {
        id: data.id,
        device: `${browser} on ${os}`,
        browser: metadata?.browser || browser,
        os: metadata?.os || os,
        location: metadata?.location || location,
        ip: data.ip_address || ip,
        last_active: data.last_activity,
        created_at: data.created_at,
        current: true,
        timezone: metadata?.timezone || timezone,
        user_agent: data.user_agent
      };

      setCurrentSession(currentSessionInfo);
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  // Load all user sessions
  const loadSessions = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      const sessionList: SessionInfo[] = data.map(session => {
        const metadata = session.metadata as any;
        return {
          id: session.id,
          device: `${metadata?.browser || 'Unknown'} on ${metadata?.os || 'Unknown'}`,
          browser: metadata?.browser || 'Unknown',
          os: metadata?.os || 'Unknown',
          location: metadata?.location || 'Unknown',
          ip: session.ip_address || 'Unknown',
          last_active: session.last_activity,
          created_at: session.created_at,
          current: session.ip_address === currentSession?.ip && 
                  session.user_agent === currentSession?.user_agent,
          timezone: metadata?.timezone || 'Unknown',
          user_agent: session.user_agent || ''
        };
      });

      setSessions(sessionList);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  // Sign out other sessions
  const signOutOtherSessions = async () => {
    if (!user?.id || !currentSession) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false,
          ended_at: new Date().toISOString(),
          end_reason: 'user_signout'
        })
        .eq('user_id', user.id)
        .neq('id', currentSession.id);

      if (error) throw error;

      await loadSessions();
    } catch (error) {
      console.error('Failed to sign out other sessions:', error);
    }
  };

  // Sign out specific session
  const signOutSession = async (sessionId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false,
          ended_at: new Date().toISOString(),
          end_reason: 'user_signout'
        })
        .eq('id', sessionId);

      if (error) throw error;

      await loadSessions();
    } catch (error) {
      console.error('Failed to sign out session:', error);
    }
  };

  useEffect(() => {
    if (user) {
      updateCurrentSession().then(() => {
        loadSessions().finally(() => setLoading(false));
      });

      // Update session activity every 5 minutes
      const interval = setInterval(updateCurrentSession, 5 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    sessions,
    currentSession,
    loading,
    signOutOtherSessions,
    signOutSession,
    refreshSessions: loadSessions,
    updateCurrentSession
  };
};