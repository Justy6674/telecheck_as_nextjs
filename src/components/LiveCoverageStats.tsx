import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users, Home } from "lucide-react";

interface CoverageStats {
  lga_count: number;
  postcode_count: number;
  total_population: number;
}

export const LiveCoverageStats = () => {
  const [stats, setStats] = useState<CoverageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use the RPC function that fetches from the cached view (5-year period: 2020-2025)
        const { data, error } = await supabase.rpc('current_disaster_coverage');

        if (error) {
          console.error('Error fetching coverage stats:', error);
          // Fallback to default values
          setStats({ lga_count: 0, postcode_count: 0, total_population: 0 });
          return;
        }

        if (data && data.length > 0) {
          setStats(data[0]);
        } else {
          setStats({ lga_count: 0, postcode_count: 0, total_population: 0 });
        }

      } catch (error) {
        console.error('Error calculating stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 md:h-10 w-96 max-w-full mx-auto" />
          <Skeleton className="h-5 md:h-6 w-80 max-w-full mx-auto" />
        </div>
        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 mx-auto max-w-4xl shadow-lg">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in">
            <div className="flex flex-col items-center gap-4 p-4 md:p-6 min-w-[140px] md:min-w-[160px]">
              <Skeleton className="h-10 md:h-12 w-20" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 p-4 md:p-6 min-w-[140px] md:min-w-[160px]">
              <Skeleton className="h-10 md:h-12 w-16" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 p-4 md:p-6 min-w-[140px] md:min-w-[160px]">
              <Skeleton className="h-10 md:h-12 w-12" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="text-center space-y-6 sm:space-y-8">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg px-4">
          Current Active <span className="gradient-text-red-strong">Disaster Zones</span>
        </h2>
        <div className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg mx-4">
          <p className="text-xs sm:text-sm md:text-base text-white font-semibold drop-shadow">
            Areas where MBS telehealth exemptions may apply
          </p>
        </div>
      </div>
      
      {/* Glass panel container for better readability */}
      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 mx-auto max-w-5xl shadow-2xl">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 animate-fade-in" aria-label="Live coverage statistics">
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 lg:p-6 flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[180px] bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-red-400" />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
                {stats.lga_count && stats.lga_count > 0 ? stats.lga_count.toLocaleString() : '—'}
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">Local Government Areas</div>
              <div className="text-xs sm:text-xs md:text-sm text-white/80">With active declarations</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 lg:p-6 flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[180px] bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-red-400" />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
                {stats.postcode_count && stats.postcode_count > 0 ? stats.postcode_count.toLocaleString() : '—'}
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">Postcodes</div>
              <div className="text-xs sm:text-xs md:text-sm text-white/80">Eligible for telehealth</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 lg:p-6 flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[180px] bg-white/10 rounded-xl border border-white/20" title="Population across affected LGAs">
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-red-400" />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
                {stats.total_population && stats.total_population > 0 ? stats.total_population.toLocaleString() : '—'}
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">People</div>
              <div className="text-xs sm:text-xs md:text-sm text-white/80">In affected areas</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-xs sm:text-sm text-white/70 mt-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
        * Data reflects disasters declared from 2020 onwards that are currently open (not yet declared closed by the Government)
      </p>
    </div>
  );
};