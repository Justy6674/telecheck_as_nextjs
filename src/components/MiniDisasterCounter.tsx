import React, { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { MapPin, Hash, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CoverageRow {
  lga_count: number | null;
  postcode_count: number | null;
  total_population: number | null;
}

const formatNumber = (n: number | null | undefined) => {
  if (n === null || n === undefined) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  }
};

const Pill = ({ icon: Icon, label, value, colorClass }: { icon: LucideIcon; label: string; value: string; colorClass: string }) => (
  <span className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-100/90 border border-slate-200 text-slate-800 rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm backdrop-blur-sm shadow-sm" aria-label={`${label}: ${value}`}>
    <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
    <span className="font-semibold">{value}</span>
    <span className="opacity-90 hidden sm:inline">{label}</span>
    <span className="opacity-90 sm:hidden">{label.charAt(0)}</span>
  </span>
);

export const MiniDisasterCounter: React.FC = () => {
  const [data, setData] = useState<CoverageRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("current_disaster_coverage");
        if (error) throw error;

        // Handle both single-row and array responses
        const row: any = Array.isArray(data) ? data[0] : data;
        if (isMounted && row) {
          setData({
            lga_count: row.lga_count ?? null,
            postcode_count: row.postcode_count ?? null,
            total_population: row.total_population ?? null,
          });
        }
      } catch (e) {
        // Silently fail to remain discreet
        if (isMounted) setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const lga = formatNumber(data?.lga_count ?? null);
  const pc = formatNumber(data?.postcode_count ?? null);
  const ppl = formatNumber(data?.total_population ?? null);

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <Pill icon={MapPin} label="LGAs" value={loading ? "—" : lga} colorClass="text-success" />
      <Pill icon={Hash} label="Postcodes" value={loading ? "—" : pc} colorClass="text-primary" />
      <Pill icon={Users} label="People" value={loading ? "—" : ppl} colorClass="text-accent" />
    </div>
  );
};

export default MiniDisasterCounter;
