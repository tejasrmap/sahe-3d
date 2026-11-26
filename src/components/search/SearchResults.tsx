import React from 'react';
import { SearchResultItem } from '../../hooks/useCampusSearch';
import { Building2, MapPin, GraduationCap, Wrench, ArrowRight, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface SearchResultsProps {
  results: SearchResultItem[];
  recentSearches: string[];
  query: string;
  selectedIndex: number;
  onSelect: (item: SearchResultItem) => void;
  onSelectRecent: (term: string) => void;
  onClearRecent: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  recentSearches,
  query,
  selectedIndex,
  onSelect,
  onSelectRecent,
  onClearRecent,
}) => {
  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'building':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'department':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'facility':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'poi':
      default:
        return <MapPin className="w-4 h-4 text-rose-400" />;
    }
  };

  // If query is empty, show recent searches and quick suggestions
  if (!query.trim()) {
    return (
      <div className="p-3 text-slate-200">
        {recentSearches.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recent Searches
              </span>
              <button
                type="button"
                onClick={onClearRecent}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectRecent(term)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition-colors"
                >
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-2 pt-2 border-t border-white/10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Campus Quick Navigation
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => onSelectRecent('CSE Complex')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 text-left border border-white/5 transition-colors"
            >
              <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">CSE Computing Block</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectRecent('Central Library')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 text-left border border-white/5 transition-colors"
            >
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Dr. VR Library</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectRecent('Auditorium')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 text-left border border-white/5 transition-colors"
            >
              <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Central Auditorium</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectRecent('Cafeteria')}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 text-left border border-white/5 transition-colors"
            >
              <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Central Cafeteria</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If query yielded 0 results
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
        <p className="text-sm font-medium text-slate-300">No campus locations found</p>
        <p className="text-xs text-slate-400 mt-1">
          Try searching for "Library", "CSE", "Hostel", "Sports", or "Auditorium".
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/5 scrollbar-thin scrollbar-thumb-slate-700">
      {results.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={clsx(
              'w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group',
              isSelected
                ? 'bg-emerald-500/15 text-white border border-emerald-500/30 shadow-sm'
                : 'hover:bg-slate-800/70 text-slate-200 border border-transparent'
            )}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  isSelected ? 'bg-emerald-500/20' : 'bg-slate-800'
                )}
              >
                {getItemIcon(item.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/10 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
              </div>
            </div>

            <ArrowRight
              className={clsx(
                'w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200',
                isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
