import { useState, useMemo, useEffect, useCallback } from 'react';
import { CAMPUS_BUILDINGS } from '../data/buildings';
import { CAMPUS_POIS } from '../data/pois';
import { OUTDOOR_FACILITIES } from '../data/outdoorFacilities';
import { Building, POI } from '../types/campus';

export interface SearchResultItem {
  id: string;
  type: 'building' | 'poi' | 'department' | 'facility';
  title: string;
  subtitle: string;
  category: string;
  latitude: number;
  longitude: number;
  buildingId?: string;
  badge?: string;
}

const RECENT_SEARCHES_KEY = 'sahe_campus_recent_searches';

export function useCampusSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['CSE Complex', 'Central Library', 'Auditorium', 'Cafeteria', 'Civil Block', 'Cricket Ground'];
    } catch {
      return ['CSE Complex', 'Central Library', 'Auditorium', 'Cafeteria', 'Civil Block', 'Cricket Ground'];
    }
  });

  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Compute search results
  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResultItem[] = [];

    // Search buildings
    for (const b of CAMPUS_BUILDINGS) {
      const nameMatch = b.name.toLowerCase().includes(q);
      const codeMatch = b.code.toLowerCase().includes(q);
      const descMatch = b.description.toLowerCase().includes(q);

      if (nameMatch || codeMatch || descMatch) {
        items.push({
          id: `bld-${b.id}`,
          type: 'building',
          title: b.name,
          subtitle: `${b.code} • ${b.floors} Floors • ${b.category.toUpperCase()}`,
          category: b.category,
          latitude: b.latitude,
          longitude: b.longitude,
          buildingId: b.id,
          badge: b.code,
        });
      }

      // Check departments inside building
      for (const dept of b.departments) {
        if (dept.toLowerCase().includes(q)) {
          items.push({
            id: `dept-${b.id}-${dept}`,
            type: 'department',
            title: dept,
            subtitle: `Department in ${b.name}`,
            category: 'academic',
            latitude: b.latitude,
            longitude: b.longitude,
            buildingId: b.id,
            badge: 'DEPT',
          });
        }
      }

      // Check facilities inside building
      for (const fac of b.facilities) {
        if (fac.toLowerCase().includes(q)) {
          items.push({
            id: `fac-${b.id}-${fac}`,
            type: 'facility',
            title: fac,
            subtitle: `Located in ${b.name}`,
            category: 'facility',
            latitude: b.latitude,
            longitude: b.longitude,
            buildingId: b.id,
            badge: 'FACILITY',
          });
        }
      }
    }

    // Search Outdoor Facilities
    for (const ofac of OUTDOOR_FACILITIES) {
      if (
        ofac.name.toLowerCase().includes(q) ||
        ofac.code.toLowerCase().includes(q) ||
        ofac.description.toLowerCase().includes(q) ||
        ofac.facilities.some(f => f.toLowerCase().includes(q))
      ) {
        items.push({
          id: `outdoor-${ofac.id}`,
          type: 'facility',
          title: ofac.name,
          subtitle: `${ofac.code} • ${ofac.category.toUpperCase()} • ${ofac.areaSqm} m²`,
          category: ofac.category,
          latitude: ofac.latitude,
          longitude: ofac.longitude,
          badge: 'OUTDOOR',
        });
      }
    }

    // Search POIs
    for (const p of CAMPUS_POIS) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ) {
        items.push({
          id: `poi-${p.id}`,
          type: 'poi',
          title: p.name,
          subtitle: `${p.category.toUpperCase()} • ${p.description.slice(0, 60)}...`,
          category: p.category,
          latitude: p.latitude,
          longitude: p.longitude,
          buildingId: p.buildingId,
          badge: 'POI',
        });
      }
    }

    // Sort by relevance: title prefix match > type === 'building' > substring match
    items.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aStarts = aTitle.startsWith(q) || (a.badge && a.badge.toLowerCase().startsWith(q));
      const bStarts = bTitle.startsWith(q) || (b.badge && b.badge.toLowerCase().startsWith(q));
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      if (a.type === 'building' && b.type !== 'building') return -1;
      if (a.type !== 'building' && b.type === 'building') return 1;

      return 0;
    });

    return items.slice(0, 15);
  }, [query]);

  // Handle keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    openSearch,
    closeSearch,
    selectedIndex,
    setSelectedIndex,
    results,
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
  };
}
