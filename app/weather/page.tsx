'use client';
import { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import Pusher from 'pusher-js';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function WeatherMap() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe('emotional-weather');
    channel.bind('emotion-ping', (data: any) => {
      setEvents((prev) => [...prev.slice(-500), data]);
    });
    return () => pusher.unsubscribe('emotional-weather');
  }, []);

  const geojson: any = {
    type: 'FeatureCollection',
    features: events.map((e) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [e.longitude, e.latitude] },
      properties: { emotion: e.emotion, intensity: e.intensity },
    })),
  };

  return (
    <div className="h-screen w-screen">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 1.5 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
      >
        <Source id="emotions" type="geojson" data={geojson}>
          <Layer
            id="emotion-heat"
            type="heatmap"
            paint={{
              'heatmap-weight': ['get', 'intensity'],
              'heatmap-intensity': 1.5,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,0,0)',
                0.2, 'rgba(255,182,193,0.6)',
                0.4, 'rgba(135,206,250,0.7)',
                0.6, 'rgba(255,215,0,0.8)',
                0.8, 'rgba(255,99,71,0.9)',
                1, 'rgba(75,0,130,1)',
              ],
              'heatmap-radius': 30,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}