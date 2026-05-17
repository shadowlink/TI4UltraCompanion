'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PHASE_INIT } from '@/lib/constants';

export function useGameClock(enabled = true) {
  const tick = useGameStore((s) => s.tick);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const lastActivity = useGameStore((s) => s.lastActivity);
  const inactivityMinutes = useGameStore((s) => s.options.inactivityMinutes);
  const phase = useGameStore((s) => s.phase);
  const openModal = useGameStore((s) => s.openModal);
  const setClock = useGameStore((s) => s.setClock);

  // Single interval — always running, clockRun state controls whether time advances
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(id);
  }, [tick, enabled]);

  // Inactivity detection
  useEffect(() => {
    if (!enabled) return;
    if (phase === PHASE_INIT) return;
    const elapsed = gameDuration - lastActivity;
    const threshold = inactivityMinutes * 60;
    if (elapsed === threshold) {
      openModal('inactivity');
    } else if (elapsed === threshold * 2) {
      setClock(-1);
      openModal('pauseAlert');
    }
  }, [enabled, gameDuration, lastActivity, inactivityMinutes, phase, openModal, setClock]);
}
