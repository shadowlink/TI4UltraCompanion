'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, isAllowedFaction } from '@/data/factions';
import { getFactionSheet } from '@/data/factionSheets';

interface Props {
  onSelect: (idx: number) => void;
}

const EXPANSIONS: Record<number, { es: string; en: string; color: string }> = {
  // Base game: 0-16
  // PoK: 17-23
  // Codex Keleres: 24
  // Discordant Stars: 25+
};
for (let i = 0; i <= 16; i++) EXPANSIONS[i] = { es: 'BASE', en: 'BASE', color: '#9ca3af' };
for (let i = 17; i <= 23; i++) EXPANSIONS[i] = { es: 'POK', en: 'POK', color: '#a78bfa' };
EXPANSIONS[24] = { es: 'CODEX', en: 'CODEX', color: '#34d399' };

function expansionLabel(idx: number) {
  if (idx in EXPANSIONS) return EXPANSIONS[idx];
  return { es: 'DS', color: '#fb923c' };
}

export default function FactionGrid({ onSelect }: Props) {

  return (
    <div className="p-6">
      <p
        className="text-sm text-gray-400 mb-4 text-center max-w-2xl mx-auto"
        style={{ fontFamily: 'var(--font-electrolize)' }}
      >
        {'Pulsa cualquier facción para consultar su ficha completa: cita, lore, habilidades, unidades, mecas, líderes, favores y tecnologías propias.'}
      </p>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
      >
        {FACTIONS.map((faction, idx) => {
          if (!isAllowedFaction(idx)) return null;
          const sheet = getFactionSheet(idx);
          const isComplete = sheet?.complete ?? false;
          const quote = sheet?.quoteEs;
          const exp = expansionLabel(idx);
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-black/40 hover:from-orange-500/15 hover:to-black/60 hover:border-orange-400 transition-all text-left ${
                isComplete ? '' : 'opacity-60'
              }`}
              style={{ minHeight: '220px' }}
            >
              <span
                className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider border"
                style={{ borderColor: exp.color, color: exp.color, fontFamily: 'var(--font-aldrich)' }}
              >
                {exp.es}
              </span>
              <div className="w-20 h-20 relative flex-shrink-0 mt-2">
                <Image
                  src={faction.iconPath}
                  alt={faction.shortName}
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(255,165,0,0.4)]"
                  unoptimized
                />
              </div>
              <span
                className="text-sm text-orange-300 text-center leading-tight"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {faction.nameEs}
              </span>
              {quote && (
                <p
                  className="text-[11px] text-gray-400 italic text-center leading-snug line-clamp-3 mt-1"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  «{quote}»
                </p>
              )}
              {!isComplete && (
                <span className="text-[10px] text-yellow-400/80 mt-auto">
                  {'Datos pendientes'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
