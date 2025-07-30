"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Report } from '@/lib/types';
import { Badge } from './ui/badge';
import Image from 'next/image';

const customIcon = (urgency: Report['urgency']) => {
  const color = {
    'High': '#e67e22', // Accent color
    'Moderate': '#f1c40f',
    'Low': '#3498db' // Primary color
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
  const position: [number, number] = reports.length > 0
    ? [reports[0].latitude, reports[0].longitude]
    : [34.0522, -118.2437]; // Default to LA

  return (
    <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.latitude, report.longitude]}
            icon={customIcon(report.urgency)}
          >
            <Popup>
              <div className="space-y-2">
                {report.imageUrl && (
                  <Image
                    src={report.imageUrl}
                    alt={report.description}
                    width={200}
                    height={150}
                    className="rounded-md object-cover"
                    data-ai-hint="hazard landscape"
                  />
                )}
                <h3 className="font-bold">{report.description.substring(0, 50)}...</h3>
                <div className="flex gap-2">
                  <Badge variant={report.urgency === 'High' ? 'destructive' : report.urgency === 'Moderate' ? 'secondary' : 'default'}>{report.urgency}</Badge>
                  <Badge variant="outline">{report.status}</Badge>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default DynamicMap;
