import { motion, AnimatePresence } from 'framer-motion';
import type { MapConfig, CategoryConfig } from '../../types';
import { CategoryManager } from './CategoryManager';

interface ConfigAccordionProps {
  config: MapConfig;
  onUpdateConfig: (newConfig: MapConfig) => void;
  activeAccordion: 'filters' | 'json' | 'config' | null;
  setActiveAccordion: React.Dispatch<React.SetStateAction<'filters' | 'json' | 'config' | null>>;
}

export function ConfigAccordion({ 
  config, 
  onUpdateConfig, 
  activeAccordion, 
  setActiveAccordion 
}: ConfigAccordionProps) {
  const updateCategories = (categories: CategoryConfig[]) => {
    onUpdateConfig({ ...config, categories });
  };

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300">
      <button
        onClick={() => setActiveAccordion(activeAccordion === 'config' ? null : 'config')}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <h2 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          Configurações do Mapa
        </h2>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: activeAccordion === 'config' ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-slate-400"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {activeAccordion === 'config' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-50 space-y-6">
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lat Central</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-sm"
                    value={config.center.latitude}
                    onChange={(e) => onUpdateConfig({ ...config, center: { ...config.center, latitude: parseFloat(e.target.value) } })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lon Central</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500 text-sm"
                    value={config.center.longitude}
                    onChange={(e) => onUpdateConfig({ ...config, center: { ...config.center, longitude: parseFloat(e.target.value) } })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Zoom Inicial
                  <span className="text-orange-600">{config.zoom}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  className="w-full accent-orange-500 cursor-pointer"
                  value={config.zoom}
                  onChange={(e) => onUpdateConfig({ ...config, zoom: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Raio Padrão (km)
                  <span className="text-orange-600">{config.radius} km</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  className="w-full accent-orange-500 cursor-pointer"
                  value={config.radius}
                  onChange={(e) => onUpdateConfig({ ...config, radius: parseInt(e.target.value) })}
                />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <CategoryManager 
                  categories={config.categories} 
                  onUpdateCategories={updateCategories} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
