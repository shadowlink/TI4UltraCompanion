'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import type { MobileCommand } from '@/lib/sync/types';

const CHECKLIST_ITEMS_ES = [
  'Marcar objetivos públicos',
  'Revelar objetivo público',
  'Sacar cartas de Acción',
  'Sacar fichas de comando',
  'Recargar planetas',
  'Reparar unidades',
  'Devolver cartas de Estrategia',
  'Comprobar fin de partida',
];

const CHECKLIST_ITEMS_EN = [
  'Score public objectives',
  'Reveal public objective',
  'Draw action cards',
  'Gain command tokens',
  'Refresh planets',
  'Repair units',
  'Return strategy cards',
  'Check end of game',
];

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileStatusPhase({ myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const vpGoal = useGameStore((s) => s.options.vpWinGoal);
  const statusStep = useGameStore((s) => s.statusStep);
  const [showChecklist, setShowChecklist] = useState(false);
  const [busy, setBusy] = useState(false);

  const items = CHECKLIST_ITEMS_ES;

  const adjustVP = async (delta: 1 | -1) => {
    if (busy) return;
    setBusy(true);
    await sendCommand({ type: 'incrementVP', delta });
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      {statusStep === 1 && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-center">
          <p className="text-sm text-yellow-300" style={{ fontFamily: 'var(--font-audiowide)' }}>Mecatol Rex</p>
          <p className="text-xs text-gray-400 mt-1">
            {'Eligiendo bonus de objetivo'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider px-1">
          {'Puntos de Victoria'}
        </p>
        {players.slice(0, nbPlayers)
          .map((p, i) => ({ p, i }))
          .sort((a, b) => b.p.vp - a.p.vp)
          .map(({ p, i }) => {
            const faction = FACTIONS[p.faction];
            const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[p.color]];
            const isMe = i === myPlayerIdx;
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1.5 rounded border bg-gray-900/40"
                style={{ borderColor: color }}
              >
                <div className="w-8 h-8 relative flex-shrink-0">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate" style={{ color }}>
                    {faction.shortName}{p.name ? ` (${p.name})` : ''}
                    {isMe && <span className="ml-1 text-[10px] text-orange-300">★</span>}
                  </p>
                </div>
                {isMe ? (
                  <div className="flex items-center gap-1 pointer-events-auto">
                    <button
                      onClick={() => adjustVP(-1)}
                      disabled={busy || p.vp <= 0}
                      className="w-8 h-8 rounded border border-red-500/60 bg-red-500/15 text-red-200 text-lg leading-none active:bg-red-500/30 disabled:opacity-30"
                    >
                      −
                    </button>
                    <span
                      className={`text-2xl font-bold min-w-[28px] text-center ${p.vp >= vpGoal ? 'text-yellow-400' : 'text-white'}`}
                      style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                    >
                      {p.vp}
                    </span>
                    <button
                      onClick={() => adjustVP(1)}
                      disabled={busy}
                      className="w-8 h-8 rounded border border-green-500/60 bg-green-500/15 text-green-200 text-lg leading-none active:bg-green-500/30 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-2xl font-bold ${p.vp >= vpGoal ? 'text-yellow-400' : 'text-white'}`}
                    style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {p.vp}
                    <span className="text-xs text-gray-500">/{vpGoal}</span>
                  </span>
                )}
              </div>
            );
          })}
      </div>

      <button
        onClick={() => setShowChecklist((s) => !s)}
        className="text-xs text-gray-400 underline self-start pointer-events-auto"
      >
        {showChecklist
          ? 'Ocultar checklist ▲'
          : 'Ver checklist de fase ▼'}
      </button>
      {showChecklist && (
        <ul className="text-xs text-gray-300 space-y-1 pl-3">
          {items.map((item, idx) => (
            <li key={idx} className="list-disc list-outside">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
