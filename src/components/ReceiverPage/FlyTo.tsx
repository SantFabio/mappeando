import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  lat: number;
  lon: number;
}

// ── Recentra mapa — usa useEffect, não useMemo ───────────────────────────────
export function FlyTo({ lat, lon }: Props) {
  const map = useMap();
  const prevRef = useRef<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    if (!prev || prev.lat !== lat || prev.lon !== lon) {
      map.setView([lat, lon], map.getZoom());
      prevRef.current = { lat, lon };
    }
  }, [lat, lon, map]);

  return null;
}
