import { motion, AnimatePresence } from 'framer-motion';

interface JsonAccordionProps {
  cursinhosJson: string;
  setCursinhosJson: (val: string) => void;
  activeAccordion: 'filtros' | 'json' | null;
  setActiveAccordion: React.Dispatch<React.SetStateAction<'filtros' | 'json' | null>>;
}

export function JsonAccordion({ cursinhosJson, setCursinhosJson, activeAccordion, setActiveAccordion }: JsonAccordionProps) {
  return (
    <div className={`${activeAccordion === 'json' ? 'flex-1' : 'shrink-0'} border border-slate-100 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 flex flex-col`}>
      <button
        onClick={() => setActiveAccordion(activeAccordion === 'json' ? null : 'json')}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shrink-0"
      >
        <h2 className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
          </div>
          Dados Brutos (JSON)
        </h2>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: activeAccordion === 'json' ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-slate-400"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {activeAccordion === 'json' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, flexGrow: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col"
          >
            <div className="flex-1 p-4 pt-0 border-t border-slate-50 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col gap-3 pt-4">
                <textarea
                  className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none min-h-[200px]"
                  value={cursinhosJson}
                  onChange={(e) => setCursinhosJson(e.target.value)}
                  placeholder='{ "gratuitos": [], ... }'
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
