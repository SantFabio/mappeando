import L from 'leaflet';
import 'leaflet.awesome-markers';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ── Ícones Leaflet Awesome Markers ────────────────────────────────────────────

export const iconGreen = L.AwesomeMarkers.icon({
  icon: 'graduation-cap',
  prefix: 'fa',
  markerColor: 'green',
  iconColor: 'white'
});

export const iconOrange = L.AwesomeMarkers.icon({
  icon: 'book',
  prefix: 'fa',
  markerColor: 'orange',
  iconColor: 'white'
});

export const iconYellow = L.AwesomeMarkers.icon({
  icon: 'university',
  prefix: 'fa',
  markerColor: 'cadetblue', // leaflet.awesome-markers default color close to yellow/distinct
  iconColor: 'white'
});
