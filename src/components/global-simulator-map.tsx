// src/components/simulator-map.tsx
"use client"

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, Tooltip, LayersControl, LayerGroup } from 'react-leaflet';
import { SimulateDisasterOutput } from '@/ai/flows/simulate-disaster';
import { LatLngExpression } from 'leaflet';
import { useTheme } from 'next-themes';
import L from 'leaflet';

interface SimulatorMapProps {
  result: SimulateDisasterOutput;
}

// Fix for default icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Legend = () => {
  const legendStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 1000,
    boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
    lineHeight: '1.5',
  };

  const colors = {
    High: '#ef4444',
    Medium: '#f97316',
    Low: '#eab308',
    Potential: '#3b82f6',
  };

  return (
    <div style={legendStyle}>
      <h4 className="font-bold mb-1 text-black">Impact Legend</h4>
      {Object.entries(colors).map(([level, color]) => (
        <div key={level} className="flex items-center">
          <i style={{ background: color, width: '18px', height: '18px', marginRight: '5px', border: '1px solid #777' }}></i>
          <span className="text-sm text-gray-800">{level}</span>
        </div>
      ))}
    </div>
  );
};


const SimulatorMap = ({ result }: SimulatorMapProps) => {
  const { theme } = useTheme();
  const center: LatLngExpression = [result.mapData.center.lat, result.mapData.center.lng];

  const tileLayerUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileLayerAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const getStyle = (impact: string) => {
    switch (impact) {
      case 'High': return { color: "#ef4444", weight: 2, opacity: 0.8, fillOpacity: 0.6 };
      case 'Medium': return { color: "#f97316", weight: 2, opacity: 0.7, fillOpacity: 0.5 };
      case 'Low': return { color: "#eab308", weight: 1, opacity: 0.6, fillOpacity: 0.4 };
      case 'Potential': return { color: "#3b82f6", weight: 1, opacity: 0.5, fillOpacity: 0.3, dashArray: '5, 5' };
      default: return { color: "#22c55e", weight: 1, opacity: 0.5, fillOpacity: 0.2 };
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={result.mapData.zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        <LayersControl position="topright">
          {['High', 'Medium', 'Low', 'Potential'].map(level => (
            <LayersControl.Overlay key={level} name={level} checked>
              <LayerGroup>
                {result.mapData.impactAreas.filter(area => area.impact === level).map((area, index) => (
                  <GeoJSON key={`${level}-${index}`} data={area.geoJson} style={getStyle(area.impact)}>
                    <Tooltip>
                      <div>
                        <h4 className="font-bold">{area.name}</h4>
                        <p>Impact: {area.impact}</p>
                        <p>Population Affected: {area.populationAffected.toLocaleString()}</p>
                      </div>
                    </Tooltip>
                  </GeoJSON>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>
      <Legend />
    </div>
  );
};

export default SimulatorMap;
