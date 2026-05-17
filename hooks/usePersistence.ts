'use client';

import { useEffect } from 'react';
import { loadGame, hasSavedGame } from '@/lib/persistence';
import { useGameStore } from '@/store/gameStore';

export function usePersistence() {
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);
  return { hasSavedGame };
}

export function useHydrateOnMount(enabled: boolean) {
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);

  useEffect(() => {
    // Always load language preference
    const savedLang = localStorage.getItem('ti4_lang');
    if (savedLang === 'es' || savedLang === 'en') {
      useGameStore.getState().setLang(savedLang);
    }
    if (!enabled) return;
    const saved = loadGame();
    if (saved) {
      hydrateFromSave(saved);
    }
  }, [enabled, hydrateFromSave]);
}
