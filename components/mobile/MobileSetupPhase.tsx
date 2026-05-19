'use client';

import { useGameStore } from '@/store/gameStore';

export default function MobileSetupPhase() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-400 rounded-full animate-spin" />
      <p className="text-base text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
        {'Esperando configuración'}
      </p>
      <p className="text-xs text-gray-500">
        {'El host está preparando la partida'}
      </p>
    </div>
  );
}
