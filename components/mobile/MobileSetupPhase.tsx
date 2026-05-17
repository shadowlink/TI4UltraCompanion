'use client';

import { useGameStore } from '@/store/gameStore';

export default function MobileSetupPhase() {
  const lang = useGameStore((s) => s.lang);
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-400 rounded-full animate-spin" />
      <p className="text-base text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
        {lang === 'es' ? 'Esperando configuración' : 'Waiting for setup'}
      </p>
      <p className="text-xs text-gray-500">
        {lang === 'es'
          ? 'El host está preparando la partida'
          : 'Host is preparing the game'}
      </p>
    </div>
  );
}
