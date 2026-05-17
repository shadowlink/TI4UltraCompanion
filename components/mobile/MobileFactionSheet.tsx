'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { getFactionSheet } from '@/data/factionSheets';
import MobileUnitCard from './MobileUnitCard';
import MobileTechSection from './MobileTechSection';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  factionIdx: number;
  /** playerIdx (0..nbPlayers-1) of this faction's seat in the game. */
  viewingPlayerIdx: number;
  /** playerIdx paired to this device, or -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileFactionSheet({
  factionIdx,
  viewingPlayerIdx,
  myPlayerIdx,
  sendCommand,
}: Props) {
  const lang = useGameStore((s) => s.lang);
  const sheet = getFactionSheet(factionIdx);
  const faction = FACTIONS[factionIdx];

  if (!sheet || !faction) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        {lang === 'es' ? 'Facción no encontrada' : 'Faction not found'}
      </div>
    );
  }

  const title = lang === 'es' ? sheet.titleEs : sheet.titleEn;
  const quote = lang === 'es' ? sheet.quoteEs : sheet.quoteEn;

  return (
    <div className="flex flex-col gap-4 p-3 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-orange-500/30">
        <div className="w-20 h-20 relative flex-shrink-0">
          <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className="text-lg text-orange-300 leading-tight"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {title}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {lang === 'es' ? faction.nameEs : faction.nameEn}
          </p>
        </div>
      </div>

      {!sheet.complete && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-center">
          <p className="text-sm text-yellow-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {lang === 'es' ? 'Datos pendientes' : 'Data pending'}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {lang === 'es'
              ? 'Aún no se han añadido los datos de esta facción.'
              : "This faction's data hasn't been added yet."}
          </p>
        </div>
      )}

      {/* Quote */}
      {quote && (
        <div className="rounded bg-black/40 border-l-2 border-orange-500/50 px-3 py-2">
          <p className="text-xs text-gray-300 italic leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
            {quote}
          </p>
          {sheet.quoteAuthor && (
            <p className="text-[11px] text-orange-300 mt-1 text-right">
              — {sheet.quoteAuthor}
            </p>
          )}
        </div>
      )}

      {/* Commodities */}
      {sheet.commodities > 0 && (
        <div className="flex items-center justify-between rounded border border-cyan-500/40 bg-cyan-500/10 px-4 py-2">
          <span
            className="text-xs text-cyan-300 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Exportaciones' : 'Commodities'}
          </span>
          <span
            className="text-3xl font-bold text-cyan-300"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {sheet.commodities}
          </span>
        </div>
      )}

      {/* Faction abilities */}
      {sheet.abilities.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Habilidades' : 'Abilities'}
          </h2>
          {sheet.abilities.map((ab, i) => (
            <div key={i} className="rounded border border-orange-500/30 bg-orange-500/5 p-3">
              <p
                className="text-sm text-orange-300 mb-1"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {lang === 'es' ? ab.nameEs : ab.nameEn}
              </p>
              <p className="text-xs text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {lang === 'es' ? ab.descriptionEs : ab.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Units */}
      {sheet.units.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Unidades' : 'Units'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {sheet.units.map((unit) => (
              <MobileUnitCard key={unit.type} unit={unit} />
            ))}
          </div>
        </div>
      )}

      {/* Technologies (collapsible) */}
      {viewingPlayerIdx >= 0 && (
        <MobileTechSection
          viewingPlayerIdx={viewingPlayerIdx}
          myPlayerIdx={myPlayerIdx}
          sendCommand={sendCommand}
        />
      )}
    </div>
  );
}
