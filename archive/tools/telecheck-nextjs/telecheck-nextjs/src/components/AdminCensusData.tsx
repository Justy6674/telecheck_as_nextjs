import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Download, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CensusStats {
  total_lgas: number;
  total_postcodes: number;
  data_integrity: string;
  last_updated?: string;
  totalLGAs?: number;
  totalPopulation?: number;
  byState?: Record<string, { count: number; population: number }>;
}

export const AdminCensusData = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [stats, setStats] = useState<CensusStats | null>(null);

  const checkCensusData = async () => {
    setLoading(true);
    try {
      // Check if census table exists and has data
      const { count, error } = await supabase
        .from('lga_populations')
        .select('*', { count: 'exact', head: true });

      if (error) {
        setStatus("Census table not found. Please run the import script.");
        setStats(null);
      } else {
        // Get summary stats
        const { data: stateStats } = await supabase
          .from('lga_populations')
          .select('state, population_2021');
        
        if (stateStats) {
          const summary = stateStats.reduce((acc: Record<string, { count: number; population: number }>, row) => {
            if (!acc[row.state]) {
              acc[row.state] = { count: 0, population: 0 };
            }
            acc[row.state].count++;
            acc[row.state].population += row.population_2021;
            return acc;
          }, {});
          
          const total = Object.values(summary).reduce((sum: number, s) => 
            sum + s.population, 0
          );
          
          setStats({
            total_lgas: count || 0,
            total_postcodes: 0,
            data_integrity: 'good',
            totalLGAs: count || 0,
            totalPopulation: total,
            byState: summary
          });
          
          setStatus(`Census data loaded: ${count} LGAs`);
        }
      }
    } catch (error) {
      console.error('Error checking census data:', error);
      setStatus("Error checking census data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAccuratePopulation = async () => {
    setLoading(true);
    try {
      // Calculate population for currently active disasters (last 12 months)
      const { data, error } = await supabase.rpc('calculate_affected_population', {
        months_back: 12
      });

      if (error) {
        // If function doesn't exist, show instructions
        setStatus("Please create the population calculation function first");
      } else {
        setStatus(`Calculated population affected: ${data?.toLocaleString() || 0}`);
      }
    } catch (error) {
      console.error('Error calculating population:', error);
      setStatus("Error calculating population");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Census Data Management
        </CardTitle>
        <CardDescription>
          Manage ABS Census 2021 LGA population data for accurate statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>To import census data:</strong>
            <ol className="list-decimal ml-4 mt-2 space-y-1">
              <li>Run in terminal: <code className="bg-muted px-1">npm run census:load</code></li>
              <li>Or manually: <code className="bg-muted px-1">node scripts/load-census-to-supabase.mjs</code></li>
              <li>This will import real ABS Census 2021 data for all LGAs</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Status */}
        {status && (
          <Alert className={stats ? "border-green-500" : "border-yellow-500"}>
            {stats ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        {stats && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">Census Data Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total LGAs:</span>
                <p className="font-semibold">{stats.totalLGAs}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Population:</span>
                <p className="font-semibold">{stats.totalPopulation?.toLocaleString()}</p>
              </div>
            </div>
            
            {stats.byState && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">By State:</h5>
                <div className="space-y-1 text-sm">
                  {Object.entries(stats.byState).map(([state, data]: [string, { count: number; population: number }]) => (
                    <div key={state} className="flex justify-between">
                      <span>{state}:</span>
                      <span>{data.count} LGAs / {data.population.toLocaleString()} people</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={checkCensusData} 
            disabled={loading}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            Check Census Data
          </Button>
          
          <Button 
            onClick={calculateAccuratePopulation}
            disabled={loading || !stats}
          >
            <Upload className="h-4 w-4 mr-2" />
            Calculate Accurate Population
          </Button>
        </div>

        {/* SQL Function */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Create Population Function (Run in Supabase SQL Editor):</h4>
          <pre className="text-xs overflow-x-auto">
{`CREATE OR REPLACE FUNCTION calculate_affected_population(months_back INTEGER DEFAULT 12)
RETURNS TABLE(
  total_population BIGINT,
  lga_count INTEGER,
  state_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.population_2021), 0) as total_population,
    COUNT(DISTINCT l.lga_name)::INTEGER as lga_count,
    COUNT(DISTINCT l.state)::INTEGER as state_count
  FROM disaster_lgas dl
  JOIN disasters d ON dl.agrn = d.agrn
  JOIN lgas l ON dl.lga_code = l.lga_code
  LEFT JOIN lga_populations p ON l.lga_name = p.lga_name
  WHERE d.start_date >= CURRENT_DATE - (months_back || ' months')::INTERVAL
  AND (d.end_date IS NULL OR d.end_date > CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};