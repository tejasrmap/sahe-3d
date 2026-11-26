import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useCampusSearch, SearchResultItem } from '../../hooks/useCampusSearch';
import { SearchResults } from './SearchResults';
import { GlassPanel } from '../ui/GlassPanel';

interface CampusSearchProps {
  onSelectItem: (item: SearchResultItem) => void;
  className?: string;
}

export const CampusSearch: React.FC<CampusSearchProps> = ({
  onSelectItem,
  className = '',
}) => {
  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    results,
    selectedIndex,
    setSelectedIndex,
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
  } = useCampusSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle arrow keys and enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    saveRecentSearch(item.title);
    setIsOpen(false);
    onSelectItem(item);
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-lg ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search SAHE campus, buildings, labs..."
          className="w-full h-11 pl-10 pr-24 rounded-xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/40 backdrop-blur-xl shadow-glass transition-all duration-200"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800/80 rounded border border-white/10 pointer-events-none">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Results Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <GlassPanel className="p-1 border border-white/15 overflow-hidden shadow-2xl">
            <SearchResults
              results={results}
              recentSearches={recentSearches}
              query={query}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onSelectRecent={handleSelectRecent}
              onClearRecent={clearRecentSearches}
            />
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
