import { useEffect } from 'react';
import { Legend } from '../components/ReceiverPage/Legend';
import { MapView } from '../components/ReceiverPage/MapView';
import { usePostMessage } from '../hooks/usePostMessage';
import type { MapData, Filters, MapConfig } from '../types';

const defaultMapConfig: MapConfig = {
  center: { latitude: -23.5505, longitude: -46.6333 },
  zoom: 11,
  radius: 10,
  categories: [
    { id: 'categoryA', name: 'Categoria A', color: 'green', icon: 'graduation-cap' },
    { id: 'categoryB', name: 'Categoria B', color: 'orange', icon: 'book' },
    { id: 'categoryC', name: 'Categoria C', color: 'cadetblue', icon: 'university' }
  ]
};

const defaultMapData: MapData = { categoryA: [], categoryB: [], categoryC: [] };
const defaultFilters: Filters = { category: 'all', distance: 10 };

export default function ReceiverPage() {
  const data = usePostMessage();

  // Notificar o pai que o mapa está pronto para receber dados
  useEffect(() => {
    window.parent.postMessage('MAP_READY', '*');
  }, []);

  const config = data?.config ?? defaultMapConfig;
  const mapData = data?.mapData ?? defaultMapData;
  const filters = data?.filters ?? defaultFilters;

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-50">
      {/* Mapa ocupa a tela toda */}
      <MapView config={config} mapData={mapData} filters={filters} />

      {/* Legenda flutuante */}
      <Legend categories={config.categories} />
    </div>
  );
}
