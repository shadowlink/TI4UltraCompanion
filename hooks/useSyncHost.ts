'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const DEBOUNCE_MS = 150;

export function useSyncHost(roomCode: string | null): { pushNow: () => void } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef(roomCode);
  codeRef.current = roomCode;

  const pushNow = useCallback(() => {
    if (!codeRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const state = useGameStore.getState().extractSyncState();
    fetch(`/api/room/${codeRef.current}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    const unsub = useGameStore.subscribe(() => {
      if (!codeRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const state = useGameStore.getState().extractSyncState();
        fetch(`/api/room/${codeRef.current}/push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        }).catch(() => {});
      }, DEBOUNCE_MS);
    });

    // Push initial state immediately
    pushNow();

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [roomCode, pushNow]);

  return { pushNow };
}
