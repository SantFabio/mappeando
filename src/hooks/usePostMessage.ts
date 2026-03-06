import { useEffect, useState } from 'react';
import type { PostMessageEvent } from '../types';

/**
 * Hook que escuta mensagens via window.postMessage (enviadas pelo Wix ou pela página de teste)
 * e retorna o estado mais recente com os dados do mapa.
 */
export function usePostMessage() {
  const [data, setData] = useState<PostMessageEvent | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const raw = event.data;

      // Valida que ao menos um dos campos necessários está presente
      if (!raw?.mapData && !raw?.filters) return;

      // Normaliza o aninhamento dos dados do mapa (padrão Wix) se houver
      const mapData = raw.mapData ? (raw.mapData.mapData || raw.mapData) : undefined;

      setData(current => {
        // Se já existe um estado, apenas mesclamos o novo valor.
        // Se é o primeiro recebimento, combinamos com os valores brutos.
        return {
          mapData: mapData ?? current?.mapData ?? { categoryA: [], categoryB: [], categoryC: [] },
          filters: raw.filters ?? current?.filters ?? { category: 'all', distance: 10 }
        };
      });
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return data;
}
