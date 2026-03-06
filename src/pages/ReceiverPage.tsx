import { useEffect } from 'react';
import { Legend } from '../components/ReceiverPage/Legend';
import { MapView } from '../components/ReceiverPage/MapView';
import { usePostMessage } from '../hooks/usePostMessage';
import type { MapData, Filters } from '../types';

const defaultMapData: MapData = { categoryA: [], categoryB: [], categoryC: [] };
const defaultFilters: Filters = { category: 'all', distance: 10 };

export default function ReceiverPage() {
  const data = usePostMessage();

  // Notificar o pai que o mapa está pronto para receber dados
  useEffect(() => {
    window.parent.postMessage('MAP_READY', '*');
  }, []);

  const mapData = data?.mapData ?? defaultMapData;
  const filters = data?.filters ?? defaultFilters;

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-50">
      {/* Mapa ocupa a tela toda */}
      <MapView mapData={mapData} filters={filters} />

      {/* Legenda flutuante (posicionada internamente no componente como fixed) */}
      <Legend />
    </div>
  );
}
