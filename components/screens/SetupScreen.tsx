'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER } from '@/lib/constants';
import { clearSavedGame } from '@/lib/persistence';
import FactionPickerModal from '@/components/shared/FactionPickerModal';
import SpeakerModal from '@/components/shared/SpeakerModal';
import OptionsPanel from '@/components/shared/OptionsPanel';
import Button from '@/components/ui/Button';
import { Crown, Settings, ArrowRight, AlertTriangle, Rocket } from '@/components/ui/icons';

export default function SetupScreen() {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const setNbPlayers = useGameStore((s) => s.setNbPlayers);
  const startFirstRound = useGameStore((s) => s.startFirstRound);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const activeModal = useGameStore((s) => s.activeModal);
  const openModal = useGameStore((s) => s.openModal);

  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [showSpeaker, setShowSpeaker] = useState(false);
  const [pendingGalaxy, setPendingGalaxy] = useState(false);
  const [step, setStep] = useState<'setup' | 'galaxy'>('setup');

  const allNamed = players.slice(0, nbPlayers).every((p) => p.name.trim());

  const handleNext = () => {
    if (!allNamed) return;
    if (speakerIdx === NO_PLAYER) {
      setPendingGalaxy(true);
      setShowSpeaker(true);
      return;
    }
    setStep('galaxy');
  };

  const handleSpeakerChosen = () => {
    setShowSpeaker(false);
    if (pendingGalaxy) {
      setPendingGalaxy(false);
      setStep('galaxy');
    }
  };

  const handleStartGame = () => {
    clearSavedGame();
    startFirstRound();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {step === 'setup' ? (
        <div className="flex flex-col items-center py-8 px-4">
          <div className="w-full max-w-2xl flex justify-end mb-2">
            <Button onClick={() => openModal('options')} variant="ghost" size="sm" icon={Settings}>
              {'Opciones'}
            </Button>
          </div>

          <h1
            className="text-2xl md:text-3xl text-[color:var(--accent-soft)] text-shadow mb-6"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {'Configuración de Partida'}
          </h1>

          {/* Player count slider */}
          <div className="mb-6 w-full max-w-md">
            <label className="text-sm text-[color:var(--text-secondary)] block mb-2">
              {nbPlayers} {'jugadores'}
            </label>
            <input
              type="range"
              min={3}
              max={8}
              value={nbPlayers}
              onChange={(e) => setNbPlayers(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="flex justify-between text-xs text-[color:var(--text-muted)] mt-1">
              {[3, 4, 5, 6, 7, 8].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          {/* Player grid */}
          <div
            className="grid gap-3 mb-8 w-full max-w-2xl"
            style={{ gridTemplateColumns: `repeat(${Math.min(nbPlayers, 4)}, 1fr)` }}
          >
            {players.slice(0, nbPlayers).map((player, i) => {
              const faction = FACTIONS[player.faction];
              const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isSpeaker = speakerIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setEditingPlayer(i)}
                  className="flex flex-col items-center gap-2 p-3 rounded-[var(--radius)] border-2 hover:bg-white/5 transition-all pointer-events-auto"
                  style={{ borderColor: colorValue }}
                >
                  <div className="w-16 h-16 relative">
                    <Image src={faction.iconPath} alt={faction.nameEn} fill className="object-contain" unoptimized />
                  </div>
                  {isSpeaker && (
                    <span className="inline-flex items-center gap-1 text-xs text-[color:var(--warning)]">
                      <Crown size={12} strokeWidth={2} aria-hidden />
                      {'Speaker'}
                    </span>
                  )}
                  {player.name && (
                    <span className="text-sm text-[color:var(--accent-soft)] text-shadow text-center leading-tight font-bold">
                      {player.name}
                    </span>
                  )}
                  <span className="text-xs text-white text-shadow text-center leading-tight">
                    {faction.nameEs}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: colorValue }}
                  />
                </button>
              );
            })}
          </div>

          {/* Speaker button */}
          <Button
            onClick={() => setShowSpeaker(true)}
            variant="warning"
            size="md"
            icon={Crown}
            className="mb-4"
          >
            {'Seleccionar Portavoz'}
            {speakerIdx !== NO_PLAYER && (
              <span className="ml-2 text-white normal-case">— {FACTIONS[players[speakerIdx].faction].shortName}</span>
            )}
          </Button>

          {/* Next */}
          {!allNamed && (
            <p className="flex items-center gap-1.5 text-sm text-[color:var(--danger)] mb-3">
              <AlertTriangle size={14} strokeWidth={2} aria-hidden />
              {'Todos los jugadores necesitan un nombre'}
            </p>
          )}
          <Button
            onClick={handleNext}
            disabled={!allNamed}
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            {'Siguiente'}
          </Button>
        </div>
      ) : (
        <GalaxyScreen onStart={handleStartGame} />
      )}

      {/* Modals — always in the tree regardless of step */}
      {editingPlayer !== null && (
        <FactionPickerModal playerIdx={editingPlayer} onClose={() => setEditingPlayer(null)} />
      )}
      {showSpeaker && (
        <SpeakerModal onClose={handleSpeakerChosen} />
      )}
      {activeModal === 'options' && <OptionsPanel />}
    </div>
  );
}

// ─── Galaxy screen ─────────────────────────────────────────────────────────────

function GalaxyScreen({ onStart }: { onStart: () => void }) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f % 7) + 1), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h2
        className="text-2xl text-[color:var(--accent-soft)] text-shadow mb-6"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {'Construyendo la Galaxia...'}
      </h2>
      <div className="relative w-64 h-64 mb-8">
        <Image
          src={`/ti4-img/g${frame}.png`}
          alt="Galaxy"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <Button onClick={onStart} variant="primary" size="lg" icon={Rocket}>
        {'¡Comenzar la primera ronda!'}
      </Button>
    </div>
  );
}
