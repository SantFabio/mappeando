import { useState, useRef, useEffect } from 'react';

import type { MapData, Filters, PostMessageEvent, MapConfig } from '../types';
import { FiltersAccordion } from '../components/MainPage/FiltersAccordion';
import { JsonAccordion } from '../components/MainPage/JsonAccordion';
import { ConfigAccordion } from '../components/MainPage/ConfigAccordion';

export default function MainPage() {
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: { latitude: -23.5505, longitude: -46.6333 },
    zoom: 11,
    radius: 10,
    categories: [
      { id: 'categoryA', name: 'Categoria A', color: 'green', icon: 'graduation-cap' },
      { id: 'categoryB', name: 'Categoria B', color: 'orange', icon: 'book' },
      { id: 'categoryC', name: 'Categoria C', color: 'cadetblue', icon: 'university' }
    ]
  });

  const [mapItems, setMapItems] = useState<MapData>({
    categoryA: [],
    categoryB: [],
    categoryC: []
  });

  const [mapDataJson, setMapDataJson] = useState<string>("");

  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    distance: 10,
    address: {
      location: { latitude: -23.5505, longitude: -46.6333 }
    }
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<'filters' | 'json' | 'config' | null>('config');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [hasCustomLocation, setHasCustomLocation] = useState(false);

  // Photon Suggestions State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carregar dados iniciais (courses.json)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch('/dynamic-map/courses.json');
        if (!res.ok) throw new Error('Não foi possível carregar o arquivo JSON');
        const data = await res.json();
        const initialMapData = data.cursinhos || data;

        const keys = Object.keys(initialMapData);
        let mappedData = initialMapData;
        if (keys.length > 0 && keys[0] !== 'categoryA' && keys[0] !== 'config') {
          mappedData = {
            categoryA: initialMapData[keys[0]] || [],
            categoryB: initialMapData[keys[1]] || [],
            categoryC: initialMapData[keys[2]] || []
          };
        }
        
        // Se já tiver config no JSON, carrega ela
        if (data.config) {
          setMapConfig(data.config);
          setMapItems(data.mapData || {});
        } else {
          setMapItems(mappedData);
        }
        
        setIsDataFetched(true);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    };
    loadInitialData();
  }, []);

  // Sincronizar o JSON quando config ou mapItems mudar
  useEffect(() => {
    const fullData = {
      config: mapConfig,
      mapData: mapItems
    };
    setMapDataJson(JSON.stringify(fullData, null, 2));
  }, [mapConfig, mapItems]);

  // Handshake listener
  useEffect(() => {
    const handleMapReady = (event: MessageEvent) => {
      if (event.data === 'MAP_READY') {
        setIsMapReady(true);
      }
    };

    window.addEventListener('message', handleMapReady);
    return () => window.removeEventListener('message', handleMapReady);
  }, []);

  // Sincronização automática quando o mapa estiver pronto ou dados mudarem
  useEffect(() => {
    if (isMapReady && isDataFetched && iframeRef.current?.contentWindow) {
      const message: PostMessageEvent = {
        config: mapConfig,
        mapData: mapItems,
        filters
      };
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }, [isMapReady, isDataFetched, mapConfig, mapItems, filters]);

  const handleSend = () => {
    if (iframeRef.current?.contentWindow) {
      const message: PostMessageEvent = {
        config: mapConfig,
        mapData: mapItems,
        filters
      };
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  const handleJsonChange = (val: string) => {
    setMapDataJson(val);
    try {
      const parsed = JSON.parse(val);
      if (parsed.config) setMapConfig(parsed.config);
      if (parsed.mapData) setMapItems(parsed.mapData);
    } catch (e) {
      // Ignora erro de parse enquanto o usuário digita
    }
  };

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }
    setIsSearchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev: Filters) => ({
          ...prev,
          address: {
            location: { latitude: position.coords.latitude, longitude: position.coords.longitude }
          }
        }));
        setHasCustomLocation(true);
        setIsSearchingLocation(false);
      },
      () => {
        alert("Não foi possível obter sua localização.");
        setIsSearchingLocation(false);
      }
    );
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      // Using Photon API for autocomplete
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&bbox=-73.99,-33.75,-34.79,5.27`); // bbox aproximado do Brasil para melhorar
      const data = await res.json();
      if (data && data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (e) {
      console.error("Erro ao buscar sugestões:", e);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500); // 500ms debounce
  };

  const handleSelectSuggestion = (feature: any) => {
    const [lon, lat] = feature.geometry.coordinates; // GeoJSON is [lon, lat]

    // Formatar o nome para ficar bonito no input
    const props = feature.properties;
    const displayName = [props.name, props.street, props.district, props.city, props.state].filter(Boolean).join(', ');

    setAddressQuery(displayName);
    setShowSuggestions(false);

    // Atualiza imediatamente e já manda
    const newFilters: Filters = {
      ...filters,
      address: {
        location: { latitude: lat, longitude: lon }
      }
    };

    setFilters(newFilters);
    setHasCustomLocation(true);

    // Auto-enviar ao selecionar uma sugestão para ir mais rápido, se o mapa estiver pronto
    setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ mapData: JSON.parse(mapDataJson), filters: newFilters }, '*');
      }
    }, 100);
  };

  const handleSearchAddress = async () => {
    if (!addressQuery.trim()) return;
    setIsSearchingLocation(true);
    setShowSuggestions(false);
    try {
      // Fallback pra a própria busca do Photon ao invés do Nominatim
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(addressQuery)}&limit=1&bbox=-73.99,-33.75,-34.79,5.27`);
      const data = await res.json();

      if (data && data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lon, lat] = feature.geometry.coordinates;

        setFilters((prev: Filters) => ({
          ...prev,
          address: {
            location: { latitude: lat, longitude: lon }
          }
        }));
        setHasCustomLocation(true);
      } else {
        alert("Endereço não encontrado. Tente ser mais específico.");
      }
    } catch (e) {
      alert("Erro ao buscar endereço.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fdfaf5] font-sans text-slate-800 relative">
      {/* Mapa como Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          ref={iframeRef}
          src="/dynamic-map/map"
          className="w-full h-full border-none"
          title="Mapa Preview"
        />
      </div>
      {/* Sidebar */}
      <aside className="m-6 w-96 shrink-0 rounded-4xl border border-white/50 bg-white/85 backdrop-blur-xl p-6 flex flex-col gap-6 shadow-2xl z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Mappeando</h1>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Configuração de Dados</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">

          {/* Config Accordion Item */}
          <ConfigAccordion
            config={mapConfig}
            onUpdateConfig={setMapConfig}
            activeAccordion={activeAccordion}
            setActiveAccordion={setActiveAccordion}
          />

          {/* Filters Accordion Item */}
          <FiltersAccordion
            filters={filters}
            setFilters={setFilters}
            addressQuery={addressQuery}
            isSearchingLocation={isSearchingLocation}
            hasCustomLocation={hasCustomLocation}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            activeAccordion={activeAccordion as any}
            setActiveAccordion={setActiveAccordion as any}
            handleAddressChange={handleAddressChange}
            handleSearchAddress={handleSearchAddress}
            handleGetMyLocation={handleGetMyLocation}
            handleSelectSuggestion={handleSelectSuggestion}
            handleSend={handleSend}
          />

          {/* JSON Accordion Item */}
          <JsonAccordion
            mapDataJson={mapDataJson}
            setMapDataJson={handleJsonChange}
            activeAccordion={activeAccordion as any}
            setActiveAccordion={setActiveAccordion as any}
          />
        </div>

      </aside>

      {/* Conteúdo Principal (Overlay) */}
      <main className="flex-1 relative z-10 p-8 flex flex-col justify-end pointer-events-none">
        <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 flex items-center justify-between text-sm text-slate-500 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            Escutando eventos de mensagem...
          </div>
          <div>Dica: Use <code>JSON.parse</code> para colar dados exportados do CMS.</div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
