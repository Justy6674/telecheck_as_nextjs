import React from 'react';

// TEMPORARILY DISABLED FOR BUILD FIX - Admin component with database column mismatches (source_url doesn't exist)
export function AdminUrlRefresh() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">URL Refresh Tool Temporarily Disabled</h2>
      <p className="text-gray-600 mt-2">This tool is undergoing maintenance.</p>
    </div>
  );
}

/* ORIGINAL COMPONENT - TEMPORARILY DISABLED
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function AdminUrlRefresh() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<{
    total: number;
    updated: number;
    failed: number;
  } | null>(null);

  const runUrlRefresh = async () => {
    if (isRunning) return;
    
    // Confirm with user
    if (!confirm('This will refresh ALL disaster URLs from DisasterAssist.gov.au. This may take 5-10 minutes. Continue?')) {
      return;
    }

    setIsRunning(true);
    setStatus('Starting URL refresh...');
    setProgress(0);
    setResults(null);

    try {
      // Call the Edge Function to run the scraper
      const { data, error } = await supabase.functions.invoke('refresh-disaster-urls', {
        body: { 
          mode: 'full', // Full refresh of all URLs
          testMode: false // Not a test
        }
      });

      if (error) throw error;

      // Display results
      setResults({
        total: data.totalFound || 0,
        updated: data.successCount || 0,
        failed: data.failedCount || 0
      });

      setStatus(`✅ URL refresh complete! Updated ${data.successCount} of ${data.totalFound} disasters.`);
      
    } catch (error) {
      console.error('URL refresh error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  const testSingleUrl = async () => {
    setStatus('Testing a sample URL...');
    
    try {
      // Get a random disaster
      const { data: disasters, error } = await supabase
        .from('disasters')
        .select('agrn, title, source_url')
        .not('source_url', 'is', null)
        .limit(1)
        .single();

      if (error) throw error;

      // Test if URL is accessible (will be blocked by CORS but that's OK)
      setStatus(`Testing AGRN ${disasters.agrn}: ${disasters.source_url}`);
      
      // Just verify the URL format is correct
      const url = new URL(disasters.source_url);
      if (url.hostname === 'www.disasterassist.gov.au') {
        setStatus(`✅ URL format is valid for AGRN ${disasters.agrn}`);
      } else {
        setStatus(`⚠️ Unexpected domain: ${url.hostname}`);
      }
      
    } catch (error) {
      setStatus(`❌ Test failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">🔄 Disaster URL Management</h2>
      
      <div className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
          <p className="text-sm text-foreground">
            <strong>⚠️ Important:</strong> DisasterAssist.gov.au blocks automated requests (403 Forbidden).
            URLs are scraped using headless browsers but cannot be verified programmatically.
            Always test a few URLs manually after refresh.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={testSingleUrl}
            disabled={isRunning}
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            🧪 Test Single URL
          </button>

          <button
            onClick={runUrlRefresh}
            disabled={isRunning}
            className={`px-4 py-2 rounded font-medium ${
              isRunning 
                ? 'bg-muted cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? '⏳ Running...' : '🚀 Refresh All URLs'}
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded ${
            status.includes('✅') ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
            status.includes('❌') ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
            'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          }`}>
            {status}
          </div>
        )}

        {isRunning && (
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {results && (
          <div className="bg-muted/50 rounded p-4">
            <h3 className="font-semibold mb-2">Results:</h3>
            <ul className="space-y-1 text-sm">
              <li>📊 Total disasters found: <strong>{results.total}</strong></li>
              <li>✅ Successfully updated: <strong>{results.updated}</strong></li>
              <li>❌ Failed to update: <strong>{results.failed}</strong></li>
              <li>📈 Success rate: <strong>{((results.updated / results.total) * 100).toFixed(1)}%</strong></li>
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded">
          <h3 className="font-semibold mb-2 text-foreground">📝 Notes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• URLs are scraped from DisasterAssist.gov.au state pages</li>
            <li>• Process takes ~5-10 minutes for all 749 disasters</li>
            <li>• Updates both source_url and canonical_url fields</li>
            <li>• Some AGRNs may not exist in DisasterAssist anymore</li>
            <li>• Manual verification recommended after bulk updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
*/ // END ORIGINAL COMPONENT