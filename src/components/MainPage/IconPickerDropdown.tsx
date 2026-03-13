import { useState, useRef, useEffect } from 'react';

const ICONS = [
  'graduation-cap', 'book', 'university', 'school', 'map-marker', 
  'info-circle', 'star', 'heart', 'flag', 'user', 
  'users', 'home', 'building', 'briefcase', 'search',
  'calendar', 'clock', 'phone', 'envelope', 'globe'
];

interface Props {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

export function IconPickerDropdown({ selectedIcon, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded border border-slate-200 flex items-center justify-center bg-white shadow-sm hover:border-slate-300 transition-colors text-slate-600"
        title="Escolher ícone do pin"
      >
        <i className={`fa fa-${selectedIcon}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 p-3 bg-white rounded-xl shadow-2xl border border-slate-100 w-56">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Ícones do Pin</p>
          <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  onSelect(icon);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded border flex items-center justify-center transition-all hover:bg-slate-50 ${
                  selectedIcon === icon ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-600'
                }`}
                title={icon}
              >
                <i className={`fa fa-${icon} text-sm`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
