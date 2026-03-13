import { useState, useRef, useEffect } from 'react';

const COLORS = [
  'red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightred', 'beige', 
  'darkblue', 'darkgreen', 'cadetblue', 'darkpurple', 'white', 'pink', 
  'lightblue', 'lightgreen', 'gray', 'black', 'lightgray'
];

interface Props {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPickerDropdown({ selectedColor, onSelect }: Props) {
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
        className="w-10 h-10 rounded border border-slate-200 flex items-center justify-center bg-white shadow-sm hover:border-slate-300 transition-colors"
        title="Escolher cor do pin"
      >
        <div 
          className="w-6 h-6 rounded-full shadow-inner" 
          style={{ backgroundColor: selectedColor === 'white' ? '#fff' : selectedColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 p-3 bg-white rounded-xl shadow-2xl border border-slate-100 w-48">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Cores do Pin</p>
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onSelect(color);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedColor === color ? 'border-orange-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color === 'white' ? '#fff' : color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
