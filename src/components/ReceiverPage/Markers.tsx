import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { MapItem } from '../../types';
import { ItemCard } from './ItemCard';

interface Props {
  list: MapItem[] | undefined | null;
  icon: L.Icon;
}

// ── Marcadores ────────────────────────────────────────────────────────────────
export function Markers({ list, icon }: Props) {
  if (!Array.isArray(list)) return null;
  console.log(list);


  return (
    <>
      {list
        .filter(item =>
          item.latitude != null && item.longitude != null &&
          isFinite(item.latitude) && isFinite(item.longitude) &&
          item.latitude >= -90 && item.latitude <= 90 &&
          item.longitude >= -180 && item.longitude <= 180
        )
        .map((item, i) => (
          <Marker key={item._id ?? i} position={[item.latitude!, item.longitude!]} icon={icon}>
            <Popup maxWidth={280}>
              <ItemCard item={item} />
            </Popup>
          </Marker>
        ))}
    </>
  );
}
