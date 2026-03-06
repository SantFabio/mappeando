import L from 'leaflet';

import leafletGreenUrl from '../assets/leafletGreen.svg';
import leafletOrangeUrl from '../assets/leafletOrange.svg';
import leafletYellowUrl from '../assets/leafletYellow.svg';
import leafShadowUrl from '../assets/leafShadow.svg';

// ── Ícones Leaflet ────────────────────────────────────────────────────────────
function makeIcon(url: string) {
  return L.icon({
    iconUrl: url,
    shadowUrl: leafShadowUrl,
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [19, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [0, -80],
  });
}

export const iconGreen = makeIcon(leafletGreenUrl);
export const iconOrange = makeIcon(leafletOrangeUrl);
export const iconYellow = makeIcon(leafletYellowUrl);
