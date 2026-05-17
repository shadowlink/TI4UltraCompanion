'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';

interface FactionPickerModalProps {
  playerIdx: number;
  onClose: () => void;
}

export default function FactionPickerModal({ playerIdx, onClose }: FactionPickerModalProps) {
  const lang = useGameStore((s) => s.lang);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const setPlayerFaction = useGameStore((s) => s.setPlayerFaction);
  const setPlayerColor = useGameStore((s) => s.setPlayerColor);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const player = players[playerIdx];
  const [selectedFaction, setSelectedFaction] = useState(player.faction);
  const [selectedColor, setSelectedColor] = useState(player.color);
  const [name, setName] = useState(player.name);

  const activePlayers = players.slice(0, nbPlayers);

  const usedFactions = activePlayers
    .map((p, i) => (i !== playerIdx ? p.faction : -1))
    .filter((f) => f >= 0);

  const usedColors = activePlayers
    .map((p, i) => (i !== playerIdx ? p.color : -1))
    .filter((c) => c >= 0);

  const handleConfirm = () => {
    setPlayerFaction(playerIdx, selectedFaction);
    setPlayerColor(playerIdx, selectedColor);
    setPlayerName(playerIdx, name);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="bg-gray-900 border border-orange-500/50 rounded-lg p-4 w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2
          className="text-lg text-orange-400 text-center mb-3 text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {lang === 'es' ? `Jugador ${playerIdx + 1}` : `Player ${playerIdx + 1}`}
        </h2>

        {/* Player name */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">{lang === 'es' ? 'Nombre' : 'Name'}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === 'es' ? 'Nombre del jugador' : 'Player name'}
            className="w-full max-w-xs px-3 py-2 bg-black/40 border border-gray-600 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          />
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">{lang === 'es' ? 'Color' : 'Color'}</p>
          <div className="flex gap-2 flex-wrap">
            {PLAYER_COLORS.map((colorName, i) => {
              const isUsed = usedColors.includes(i);
              return (
                <button
                  key={colorName}
                  onClick={() => !isUsed && setSelectedColor(i)}
                  disabled={isUsed}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    isUsed ? 'opacity-20 cursor-not-allowed' : ''
                  }`}
                  style={{
                    backgroundColor: PLAYER_COLOR_VALUES[colorName],
                    borderColor: selectedColor === i ? 'white' : 'transparent',
                    transform: selectedColor === i ? 'scale(1.2)' : 'scale(1)',
                  }}
                  title={colorName}
                />
              );
            })}
          </div>
        </div>

        {/* Faction list */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">{lang === 'es' ? 'Facción' : 'Faction'}</p>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {FACTIONS.map((faction, i) => {
              const isUsed = usedFactions.includes(i);
              const isSelected = selectedFaction === i;
              return (
                <button
                  key={i}
                  onClick={() => !isUsed && setSelectedFaction(i)}
                  disabled={isUsed}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded border transition-all ${
                    isSelected
                      ? 'border-orange-400 bg-orange-500/20'
                      : isUsed
                      ? 'border-gray-700/30 opacity-30 cursor-not-allowed'
                      : 'border-gray-600 hover:border-orange-500/50 hover:bg-white/5'
                  }`}
                >
                  <div className="w-12 h-12 relative">
                    <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-xs text-white text-shadow leading-tight text-center">
                    {lang === 'es' ? faction.nameEs : faction.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded transition-colors"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className={`px-4 py-2 border rounded transition-colors ${
              name.trim()
                ? 'bg-orange-500/20 hover:bg-orange-500/40 border-orange-500 text-orange-300'
                : 'border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Confirmar' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
