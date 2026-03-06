import { useEffect } from 'react';
import { Legend } from '../components/ReceiverPage/Legend';
import { MapView } from '../components/ReceiverPage/MapView';
import { usePostMessage } from '../hooks/usePostMessage';
import type { Cursinhos, Filtros } from '../types';

const defaultCursinhos: Cursinhos = { gratuitos: [], caros: [], acessiveis: [] };
const defaultFiltros: Filtros = { tipoCurso: 'checkboxTodos', distancia: 10 };

export default function ReceiverPage() {
  const data = usePostMessage();

  // Notificar o pai que o mapa está pronto para receber dados
  useEffect(() => {
    window.parent.postMessage('MAP_READY', '*');
  }, []);

  const cursinhos = data?.cursinhos ?? defaultCursinhos;
  const filtros = data?.filtros ?? defaultFiltros;

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-50">
      {/* Mapa ocupa a tela toda */}
      <MapView cursinhos={cursinhos} filtros={filtros} />

      {/* Legenda flutuante (posicionada internamente no componente como fixed) */}
      <Legend />
    </div>
  );
}
