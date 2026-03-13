import type { CategoryConfig } from '../../types';
import { ColorPickerDropdown } from './ColorPickerDropdown';
import { IconPickerDropdown } from './IconPickerDropdown';

interface Props {
  categories: CategoryConfig[];
  onUpdateCategories: (categories: CategoryConfig[]) => void;
}

export function CategoryManager({ categories, onUpdateCategories }: Props) {
  const handleAddCategory = () => {
    const newId = `cat_${Date.now()}`;
    const newCategory: CategoryConfig = {
      id: newId,
      name: `Nova Categoria`,
      color: 'blue',
      icon: 'map-marker'
    };
    onUpdateCategories([...categories, newCategory]);
  };

  const handleRemoveCategory = (id: string) => {
    onUpdateCategories(categories.filter(c => c.id !== id));
  };

  const handleUpdateCategory = (id: string, updates: Partial<CategoryConfig>) => {
    onUpdateCategories(
      categories.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">Categorias</h3>
        <button
          onClick={handleAddCategory}
          className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Adicionar
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="group p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3 transition-all hover:bg-white hover:shadow-md hover:border-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => handleUpdateCategory(cat.id, { name: e.target.value })}
                className="flex-1 bg-transparent border-none font-semibold text-sm text-slate-800 focus:ring-0 p-0"
                placeholder="Nome da categoria"
              />
              <button
                onClick={() => handleRemoveCategory(cat.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all"
                title="Remover categoria"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-0.5">Cor do Pin</span>
                <ColorPickerDropdown 
                  selectedColor={cat.color} 
                  onSelect={(color) => handleUpdateCategory(cat.id, { color })} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-0.5">Ícone</span>
                <IconPickerDropdown 
                  selectedIcon={cat.icon} 
                  onSelect={(icon) => handleUpdateCategory(cat.id, { icon })} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
