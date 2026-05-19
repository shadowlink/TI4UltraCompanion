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
    if (!enabled) return;
    const saved = loadGame();
    if (saved) {
      hydrateFromSave(saved);
    }
  }, [enabled, hydrateFromSave]);
}
