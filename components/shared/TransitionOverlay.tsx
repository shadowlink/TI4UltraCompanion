'use client';

import { useGameStore } from '@/store/gameStore';

export default function TransitionOverlay() {
  const showTransition = useGameStore((s) => s.showTransition);
  const transitionText = useGameStore((s) => s.transitionText);

  if (!showTransition) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 transition-overlay">
      <h2
        className="text-3xl md:text-5xl text-center text-shadow"
        style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-accent)' }}
      >
        {transitionText.turn}
      </h2>
      <h2
        className="mt-4 text-2xl md:text-4xl text-center text-shadow"
        style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-gold)' }}
      >
        {transitionText.phase}
      </h2>
    </div>
  );
}
