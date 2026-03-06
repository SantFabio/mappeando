import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import type { Filters, MapData } from '../../types';
import { iconGreen, iconOrange, iconYellow } from '../../utils/leafletIcons';
import { filterByDistance } from '../../utils/geo';
import { FlyTo } from './FlyTo';
import { Markers } from './Markers';

// ── MapView ───────────────────────────────────────────────────────────────────
interface Props {
  mapData: MapData;
  filters: Filters;
}

export function MapView({ mapData, filters }: Props) {
  const address = typeof filters.address === 'object' ? filters.address : null;
  const userLat = address?.location?.latitude;
  const userLon = address?.location?.longitude;
  const radius = filters.distance ?? 10;
  const category = filters.category ?? 'all';

  const hasLocation = userLat !== undefined && userLon !== undefined &&
    isFinite(userLat) && isFinite(userLon);

  const itemsCategoryA = hasLocation ? filterByDistance(mapData?.categoryA, userLat!, userLon!, radius) : (mapData?.categoryA ?? []);
  const itemsCategoryB = hasLocation ? filterByDistance(mapData?.categoryB, userLat!, userLon!, radius) : (mapData?.categoryB ?? []);
  const itemsCategoryC = hasLocation ? filterByDistance(mapData?.categoryC, userLat!, userLon!, radius) : (mapData?.categoryC ?? []);

  return (
    <MapContainer
      center={[-23.5505, -46.6333]}
      zoom={11}
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

      {(category === 'all' || category === 'categoryA') && (
        <Markers list={itemsCategoryA} icon={iconGreen} />
      )}
      {(category === 'all' || category === 'categoryB') && (
        <Markers list={itemsCategoryB} icon={iconOrange} />
      )}
      {(category === 'all' || category === 'categoryC') && (
        <Markers list={itemsCategoryC} icon={iconYellow} />
      )}
    </MapContainer>
  );
}

