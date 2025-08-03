
// src/components/dynamic-map.tsx
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import type { Report } from '@/lib/types';

// This is a workaround for a known issue with react-leaflet and Next.js HMR
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const customIcon = (urgency: Report['urgency']) => {
  const color = {
    'High': 'hsl(var(--accent))',
    'Moderate': '#f1c40f',
    'Low': 'hsl(var(--primary))'
  }[urgency];

  return new L.DivIcon({
    html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

type HazardMapProps = {
  reports: Report[];
};

const DynamicMap = ({ reports }: HazardMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const position: [number, number] = reports.length > 0
        ? [reports[0].latitude, reports[0].longitude]
        : [20.5937, 78.9629]; // Default to India center

      const map = L.map(mapContainerRef.current).setView(position, 5);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      markersRef.current = L.markerClusterGroup();
      map.addLayer(markersRef.current);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    const markerClusterGroup = markersRef.current;
    if (!markerClusterGroup) return;

    markerClusterGroup.clearLayers();

    reports.forEach((report) => {
      const marker = L.marker([report.latitude, report.longitude], {
        icon: customIcon(report.urgency)
      });

      const popupContent = `
        <div class="space-y-2 p-1 max-w-[200px]">
          ${report.imageUrl ? `<img src="${report.imageUrl}" alt="${report.description.substring(0, 30)}" width="200" height="150" class="rounded-md object-cover" data-ai-hint="hazard landscape" />` : ''}
          <h3 class="font-bold text-sm leading-tight">${report.description.substring(0, 80)}...</h3>
          <div class="flex gap-2 flex-wrap">
            <span class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${report.urgency === 'High' ? 'border-transparent bg-destructive text-destructive-foreground' : report.urgency === 'Moderate' ? 'border-transparent bg-secondary text-secondary-foreground' : 'border-transparent bg-primary text-primary-foreground'}">${report.urgency}</span>
            <span class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">${report.status}</span>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markerClusterGroup.addLayer(marker);

      // Add circles to visualize impact areas
      const urgencyStyles = {
        High: { color: 'hsl(var(--destructive))', radius: 10000, opacity: 0.2 },
        Moderate: { color: '#f1c40f', radius: 5000, opacity: 0.2 },
        Low: { color: 'hsl(var(--primary))', radius: 2000, opacity: 0.2 },
      };

      const style = urgencyStyles[report.urgency];
      if (style) {
        L.circle([report.latitude, report.longitude], {
          radius: style.radius,
          color: style.color,
          fillColor: style.color,
          fillOpacity: style.opacity,
          weight: 1,
        }).addTo(markerClusterGroup);
      }
    });
  }, [reports]); // Re-run whenever reports change

  return <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />;
};

export default DynamicMap;
