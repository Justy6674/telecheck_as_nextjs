import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminTabs } from '../components/AdminTabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🔐 TeleCheck Admin Control Center</h1>
            <p className="text-white/80">Comprehensive platform management, monitoring, and control</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/members')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <AdminTabs />
      </div>
    </div>
  );
}

interface DatabaseStatsData {
  disasters: number;
  withUrls: number;
  withoutUrls: number;
  lgas: number;
  urlCoverage: string;
}

function DatabaseStats() {
  const [stats, setStats] = useState<DatabaseStatsData | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get disaster count
      const { count: disasterCount } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true });

      // Get disasters with URLs
      const { count: withUrls } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .not('url', 'is', null);

      // Get LGA count
      const { count: lgaCount } = await supabase
        .from('lgas')
        .select('*', { count: 'exact', head: true });

      setStats({
        disasters: disasterCount || 0,
        withUrls: withUrls || 0,
        withoutUrls: (disasterCount || 0) - (withUrls || 0),
        lgas: lgaCount || 0,
        urlCoverage: ((withUrls || 0) / (disasterCount || 1) * 100).toFixed(1)
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">📊 Database Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-2xl font-bold text-blue-600">{stats.disasters}</div>
          <div className="text-sm text-gray-600">Total Disasters</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <div className="text-2xl font-bold text-green-600">{stats.withUrls}</div>
          <div className="text-sm text-gray-600">With URLs</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded">
          <div className="text-2xl font-bold text-yellow-600">{stats.withoutUrls}</div>
          <div className="text-sm text-gray-600">Missing URLs</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded">
          <div className="text-2xl font-bold text-purple-600">{stats.urlCoverage}%</div>
          <div className="text-sm text-gray-600">URL Coverage</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Total LGAs in system: <strong>{stats.lgas}</strong></p>
      </div>
    </div>
  );
}

interface SystemNote {
  time: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

function RecentErrors() {
  const [errors, setErrors] = useState<SystemNote[]>([]);

  useEffect(() => {
    // In production, this would fetch from an errors/logs table
    setErrors([
      { 
        time: new Date().toISOString(), 
        type: 'INFO',
        message: 'DisasterAssist blocks automated requests (403)' 
      },
      { 
        time: new Date().toISOString(), 
        type: 'WARNING',
        message: 'URLs cannot be verified programmatically' 
      }
    ]);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">⚠️ System Notes</h2>
      
      <div className="space-y-2">
        {errors.map((error, i) => (
          <div key={i} className={`p-3 rounded ${
            error.type === 'ERROR' ? 'bg-red-50 text-red-800' :
            error.type === 'WARNING' ? 'bg-yellow-50 text-yellow-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            <div className="text-sm font-medium">{error.type}</div>
            <div className="text-sm">{error.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}