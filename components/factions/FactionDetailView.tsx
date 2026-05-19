'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { getFactionSheet, TECH_COLOR_HEX } from '@/data/factionSheets';
import { FACTION_TECHNOLOGIES, getPrereqs } from '@/data/technologies';
import MobileUnitCard from '@/components/mobile/MobileUnitCard';
import { FACTION_ART_BY_IDX } from '@/data/factionExtras';

interface Props {
  factionIdx: number;
}

const EXPANSION_LABEL: Record<number, { label: string; color: string }> = {};
for (let i = 0; i <= 16; i++) EXPANSION_LABEL[i] = { label: 'BASE', color: '#9ca3af' };
for (let i = 17; i <= 23; i++) EXPANSION_LABEL[i] = { label: 'POK', color: '#a78bfa' };
EXPANSION_LABEL[24] = { label: 'CODEX', color: '#34d399' };

function getExpansion(idx: number) {
  return EXPANSION_LABEL[idx] ?? { label: 'DS', color: '#fb923c' };
}

export default function FactionDetailView({ factionIdx }: Props) {
  const sheet = getFactionSheet(factionIdx);
  const faction = FACTIONS[factionIdx];
  const exp = getExpansion(factionIdx);
  const factionTechs = FACTION_TECHNOLOGIES.filter((t) => t.factionIdx === factionIdx);

  if (!sheet || !faction) {
    return (
      <div className="p-8 text-center text-gray-500">
        {'Facción no encontrada'}
      </div>
    );
  }

  const title = sheet.titleEs;
  const quote = sheet.quoteEs;
  const shortLore = sheet.loreEs;
  const longLore = sheet.longLoreEs;
  const artPath = FACTION_ART_BY_IDX[factionIdx];

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col gap-7">
      {/* Header */}
      <header className="flex items-center gap-6 pb-5 border-b border-orange-500/30">
        <div className="w-36 h-36 relative flex-shrink-0">
          <Image
            src={faction.iconPath}
            alt={faction.shortName}
            fill
            className="object-contain drop-shadow-[0_0_14px_rgba(255,165,0,0.55)]"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-4xl md:text-5xl text-orange-300 leading-tight"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {title}
            </h1>
            <span
              className="text-xs px-2.5 py-1 rounded uppercase tracking-wider border"
              style={{ borderColor: exp.color, color: exp.color, fontFamily: 'var(--font-aldrich)' }}
            >
              {exp.label}
            </span>
          </div>
          <p className="text-lg text-gray-400 mt-2" style={{ fontFamily: 'var(--font-electrolize)' }}>
            {faction.nameEs}
          </p>
        </div>
        {artPath && (
          <div className="relative w-[120px] h-40 flex-shrink-0 rounded-xl overflow-hidden border border-orange-500/30 bg-black/40">
            <Image
              src={artPath}
              alt={faction.shortName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </header>

      {!sheet.complete && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-center">
          <p className="text-sm text-yellow-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {'Datos pendientes'}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {'Aún no se han añadido los datos de esta facción.'}
          </p>
        </div>
      )}

      {/* Quote + short lore */}
      {quote && (
        <div className="rounded bg-black/40 border-l-4 border-orange-500/60 px-5 py-4">
          <p className="text-xl text-gray-200 italic leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
            «{quote}»
          </p>
          {sheet.quoteAuthor && (
            <p className="text-base text-orange-300 mt-2 text-right">— {sheet.quoteAuthor}</p>
          )}
          {shortLore && (
            <p
              className="text-base text-gray-300 leading-relaxed mt-3 pt-3 border-t border-orange-500/20"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {shortLore}
            </p>
          )}
        </div>
      )}

      {/* Long lore (Historia) */}
      {longLore && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Historia'}
          </h2>
          <div
            className="rounded border border-orange-500/20 bg-black/30 px-5 py-4 text-base text-gray-300 leading-relaxed whitespace-pre-line"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {longLore}
          </div>
        </section>
      )}

      {/* Home system info */}
      {sheet.homeSystemInfo && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Sistema natal'}
          </h2>
          <div className="rounded border border-gray-700/50 bg-gray-900/30 px-5 py-4">
            <p
              className="text-xl text-gray-200 mb-3"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {sheet.homeSystemInfo.nameEs}
            </p>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 text-base">
              {sheet.homeSystemInfo.attributes.map((a, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <dt
                    className="text-gray-500 uppercase tracking-wider text-xs"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {a.keyEs}
                  </dt>
                  <dd className="text-gray-200" style={{ fontFamily: 'var(--font-electrolize)' }}>
                    {a.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Abilities */}
      {sheet.abilities.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Habilidades de facción'}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {sheet.abilities.map((ab, i) => (
              <div key={i} className="rounded border border-orange-500/30 bg-orange-500/5 p-4">
                <p className="text-lg text-orange-300 mb-2" style={{ fontFamily: 'var(--font-audiowide)' }}>
                  {ab.nameEs}
                </p>
                <p className="text-base text-gray-200 leading-relaxed" style={{ fontFamily: 'var(--font-electrolize)' }}>
                  {ab.descriptionEs}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Commodities + starting fleet + starting techs */}
      {(sheet.commodities > 0 || sheet.startingFleet?.length || sheet.startingTechs?.length) && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sheet.commodities > 0 && (
            <div className="rounded border-2 border-cyan-500/40 bg-cyan-500/5 p-4 flex flex-col items-center justify-center">
              <span
                className="text-sm text-cyan-300 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Exportaciones máx.'}
              </span>
              <span
                className="text-6xl font-bold text-cyan-300 mt-2"
                style={{ fontFamily: 'var(--font-share-tech-mono)' }}
              >
                {sheet.commodities}
              </span>
            </div>
          )}
          {sheet.startingFleet && sheet.startingFleet.length > 0 && (
            <div className="rounded border border-blue-500/30 bg-blue-500/5 p-4">
              <p
                className="text-sm text-blue-300 uppercase tracking-wider mb-3"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Flota inicial'}
              </p>
              <ul className="text-base text-gray-200 space-y-1" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {sheet.startingFleet.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {sheet.startingTechs && sheet.startingTechs.length > 0 && (
            <div className="rounded border border-purple-500/30 bg-purple-500/5 p-4">
              <p
                className="text-sm text-purple-300 uppercase tracking-wider mb-3"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Tecnologías iniciales'}
              </p>
              <ul className="text-base text-gray-200 space-y-1" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {sheet.startingTechs.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Units */}
      {sheet.units.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Unidades'}
          </h2>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {sheet.units.map((unit) => (
              <MobileUnitCard key={unit.type} unit={unit} size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Leaders */}
      {sheet.leaders && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Líderes'}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {([
              ['agent', '#34d399', 'AGENTE'],
              ['commander', '#60a5fa', 'COMANDANTE'],
              ['hero', '#fbbf24', 'HÉROE'],
            ] as const).map(([key, color, label]) => {
              const ldr = sheet.leaders![key];
              return (
                <div
                  key={key}
                  className="rounded border p-4 flex flex-col"
                  style={{ borderColor: `${color}66`, background: `${color}10` }}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <p className="text-lg text-white" style={{ fontFamily: 'var(--font-audiowide)' }}>
                      {ldr.nameEs}
                    </p>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color, fontFamily: 'var(--font-aldrich)' }}
                    >
                      {label}
                    </span>
                  </div>
                  {(ldr.unlockEs) && (
                    <p className="text-sm text-gray-400 italic mb-3">
                      🔒 {ldr.unlockEs}
                    </p>
                  )}
                  <p className="text-base text-gray-200 leading-relaxed" style={{ fontFamily: 'var(--font-electrolize)' }}>
                    {ldr.abilityEs}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Promissory note */}
      {sheet.promissoryNote && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Favores'}
          </h2>
          <div className="rounded border border-pink-500/40 bg-pink-500/5 p-4">
            <p className="text-xl text-pink-300 mb-2" style={{ fontFamily: 'var(--font-audiowide)' }}>
              {sheet.promissoryNote.nameEs}
            </p>
            <p className="text-base text-gray-200 leading-relaxed" style={{ fontFamily: 'var(--font-electrolize)' }}>
              {sheet.promissoryNote.descriptionEs}
            </p>
          </div>
        </section>
      )}

      {/* Faction technologies */}
      {factionTechs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm text-orange-300 uppercase tracking-wider px-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Tecnologías propias'}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {factionTechs.map((tech) => {
              const isUpgrade = tech.category === 'unitUpgrade';
              const prereqs = getPrereqs(tech);
              const colorHex = TECH_COLOR_HEX[tech.color];
              return (
                <div
                  key={tech.id}
                  className="rounded border p-4"
                  style={{
                    borderColor: `${colorHex}66`,
                    background: `linear-gradient(135deg, ${colorHex}15 0%, rgba(0,0,0,0.4) 100%)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs font-bold text-white px-2 py-0.5 rounded leading-none uppercase"
                      style={{ background: colorHex, fontFamily: 'var(--font-share-tech-mono)' }}
                    >
                      {isUpgrade ? ('Mejora') : `L${tech.level}`}
                    </span>
                    <span
                      className="text-[10px] font-bold text-amber-200 border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded leading-none uppercase"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                      title={'Tecnología de facción'}
                    >
                      ◆ {'Facción'}
                    </span>
                    <p className="text-lg text-white flex-1" style={{ fontFamily: 'var(--font-audiowide)' }}>
                      {tech.nameEs}
                    </p>
                    {prereqs.length > 0 && (
                      <div className="flex gap-1">
                        {prereqs.map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border"
                            style={{
                              background: TECH_COLOR_HEX[c],
                              borderColor: 'rgba(0,0,0,0.6)',
                              boxShadow: `0 0 4px ${TECH_COLOR_HEX[c]}80`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-base text-gray-200 leading-relaxed" style={{ fontFamily: 'var(--font-electrolize)' }}>
                    {tech.effectEs}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
