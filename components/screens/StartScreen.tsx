'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { hasSavedGame } from '@/lib/persistence';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { BookOpen, Power, RotateCcw, AlertTriangle, Eye, Layers, Brain } from '@/components/ui/icons';

export default function StartScreen() {
  const router = useRouter();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [canContinue, setCanContinue] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [mirrorModalOpen, setMirrorModalOpen] = useState(false);
  const [mirrorCode, setMirrorCode] = useState('');

  useEffect(() => {
    setCanContinue(hasSavedGame());
  }, []);

  const handleNewGame = () => {
    setPassword('');
    setPasswordError(false);
    setPasswordModalOpen(true);
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== 'tapia') {
      setPasswordError(true);
      return;
    }
    setPasswordModalOpen(false);
    startNewGame();
    router.push('/game');
  };

  const handleContinue = () => {
    router.push('/game?continue=1');
  };

  const submitMirror = (e: React.FormEvent) => {
    e.preventDefault();
    const code = mirrorCode.trim().toUpperCase();
    if (code.length < 4) return;
    router.push(`/game?mirror=${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo / title */}
      <div className="mb-12 text-center">
        <h1
          className="text-4xl md:text-6xl text-shadow mb-2"
          style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--accent)' }}
        >
          TIIV Manager
        </h1>
        <p
          className="text-base text-[color:var(--text-muted)] tracking-wider uppercase"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          Twilight Imperium IV Assistant
        </p>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={handleNewGame} variant="primary" size="lg" fullWidth icon={Power}>
          {'Nueva Partida'}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant="secondary"
          size="lg"
          fullWidth
          icon={RotateCcw}
        >
          {'Continuar'}
        </Button>
        <Button
          onClick={() => router.push('/factions')}
          variant="ghost"
          size="lg"
          fullWidth
          icon={BookOpen}
        >
          {'Explorar Facciones'}
        </Button>
        <Button
          onClick={() => router.push('/guia')}
          variant="ghost"
          size="lg"
          fullWidth
          icon={Layers}
        >
          {'Guía de referencia'}
        </Button>
        <Button
          onClick={() => router.push('/aprende')}
          variant="ghost"
          size="lg"
          fullWidth
          icon={Brain}
        >
          {'Aprende a jugar'}
        </Button>
        <Button
          onClick={() => { setMirrorCode(''); setMirrorModalOpen(true); }}
          variant="ghost"
          size="lg"
          fullWidth
          icon={Eye}
        >
          {'Pantalla espejo'}
        </Button>
      </div>

      <p className="mt-16 text-xs text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
        v8.0 — fan made, not official
      </p>

      {/* Password modal */}
      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Acceso restringido"
      >
        <form onSubmit={submitPassword} className="p-5 flex flex-col gap-4">
          <p className="text-sm text-[color:var(--text-secondary)]">
            {'Introduce la contraseña para crear una nueva partida.'}
          </p>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
            className="bg-[var(--bg-surface)] border border-[color:var(--accent-border)] rounded-[var(--radius)] px-3 py-2 text-white outline-none focus:border-[color:var(--accent-border-strong)] transition-colors"
            placeholder="Contraseña"
          />
          {passwordError && (
            <p className="flex items-center gap-1.5 text-xs text-[color:var(--danger)]">
              <AlertTriangle size={14} strokeWidth={2} aria-hidden />
              {'Contraseña incorrecta.'}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setPasswordModalOpen(false)}>
              {'Cancelar'}
            </Button>
            <Button type="submit" variant="primary">
              {'Entrar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mirror screen modal — enter the room code shown on the host */}
      <Modal
        open={mirrorModalOpen}
        onClose={() => setMirrorModalOpen(false)}
        title="Pantalla espejo"
      >
        <form onSubmit={submitMirror} className="p-5 flex flex-col gap-4">
          <p className="text-sm text-[color:var(--text-secondary)]">
            {'Introduce el código de sala que aparece en la partida (menú Compartir) para ver el tablero en directo.'}
          </p>
          <input
            autoFocus
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            maxLength={4}
            value={mirrorCode}
            onChange={(e) => setMirrorCode(e.target.value.toUpperCase())}
            className="bg-[var(--bg-surface)] border border-[color:var(--accent-border)] rounded-[var(--radius)] px-3 py-2 text-white text-2xl text-center tracking-[0.4em] uppercase outline-none focus:border-[color:var(--accent-border-strong)] transition-colors"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            placeholder="ABCD"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setMirrorModalOpen(false)}>
              {'Cancelar'}
            </Button>
            <Button type="submit" variant="primary" disabled={mirrorCode.trim().length < 4} icon={Eye}>
              {'Ver'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
