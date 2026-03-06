import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { Cursinho } from '../../types';
import { CourseCard } from './CourseCard';

interface Props {
  lista: Cursinho[] | undefined | null;
  icon: L.Icon;
}

// ── Marcadores ────────────────────────────────────────────────────────────────
export function Markers({ lista, icon }: Props) {
  if (!Array.isArray(lista)) return null;
  console.log(lista);


  return (
    <>
      {lista
        .filter(c =>
          c.latitude != null && c.longitude != null &&
          isFinite(c.latitude) && isFinite(c.longitude) &&
          c.latitude >= -90 && c.latitude <= 90 &&
          c.longitude >= -180 && c.longitude <= 180
        )
        .map((c, i) => (
          <Marker key={c._id ?? i} position={[c.latitude!, c.longitude!]} icon={icon}>
            <Popup maxWidth={280}>
              <CourseCard cursinho={c} />
            </Popup>
          </Marker>
        ))}
    </>
  );
}
