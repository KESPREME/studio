// src/app/admin/_components/simulator-map.tsx
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SimulateDisasterOutput } from '@/ai/flows/simulate-disaster';

// This is a workaround for a known issue with react-leaflet and Next.js HMR
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getImpactColor = (level: number) => {
  if (level >= 8) return 'hsl(var(--destructive))'; // High impact
  if (level >= 4) return 'hsl(var(--accent))';   // Moderate impact
  return 'hsl(var(--primary))';                     // Low impact
};

type SimulatorMapProps = {
  result: SimulateDisasterOutput;
};

const SimulatorMap = ({ result }: SimulatorMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const { lat, lon } = result.mapCenter;
      const map = L.map(mapContainerRef.current).setView([lat, lon], 10);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous layers
    map.eachLayer((layer) => {
      if (!!layer.getAttribution) { // This is a tile layer
        return;
      }
      map.removeLayer(layer);
    });

    // Center map
    map.setView([result.mapCenter.lat, result.mapCenter.lon], 10);

    // Add new layers
    result.affectedZones.forEach((zone) => {
      const circle = L.circle([zone.lat, zone.lon], {
        color: getImpactColor(zone.impactLevel),
        fillColor: getImpactColor(zone.impactLevel),
        fillOpacity: 0.4,
        radius: 2000 // Radius in meters
      }).addTo(map);
      
      circle.bindPopup(`<b>${zone.name}</b><br>Impact Level: ${zone.impactLevel}/10`);
    });

  }, [result]); // Re-run whenever the result changes

  return <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />;
};

export default SimulatorMap;
