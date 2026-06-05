'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * Indica si los efectos visuales deben reproducirse: requiere que la opción
 * "Efectos visuales" esté activa (por defecto sí, también en partidas antiguas
 * sin el campo) Y que el sistema no pida movimiento reducido.
 */
export function useVisualEffects(): boolean {
  const enabled = useGameStore((s) => s.options.visualEffects !== false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return enabled && !reduced;
}
