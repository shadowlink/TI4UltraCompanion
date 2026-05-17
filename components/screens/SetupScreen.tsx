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

export default function SetupScreen() {
  const lang = useGameStore((s) => s.lang);
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

  // Clicking "Next": require names + speaker before advancing
  const handleNext = () => {
    if (!allNamed) return;
    if (speakerIdx === NO_PLAYER) {
      setPendingGalaxy(true);
      setShowSpeaker(true);
      return;
    }
    setStep('galaxy');
  };

  // After speaker is selected: if we were waiting to advance, proceed to galaxy
  const handleSpeakerChosen = () => {
    setShowSpeaker(false);
    if (pendingGalaxy) {
      setPendingGalaxy(false);
      setStep('galaxy');
    }
  };

  // Speaker guaranteed by handleNext at this point
  const handleStartGame = () => {
    clearSavedGame();
    startFirstRound();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {step === 'setup' ? (
        <div className="flex flex-col items-center py-8 px-4">
          <div className="w-full max-w-2xl flex justify-end mb-2">
            <button
              onClick={() => openModal('options')}
              className="text-gray-500 hover:text-orange-400 transition-colors text-sm flex items-center gap-1"
            >
              ⚙ {lang === 'es' ? 'Opciones' : 'Options'}
            </button>
          </div>

          <h1
            className="text-2xl md:text-3xl text-orange-400 text-shadow mb-6"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {lang === 'es' ? 'Configuración de Partida' : 'Game Setup'}
          </h1>

          {/* Player count slider */}
          <div className="mb-6 w-full max-w-md">
            <label className="text-sm text-gray-300 block mb-2">
              {nbPlayers} {lang === 'es' ? 'jugadores' : 'players'}
            </label>
            <input
              type="range"
              min={3}
              max={8}
              value={nbPlayers}
              onChange={(e) => setNbPlayers(Number(e.target.value))}
              className="w-full accent-orange-400"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
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
                  className="flex flex-col items-center gap-2 p-3 rounded border hover:bg-white/5 transition-all"
                  style={{ borderColor: colorValue, borderWidth: 2 }}
                >
                  <div className="w-16 h-16 relative">
                    <Image src={faction.iconPath} alt={faction.nameEn} fill className="object-contain" unoptimized />
                  </div>
                  {isSpeaker && <span className="text-xs text-yellow-400">👑 Speaker</span>}
                  {player.name && (
                    <span className="text-sm text-orange-300 text-shadow text-center leading-tight font-bold">
                      {player.name}
                    </span>
                  )}
                  <span className="text-xs text-white text-shadow text-center leading-tight">
                    {lang === 'es' ? faction.nameEs : faction.nameEn}
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
          <button
            onClick={() => setShowSpeaker(true)}
            className="mb-4 px-4 py-2 text-sm border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10 rounded transition-colors"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            👑 {lang === 'es' ? 'Seleccionar Portavoz' : 'Select Speaker'}
            {speakerIdx !== NO_PLAYER && (
              <span className="ml-2 text-white">— {FACTIONS[players[speakerIdx].faction].shortName}</span>
            )}
          </button>

          {/* Next */}
          {!allNamed && (
            <p className="text-sm text-red-400">
              {lang === 'es' ? 'Todos los jugadores necesitan un nombre' : 'All players need a name'}
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!allNamed}
            className={`px-8 py-3 text-lg border-2 rounded transition-all ${
              allNamed
                ? 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/30 text-orange-300'
                : 'border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Siguiente' : 'Next'} →
          </button>
        </div>
      ) : (
        <GalaxyScreen lang={lang} onStart={handleStartGame} />
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

function GalaxyScreen({ lang, onStart }: { lang: string; onStart: () => void }) {
  const [frame, setFrame] = useState(1);

  // Local animation — doesn't depend on game clock which hasn't started yet
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f % 7) + 1), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h2
        className="text-2xl text-orange-400 text-shadow mb-6"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {lang === 'es' ? 'Construyendo la Galaxia...' : 'Building the Galaxy...'}
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
      <button
        onClick={onStart}
        className="px-8 py-4 text-xl border-2 border-orange-500 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded transition-all"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {lang === 'es' ? '¡Comenzar la primera ronda!' : 'Start the First Round!'}
      </button>
    </div>
  );
}
