import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import type { Filtros, Cursinhos } from '../../types';
import { iconGreen, iconOrange, iconYellow } from '../../utils/leafletIcons';
import { filtrarPorDistancia } from '../../utils/geo';
import { FlyTo } from './FlyTo';
import { Markers } from './Markers';

// ── MapView ───────────────────────────────────────────────────────────────────
interface Props {
  cursinhos: Cursinhos;
  filtros: Filtros;
}

export function MapView({ cursinhos, filtros }: Props) {
  const endereco = typeof filtros.endereco === 'object' ? filtros.endereco : null;
  const userLat = endereco?.location?.latitude;
  const userLon = endereco?.location?.longitude;
  const raio = filtros.distancia ?? 10;
  const tipo = filtros.tipoCurso ?? 'checkboxTodos';

  const temLocal = userLat !== undefined && userLon !== undefined &&
    isFinite(userLat) && isFinite(userLon);

  const gratuitos = temLocal ? filtrarPorDistancia(cursinhos?.gratuitos, userLat!, userLon!, raio) : (cursinhos?.gratuitos ?? []);
  const caros = temLocal ? filtrarPorDistancia(cursinhos?.caros, userLat!, userLon!, raio) : (cursinhos?.caros ?? []);
  const acessiveis = temLocal ? filtrarPorDistancia(cursinhos?.acessiveis, userLat!, userLon!, raio) : (cursinhos?.acessiveis ?? []);

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

      {temLocal && (
        <>
          <FlyTo lat={userLat!} lon={userLon!} />
          <Marker position={[userLat!, userLon!]}>
            <Popup>Minha localização</Popup>
          </Marker>
          <Circle
            center={[userLat!, userLon!]}
            radius={raio * 1000}
            pathOptions={{ color: '#3030ff', fillColor: '#3030ff', fillOpacity: 0.1 }}
          />
        </>
      )}

      {(tipo === 'checkboxTodos' || tipo === 'checkboxGratuitos') && (
        <Markers lista={gratuitos} icon={iconGreen} />
      )}
      {(tipo === 'checkboxTodos' || tipo === 'checkboxPagosBolsa') && (
        <Markers lista={caros} icon={iconOrange} />
      )}
      {(tipo === 'checkboxTodos' || tipo === 'checkboxPagosAcessiveis') && (
        <Markers lista={acessiveis} icon={iconYellow} />
      )}
    </MapContainer>
  );
}

