import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface SessionDataStore {
  sessionId: string;
  uploadedAt: string;
  expiresAt: string;
  patientData: {
    postcodes: string[];
    totalPatients: number;
    uniquePostcodes: number;
  };
  clinicConfig: {
    practitionerCount: number;
    consultationMinutes: number;
    serviceModel: string;
    practiceName?: string;
  };
  metricCache: Map<string, {
    result: any;
    calculatedAt: string;
    isValid: boolean;
  }>;
  selectionHistory: Array<{
    timestamp: string;
    action: 'add' | 'remove';
    metrics: string[];
    reason?: string;
  }>;
}

interface SessionStorageData {
  sessionId: string;
  uploadedAt: string;
  expiresAt: string;
  patientData: {
    postcodes: string[];
    totalPatients: number;
    uniquePostcodes: number;
  };
  clinicConfig: {
    practitionerCount: number;
    consultationMinutes: number;
    serviceModel: string;
    practiceName?: string;
  };
  metricCache: Array<[string, {
    result: any;
    calculatedAt: string;
    isValid: boolean;
  }]>;
  selectionHistory: Array<{
    timestamp: string;
    action: 'add' | 'remove';
    metrics: string[];
    reason?: string;
  }>;
}

const SESSION_STORAGE_KEY = 'telecheck-clinic-analysis-session';
const DEFAULT_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

function serializeSessionData(data: SessionDataStore): SessionStorageData {
  return {
    ...data,
    metricCache: Array.from(data.metricCache.entries())
  };
}

function deserializeSessionData(data: SessionStorageData): SessionDataStore {
  return {
    ...data,
    metricCache: new Map(data.metricCache)
  };
}

export function useSessionDataStore() {
  const [sessionData, setSessionData] = useState<SessionDataStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session data on mount
  useEffect(() => {
    const loadSessionData = () => {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsedData: SessionStorageData = JSON.parse(stored);

          // Check if session has expired
          if (new Date() > new Date(parsedData.expiresAt)) {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            setSessionData(null);

            toast({
              title: "Session Expired",
              description: "Your analysis session has expired. Please upload your data again.",
              variant: "destructive"
            });
          } else {
            const deserializedData = deserializeSessionData(parsedData);
            setSessionData(deserializedData);
          }
        }
      } catch (error) {
        console.error('Failed to load session data:', error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, []);

  // Save session data to storage whenever it changes
  useEffect(() => {
    if (sessionData) {
      try {
        const serializedData = serializeSessionData(sessionData);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializedData));
      } catch (error) {
        console.error('Failed to save session data:', error);
        toast({
          title: "Storage Warning",
          description: "Failed to save session data. Your changes may be lost.",
          variant: "destructive"
        });
      }
    }
  }, [sessionData]);

  // Create new session
  const createSession = useCallback((
    postcodes: string[],
    clinicConfig: SessionDataStore['clinicConfig']
  ) => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const uploadedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + DEFAULT_SESSION_DURATION).toISOString();

    const newSession: SessionDataStore = {
      sessionId,
      uploadedAt,
      expiresAt,
      patientData: {
        postcodes,
        totalPatients: postcodes.length,
        uniquePostcodes: new Set(postcodes).size
      },
      clinicConfig,
      metricCache: new Map(),
      selectionHistory: [{
        timestamp: uploadedAt,
        action: 'add',
        metrics: [],
        reason: 'Session created'
      }]
    };

    setSessionData(newSession);
    return newSession;
  }, []);

  // Update session data
  const updateSession = useCallback((updates: Partial<SessionDataStore>) => {
    if (!sessionData) return;

    const updatedSession = {
      ...sessionData,
      ...updates,
      // Extend session if it's about to expire
      expiresAt: new Date(Date.now() + DEFAULT_SESSION_DURATION).toISOString()
    };

    setSessionData(updatedSession);
  }, [sessionData]);

  // Cache metric results
  const cacheMetricResult = useCallback((metricId: string, result: any) => {
    if (!sessionData) return;

    const newCache = new Map(sessionData.metricCache);
    newCache.set(metricId, {
      result,
      calculatedAt: new Date().toISOString(),
      isValid: true
    });

    updateSession({
      metricCache: newCache
    });
  }, [sessionData, updateSession]);

  // Get cached metric result
  const getCachedMetricResult = useCallback((metricId: string) => {
    if (!sessionData) return null;

    const cached = sessionData.metricCache.get(metricId);
    if (!cached || !cached.isValid) return null;

    // Check if cache is stale (older than 10 minutes)
    const cacheAge = Date.now() - new Date(cached.calculatedAt).getTime();
    if (cacheAge > 10 * 60 * 1000) {
      return null;
    }

    return cached.result;
  }, [sessionData]);

  // Add to selection history
  const addToSelectionHistory = useCallback((
    action: 'add' | 'remove',
    metrics: string[],
    reason?: string
  ) => {
    if (!sessionData) return;

    const newHistory = [...sessionData.selectionHistory, {
      timestamp: new Date().toISOString(),
      action,
      metrics,
      reason
    }];

    // Keep only last 20 history entries
    if (newHistory.length > 20) {
      newHistory.splice(0, newHistory.length - 20);
    }

    updateSession({
      selectionHistory: newHistory
    });
  }, [sessionData, updateSession]);

  // Clear session
  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSessionData(null);
  }, []);

  // Check if session is valid
  const isSessionValid = useCallback(() => {
    if (!sessionData) return false;
    return new Date() <= new Date(sessionData.expiresAt);
  }, [sessionData]);

  // Extend session expiry
  const extendSession = useCallback(() => {
    if (!sessionData) return;

    updateSession({
      expiresAt: new Date(Date.now() + DEFAULT_SESSION_DURATION).toISOString()
    });
  }, [sessionData, updateSession]);

  return {
    sessionData,
    isLoading,
    createSession,
    updateSession,
    cacheMetricResult,
    getCachedMetricResult,
    addToSelectionHistory,
    clearSession,
    isSessionValid,
    extendSession
  };
}

export default useSessionDataStore;