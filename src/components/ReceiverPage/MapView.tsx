import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import type { Filters, MapData, MapConfig } from '../../types';
import { filterByDistance } from '../../utils/geo';
import { FlyTo } from './FlyTo';
import { Markers } from './Markers';

// ── MapView ───────────────────────────────────────────────────────────────────
interface Props {
  config: MapConfig;
  mapData: MapData;
  filters: Filters;
}

export function MapView({ config, mapData, filters }: Props) {
  const address = typeof filters.address === 'object' ? filters.address : null;
  const userLat = address?.location?.latitude;
  const userLon = address?.location?.longitude;
  const radius = filters.distance ?? config.radius ?? 10;
  const category = filters.category ?? 'all';

  const hasLocation = userLat !== undefined && userLon !== undefined &&
    isFinite(userLat) && isFinite(userLon);

  // Helper para criar ícones dinâmicamente
  const createDynamicIcon = (color: string, icon: string) => {
    return (L as any).AwesomeMarkers.icon({
      icon: icon,
      prefix: 'fa',
      markerColor: color as any,
      iconColor: 'white'
    });
  };

  return (
    <MapContainer
      center={[config.center.latitude, config.center.longitude]}
      zoom={config.zoom}
      minZoom={2}
      maxZoom={18}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {hasLocation && (
        <>
          <FlyTo lat={userLat!} lon={userLon!} />
          <Marker position={[userLat!, userLon!]}>
            <Popup>Minha localização</Popup>
          </Marker>
          <Circle
            center={[userLat!, userLon!]}
            radius={radius * 1000}
            pathOptions={{ color: '#3030ff', fillColor: '#3030ff', fillOpacity: 0.1 }}
          />
        </>
      )}

      {config.categories.map((cat) => {
        if (category !== 'all' && category !== cat.id) return null;
        
        const list = mapData[cat.id] || [];
        const filteredList = hasLocation 
          ? filterByDistance(list, userLat!, userLon!, radius) 
          : list;

        return (
          <Markers 
            key={cat.id} 
            list={filteredList} 
            icon={createDynamicIcon(cat.color, cat.icon)} 
          />
        );
      })}
    </MapContainer>
  );
}

