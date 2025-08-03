// src/app/simulator/_components/simulator-map.tsx
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SimulateDisasterOutput } from '@/ai/flows/simulate-disaster';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

// This is a workaround for a known issue with react-leaflet and Next.js HMR
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getImpactColor = (level: number) => {
  if (level >= 8) return 'hsl(var(--destructive))'; // heavy-hit (red)
  if (level >= 4) return 'hsl(var(--accent))'; // normal-hit (orange)
  return 'hsl(var(--primary))'; // low-hit (blue)
};

type SimulatorMapProps = {
  result: SimulateDisasterOutput | null;
};

const SimulatorMap = ({ result }: SimulatorMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // Update map when results change
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup || !result) return;
    
    // Clear previous layers
    layerGroup.clearLayers();

    // Pan and zoom to the disaster area
    const { lat, lon } = result.mapCenter;
    map.flyTo([lat, lon], 11, {
      animate: true,
      duration: 1.5
    });

    // Add circles for each affected zone
    result.affectedZones.forEach(zone => {
      const color = getImpactColor(zone.impactLevel);
      const radius = zone.impactLevel * 100 + 200; // Radius in meters

      const circle = L.circle([zone.lat, zone.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: radius,
      }).addTo(layerGroup);

      const popupContent = `
        <div class="p-1">
          <h3 class="font-bold text-sm">${zone.name}</h3>
          <p class="text-xs">Impact Level: <strong>${zone.impactLevel}/10</strong></p>
        </div>
      `;
      circle.bindPopup(popupContent);
    });

  }, [result]);

  if (!result) {
    return (
       <div className="h-[500px] w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
        <MapPin className="w-12 h-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">Run a simulation to see the impact map.</p>
        <Skeleton className="h-full w-full absolute" />
      </div>
    )
  }

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default SimulatorMap;
