import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Settings, Info } from 'lucide-react';

// You'll need to add your Mapbox public token as a secret
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazB0dGZ0ZzkwZGNyM2NvZjVyYjVranQwIn0.example'; // This would come from Supabase secrets

interface PatientRecord {
  postcode: string;
  suburb?: string;
  state?: string;
  lga?: string;
  is_eligible: boolean;
  remoteness_area?: string;
  remoteness_code?: number;
  age_band?: string;
  gender?: string;
  count?: number;
}

interface PatientDistributionMapProps {
  patients: PatientRecord[];
  height?: string;
  showControls?: boolean;
}

export const PatientDistributionMap: React.FC<PatientDistributionMapProps> = ({
  patients,
  height = '400px',
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [mapboxConfigured, setMapboxConfigured] = useState(false);
  // Check if Mapbox is configured and available globally
  useEffect(() => {
    // Check if global mapboxgl is available (loaded via CDN)
    const isMapboxAvailable = typeof (window as any).mapboxgl !== 'undefined';
    const isTokenValid = !!MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazB0dGZ0ZzkwZGNyM2NvZjVyYjVranQwIn0.example';
    
    setMapboxConfigured(isMapboxAvailable && isTokenValid);
  }, []);

  useEffect(() => {
    if (!mapboxConfigured || !mapContainer.current) return;

    const mapboxgl = (window as any).mapboxgl;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [133.7751, -25.2744], // Center of Australia
      zoom: 4,
      pitch: 0
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      addPatientData();
    });

    // Navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxConfigured]);

  useEffect(() => {
    if (mapLoaded && map.current) {
      addPatientData();
    }
  }, [patients, selectedFilter, mapLoaded]);

  const addPatientData = () => {
    if (!map.current) return;

    // Group patients by postcode and filter
    const filteredPatients = patients.filter(p => {
      if (selectedFilter === 'eligible') return p.is_eligible;
      if (selectedFilter === 'ineligible') return !p.is_eligible;
      return true;
    });

    const groupedData = filteredPatients.reduce((acc, patient) => {
      const key = patient.postcode;
      if (!acc[key]) {
        acc[key] = {
          ...patient,
          count: 0,
          eligible_count: 0,
          ineligible_count: 0
        };
      }
      acc[key].count++;
      if (patient.is_eligible) {
        acc[key].eligible_count++;
      } else {
        acc[key].ineligible_count++;
      }
      return acc;
    }, {} as Record<string, any>);

    // Convert to GeoJSON features
    const features = Object.values(groupedData).map((data: any) => {
      // In a real implementation, you'd need postcode coordinate data
      // For now, we'll use approximate coordinates
      const [lng, lat] = getApproximateCoordinates(data.postcode, data.state);
      
      return {
        type: 'Feature',
        properties: {
          postcode: data.postcode,
          suburb: data.suburb || 'Unknown',
          state: data.state || 'Unknown',
          count: data.count,
          eligible_count: data.eligible_count || 0,
          ineligible_count: data.ineligible_count || 0,
          remoteness_area: data.remoteness_area || 'Unknown',
          eligibility_rate: data.count > 0 ? ((data.eligible_count || 0) / data.count * 100).toFixed(1) : '0'
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      };
    });

    const geojsonData = {
      type: 'FeatureCollection',
      features
    };

    // Remove existing layers and sources
    if (map.current.getLayer('patient-points')) {
      map.current.removeLayer('patient-points');
    }
    if (map.current.getSource('patients')) {
      map.current.removeSource('patients');
    }

    // Add source
    map.current.addSource('patients', {
      type: 'geojson',
      data: geojsonData as any
    });

    // Add layer
    map.current.addLayer({
      id: 'patient-points',
      type: 'circle',
      source: 'patients',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          1, 6,
          10, 12,
          50, 18,
          100, 24
        ],
        'circle-color': [
          'case',
          ['>', ['get', 'eligible_count'], 0],
          ['interpolate',
            ['linear'],
            ['to-number', ['get', 'eligibility_rate']],
            0, '#ef4444',   // red for 0%
            50, '#f59e0b',  // orange for 50%
            100, '#10b981' // green for 100%
          ],
          '#6b7280' // gray for no data
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add click handler
    map.current.on('click', 'patient-points', (e) => {
      const features = e.features;
      if (!features || features.length === 0) return;

      const feature = features[0];
      const props = feature.properties;

      const mapboxgl = (window as any).mapboxgl;
      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat((feature.geometry as any).coordinates)
        .setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-lg">${props.postcode}</h3>
            <p class="text-sm text-gray-600">${props.suburb}, ${props.state}</p>
            <div class="mt-2 space-y-1">
              <p><strong>Total Patients:</strong> ${props.count}</p>
              <p><strong>Eligible:</strong> ${props.eligible_count} (${props.eligibility_rate}%)</p>
              <p><strong>Ineligible:</strong> ${props.ineligible_count}</p>
              <p><strong>Area Type:</strong> ${props.remoteness_area}</p>
            </div>
          </div>
        `)
        .addTo(map.current!);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'patient-points', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'patient-points', () => {
      map.current!.getCanvas().style.cursor = '';
    });
  };

  const getApproximateCoordinates = (postcode: string, state?: string): [number, number] => {
    // Approximate coordinates for Australian postcodes
    // In a real implementation, you'd use a proper postcode geocoding service
    const num = parseInt(postcode);
    
    // NSW
    if (num >= 1000 && num <= 2999) return [151.2093, -33.8688];
    // VIC
    if (num >= 3000 && num <= 3999) return [144.9631, -37.8136];
    // QLD
    if (num >= 4000 && num <= 4999) return [153.0251, -27.4698];
    // SA
    if (num >= 5000 && num <= 5999) return [138.6007, -34.9285];
    // WA
    if (num >= 6000 && num <= 6999) return [115.8605, -31.9505];
    // TAS
    if (num >= 7000 && num <= 7999) return [147.3272, -42.8821];
    // NT
    if (num >= 800 && num <= 999) return [130.8456, -12.4634];
    // ACT
    if (num >= 200 && num <= 299) return [149.1300, -35.2809];
    
    // Default to center of Australia
    return [133.7751, -25.2744];
  };

  if (!mapboxConfigured) {
    return (
      <Card style={{ height }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Patient Distribution Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              To enable the interactive map, please configure your Mapbox access token in the Supabase Edge Function secrets.
              <br />
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Get your free Mapbox token here →
              </a>
            </AlertDescription>
          </Alert>
          
          {/* Fallback static visualization */}
          <div className="mt-4 space-y-4">
            <h4 className="font-semibold">Patient Distribution Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map(state => {
                const statePatients = patients.filter(p => p.state === state);
                const eligible = statePatients.filter(p => p.is_eligible).length;
                
                if (statePatients.length === 0) return null;
                
                return (
                  <div key={state} className="text-center p-3 border rounded-lg">
                    <div className="font-bold text-lg">{state}</div>
                    <div className="text-sm text-muted-foreground">
                      {statePatients.length} patients
                    </div>
                    <div className="text-xs">
                      {eligible} eligible ({((eligible / statePatients.length) * 100).toFixed(1)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ height }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Patient Distribution Map
        </CardTitle>
        {showControls && (
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All Patients
            </Button>
            <Button
              variant={selectedFilter === 'eligible' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('eligible')}
            >
              Eligible
            </Button>
            <Button
              variant={selectedFilter === 'ineligible' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('ineligible')}
            >
              Ineligible
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} style={{ height: 'calc(100% - 1px)', width: '100%' }} />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2">Eligibility Rate</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>0% eligible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>50% eligible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>100% eligible</span>
            </div>
          </div>
          <div className="mt-2 text-gray-600">
            Circle size = patient count
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDistributionMap;