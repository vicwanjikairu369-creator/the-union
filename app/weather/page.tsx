"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// Notice the new import path for newer versions of react-map-gl
import Map, { Source, Layer } from "react-map-gl/mapbox"; 
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data to simulate global players for now
const MOCK_PINGS = [
  { id: 1, country: "Japan", emotion: "Empathetic", city: "Tokyo", x: 139.6917, y: 35.6895 },
  { id: 2, country: "Brazil", emotion: "Defensive", city: "São Paulo", x: -46.6333, y: -23.5505 },
  { id: 3, country: "Kenya", emotion: "Vulnerable", city: "Nairobi", x: 36.8219, y: -1.2921 },
  { id: 4, country: "UK", emotion: "Contemptuous", city: "London", x: -0.1276, y: 51.5072 },
  { id: 5, country: "USA", emotion: "Apologetic", city: "New York", x: -74.0060, y: 40.7128 },
  { id: 6, country: "India", emotion: "Empathetic", city: "Mumbai", x: 72.8777, y: 19.0760 },
];

export default function WeatherMap() {
  const [pings, setPings] = useState(MOCK_PINGS);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5
  });

  // Simulate live pings arriving every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Random coordinates globally
      const newPing = {
        id: Date.now(),
        country: "Unknown",
        city: "Anonymous",
        emotion: ["Empathetic", "Defensive", "Vulnerable", "Stonewalling"][Math.floor(Math.random() * 4)],
        x: Math.random() * 360 - 180,
        y: Math.random() * 140 - 70,
      };
      setPings((prev) => [newPing, ...prev].slice(0, 30)); // Keep last 30
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Convert pings to GeoJSON for Mapbox
  const geojson: any = {
    type: 'FeatureCollection',
    features: pings.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.x, p.y] },
      properties: { emotion: p.emotion, city: p.city }
    }))
  };

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-4xl font-serif">Global Emotional Weather</h1>
          <p className="text-white/50 mt-2">Live heartbeat of players resolving marital conflicts.</p>
        </div>
        <Link href="/game" className="pointer-events-auto border border-white/20 px-6 py-2 rounded-full hover:bg-white/10 transition backdrop-blur">
          Back to Game
        </Link>
      </div>

      {/* THE ACTUAL MAPBOX MAP */}
      <div className="flex-1 w-full h-full absolute inset-0">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          <Source id="emotions" type="geojson" data={geojson}>
            <Layer
              id="emotion-heat"
              type="heatmap"
              paint={{
                'heatmap-weight': 1,
                'heatmap-intensity': 1.5,
                'heatmap-color': [
                  'interpolate', ['linear'], ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, 'rgba(255,182,193,0.6)', // Pink
                  0.4, 'rgba(135,206,250,0.7)', // Blue
                  0.6, 'rgba(255,215,0,0.8)',   // Yellow
                  0.8, 'rgba(255,99,71,0.9)',   // Red
                  1, 'rgba(75,0,130,1)'         // Purple
                ],
                'heatmap-radius': 30,
              }}
            />
          </Source>
        </Map>
      </div>
    </main>
  );
}