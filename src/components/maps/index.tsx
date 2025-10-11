'use client';

import { useLocation } from '@/contexts/LocationContext';
import { useEffect, useRef } from 'react';
import './styles.css';

// Import dinámico (evita problemas de SSR)
let mapboxgl: typeof import('mapbox-gl') | null = null;
const loadMapbox = async () => {
  if (!mapboxgl) {
    const mod = await import('mapbox-gl');
    // @ts-expect-error (no typings)
    mapboxgl = mod.default;
  }
  return mapboxgl!;
};

export default function MapClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('mapbox-gl').Map | null>(null);

  // Use location from context
  const { location: center, error, isLoading } = useLocation();

  // 2) Inicializar Mapbox cuando tengamos centro y contenedor
  useEffect(() => {
    const init = async () => {
      if (!center || !containerRef.current || mapRef.current) return;

      const mb = await loadMapbox();
      // @ts-expect-error (no typings)
      mb.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

      const map = new mb.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12', // otros: light, dark, satellite
        center: [center.lng, center.lat],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        cooperativeGestures: true,
      });
      mapRef.current = map;

      // Controles
      map.addControl(new mb.NavigationControl(), 'top-right');
      map.addControl(new mb.FullscreenControl(), 'top-right');
      map.addControl(new mb.ScaleControl({ unit: 'metric' }), 'bottom-left');

      // Botón de geolocalización (auto-center si el user lo activa)
      map.addControl(
        new mb.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showAccuracyCircle: true,
          showUserHeading: true,
        }),
        'top-right'
      );

      // Marcador “Estás aquí”
      const el = document.createElement('div');
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '9999px';
      el.style.background = '#1d4ed8'; // azul
      el.style.boxShadow = '0 0 0 4px rgba(29,78,216,0.2)';

      new mb.Marker({ element: el })
        .setLngLat([center.lng, center.lat])
        .setPopup(new mb.Popup().setHTML('<b>Estás aquí</b>'))
        .addTo(map);

      // Limpieza
      map.on('remove', () => {
        mapRef.current = null;
      });
    };

    init();
  }, [center]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '40vh' }}>
      {error && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 12,
            left: 12,
            background: '#fff',
            borderRadius: 8,
            padding: '8px 10px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          ⚠️ {error} (usando ubicación por defecto)
        </div>
      )}
      {isLoading || !center ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: 18,
            color: '#050505',
          }}
        >
          Obteniendo tu ubicación…
        </div>
      ) : (
        <div ref={containerRef} className="mapboxgl-map-styles" />
      )}
    </div>
  );
}
