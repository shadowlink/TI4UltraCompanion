'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { hasSavedGame } from '@/lib/persistence';

export default function StartScreen() {
  const router = useRouter();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setCanContinue(hasSavedGame());
  }, []);

  const handleNewGame = () => {
    const password = window.prompt('Introduce la contraseña para crear partida:');
    if (password !== 'tapia') {
      if (password !== null) {
        window.alert('Contraseña incorrecta.');
      }
      return;
    }
    startNewGame();
    router.push('/game');
  };

  const handleContinue = () => {
    // The game page will hydrate from localStorage on mount
    router.push('/game?continue=1');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-space px-4">
      {/* Logo / title */}
      <div className="mb-12 text-center">
        <h1
          className="text-4xl md:text-6xl text-shadow mb-2"
          style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-accent)' }}
        >
          TIIV Manager
        </h1>
        <p
          className="text-lg text-gray-400"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          Twilight Imperium IV Assistant
        </p>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleNewGame}
          className="py-4 text-lg border-2 border-orange-500 bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 rounded transition-all"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Nueva Partida'}
        </button>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`py-4 text-lg border-2 rounded transition-all ${
            canContinue
              ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/30 text-blue-300'
              : 'border-gray-700 bg-gray-800/20 text-gray-600 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'Continuar'}
        </button>

        <button
          onClick={() => router.push('/factions')}
          className="py-4 text-lg border-2 border-purple-500 bg-purple-500/10 hover:bg-purple-500/30 text-purple-300 rounded transition-all"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          📖 {'Explorar Facciones'}
        </button>
      </div>

      {/* Version */}
      <p className="mt-16 text-xs text-gray-600" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        v8.0 — fan made, not official
      </p>
    </div>
  );
}
