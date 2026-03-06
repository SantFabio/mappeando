import { motion, AnimatePresence } from 'framer-motion';
import type { Filtros } from '../../types';

interface FiltrosAccordionProps {
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  addressQuery: string;
  isSearchingLocation: boolean;
  hasCustomLocation: boolean;
  suggestions: any[];
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  activeAccordion: 'filtros' | 'json' | null;
  setActiveAccordion: React.Dispatch<React.SetStateAction<'filtros' | 'json' | null>>;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchAddress: () => void;
  handleGetMyLocation: () => void;
  handleSelectSuggestion: (feature: any) => void;
  handleSend: () => void;
}

export function FiltrosAccordion({
  filtros, setFiltros,
  addressQuery, isSearchingLocation, hasCustomLocation,
  suggestions, showSuggestions, setShowSuggestions,
  activeAccordion, setActiveAccordion,
  handleAddressChange, handleSearchAddress, handleGetMyLocation,
  handleSelectSuggestion, handleSend
}: FiltrosAccordionProps) {
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300">
      <button
        onClick={() => setActiveAccordion(activeAccordion === 'filtros' ? null : 'filtros')}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <h2 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4-4-4-4" /><path d="m14 16 4-4-4-4" /><path d="M7 12h10" /></svg>
          </div>
          Filtros de Busca
        </h2>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: activeAccordion === 'filtros' ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-slate-400"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {activeAccordion === 'filtros' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-50 space-y-4">
              <div className="flex flex-col gap-1.5 pt-4">
                <label className="text-sm font-semibold text-slate-700">Tipo de Curso</label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                  value={filtros.tipoCurso}
                  onChange={(e) => setFiltros({ ...filtros, tipoCurso: e.target.value as Filtros['tipoCurso'] })}
                >
                  <option value="checkboxTodos">Todos</option>
                  <option value="checkboxGratuitos">Gratuitos</option>
                  <option value="checkboxPagosBolsa">Pagos com Bolsa</option>
                  <option value="checkboxPagosAcessiveis">Pagos Acessíveis</option>
                </select>
              </div>

              <div className={`flex flex-col gap-1.5 transition-opacity duration-300 ${!hasCustomLocation ? 'opacity-50' : 'opacity-100'}`}>
                <label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
                  Distância
                  {!hasCustomLocation ? (
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full">Defina seu endereço</span>
                  ) : (
                    <span>{filtros.distancia} km</span>
                  )}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  disabled={!hasCustomLocation}
                  className={`w-full accent-orange-500 ${!hasCustomLocation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  value={filtros.distancia}
                  onChange={(e) => setFiltros({ ...filtros, distancia: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-sm font-semibold text-slate-700">Onde você está?</label>
                  <div className="flex gap-2 relative">
                    <input
                      type="text"
                      placeholder="Digite seu endereço (ex: Av. Paulista, São Paulo)"
                      className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-sm"
                      value={addressQuery}
                      onChange={handleAddressChange}
                      onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
                    />

                    {/* Dropdown de Sugestões Photon */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="absolute top-12 left-0 w-[calc(100%-88px)] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                        >
                          {suggestions.map((feature, idx) => {
                            const props = feature.properties;
                            const mainText = props.name || props.street || "Endereço desconhecido";
                            const subText = [props.district, props.city, props.state].filter(Boolean).join(' - ');

                            return (
                              <div
                                key={idx}
                                className="px-4 py-2 border-b border-slate-50 hover:bg-orange-50 cursor-pointer flex flex-col transition-colors last:border-0"
                                onClick={() => handleSelectSuggestion(feature)}
                              >
                                <span className="text-sm font-semibold text-slate-700 truncate">{mainText}</span>
                                {subText && <span className="text-xs text-slate-500 truncate">{subText}</span>}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleSearchAddress}
                      disabled={isSearchingLocation}
                      className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 z-10"
                    >
                      {isSearchingLocation ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGetMyLocation}
                  disabled={isSearchingLocation}
                  className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                  Usar minha localização atual
                </button>

                <div className="grid grid-cols-2 gap-3 mt-2 opacity-60">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Latitude Atribuída</label>
                    <div className="h-8 px-3 rounded-md bg-slate-50 border border-slate-100 flex items-center text-xs text-slate-500">
                      {typeof filtros.endereco === 'object' ? filtros.endereco.location?.latitude : ''}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Longitude Atribuída</label>
                    <div className="h-8 px-3 rounded-md bg-slate-50 border border-slate-100 flex items-center text-xs text-slate-500">
                      {typeof filtros.endereco === 'object' ? filtros.endereco.location?.longitude : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-4 border-t border-slate-100">
                <button
                  onClick={handleSend}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                  Enviar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
