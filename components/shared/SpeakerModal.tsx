'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLOR_VALUES, PLAYER_COLORS } from '@/data/factions';

interface SpeakerModalProps {
  onClose?: () => void;
}

export default function SpeakerModal({ onClose }: SpeakerModalProps) {
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const lang = useGameStore((s) => s.lang);
  const setSpeaker = useGameStore((s) => s.setSpeaker);
  const closeModal = useGameStore((s) => s.closeModal);

  const handleSelect = (idx: number) => {
    setSpeaker(idx);
    closeModal();
    onClose?.();
  };

  const handleRandom = () => {
    const idx = Math.floor(Math.random() * nbPlayers);
    handleSelect(idx);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="bg-gray-900 border border-orange-500/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h2
          className="text-xl text-center text-orange-400 mb-4 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {lang === 'es' ? 'Selecciona el Portavoz' : 'Select the Speaker'}
        </h2>

        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {players.slice(0, nbPlayers).map((player, i) => {
            const faction = FACTIONS[player.faction];
            const colorValue = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="flex flex-col items-center gap-1 p-2 rounded border hover:bg-white/10 transition-colors"
                style={{ borderColor: colorValue }}
              >
                <div className="w-12 h-12 relative">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
                <span className="text-xs text-white text-shadow">{faction.shortName} ({player.name})</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRandom}
            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 text-orange-300 rounded transition-colors"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Aleatorio' : 'Random'}
          </button>
        </div>
      </div>
    </div>
  );
}
