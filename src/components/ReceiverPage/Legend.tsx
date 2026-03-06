
// Importa os SVGs das folhas
import leafGreen from '../../assets/leafGreen.svg';
import leafOrange from '../../assets/leafOrange.svg';
import leafYellow from '../../assets/leafYellow.svg';

const items = [
  { src: leafGreen, label: 'Cursos gratuitos' },
  { src: leafOrange, label: 'Cursos pagos' },
  { src: leafYellow, label: 'Cursos pagos acessíveis' },
];

export function Legend() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-1000 flex flex-col gap-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
      {items.map(({ src, label }) => (
        <div
          key={label}
          className="group relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <img src={src} alt={label} className="w-8 h-8 object-contain" />

          {/* Tooltip (Balão) */}
          <div className="absolute right-[120%] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <div className="bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg whitespace-nowrap shadow-xl relative">
              {label}
              {/* Seta do Balão */}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

