'use client';

import { useEffect } from 'react';
import { loadGame, hasSavedGame, saveGame, extractSaveState } from '@/lib/persistence';
import { useGameStore } from '@/store/gameStore';
import { PHASE_INIT, PHASE_END } from '@/lib/constants';
import type { GamePhase } from '@/types/game';

const PERSIST_THROTTLE_MS = 250;

// Module-level throttle: shared between subscribe and synchronous flush.
let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let pendingDirty = false;

function shouldPersist(phase: GamePhase): boolean {
  return phase !== PHASE_INIT && phase !== PHASE_END;
}

function writeNow(): void {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  pendingDirty = false;
  const state = useGameStore.getState();
  if (!shouldPersist(state.phase)) return;
  saveGame(extractSaveState(state));
}

function scheduleWrite(): void {
  pendingDirty = true;
  if (pendingTimer) return;
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    if (pendingDirty) writeNow();
  }, PERSIST_THROTTLE_MS);
}

/**
 * Force any pending throttled write to commit synchronously. Call from
 * `pagehide`, `visibilitychange → hidden`, or `beforeunload` so the last few
 * hundred milliseconds of state aren't lost when the tab closes.
 */
export function flushPersistSync(): void {
  if (!pendingDirty && !pendingTimer) return;
  writeNow();
}

export function usePersistence() {
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

/**
 * Auto-persist the store to localStorage on every change while a game is in
 * progress (phase ∉ {PHASE_INIT, PHASE_END}). Throttled so high-frequency
 * updates (clock ticks, rapid VP edits) don't thrash localStorage, but every
 * change is captured on the trailing edge.
 */
export function useAutoPersist(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const unsub = useGameStore.subscribe((state, prev) => {
      if (state === prev) return;
      if (!shouldPersist(state.phase)) return;
      scheduleWrite();
    });
    return () => {
      unsub();
      // Flush before unmount so transitioning to viewer mode / SPA-nav doesn't
      // discard the last in-flight change.
      if (pendingDirty) writeNow();
    };
  }, [enabled]);
}
