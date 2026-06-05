'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useGameStore } from '@/store/gameStore';
import { useVisualEffects } from '@/hooks/useVisualEffects';

export default function TransitionOverlay() {
  const showTransition = useGameStore((s) => s.showTransition);
  const transitionText = useGameStore((s) => s.transitionText);
  const fx = useVisualEffects();

  // Sin efectos: overlay plano original (CSS fadeInOut).
  if (!fx) {
    if (!showTransition) return null;
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 transition-overlay">
        <h2 className="text-3xl md:text-5xl text-center text-shadow" style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-accent)' }}>
          {transitionText.turn}
        </h2>
        <h2 className="mt-4 text-2xl md:text-4xl text-center text-shadow" style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-gold)' }}>
          {transitionText.phase}
        </h2>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showTransition && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-3xl md:text-5xl text-center text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-accent)' }}
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {transitionText.turn}
          </motion.h2>

          {/* Línea de acento tipo "warp" */}
          <motion.div
            className="my-3 h-px bg-[color:var(--accent)]"
            style={{ boxShadow: '0 0 10px var(--accent-glow)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1, width: '40%' }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          />

          <motion.h2
            className="text-2xl md:text-4xl text-center text-shadow"
            style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--color-gold)' }}
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: 'easeOut' }}
          >
            {transitionText.phase}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
