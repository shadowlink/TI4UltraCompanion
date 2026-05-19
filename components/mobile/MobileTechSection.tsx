'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TECH_COLOR_HEX, type TechColor } from '@/data/factionSheets';
import {
  FACTION_TECHNOLOGIES,
  canResearch,
  getAvailableTechsForFaction,
  getTechsByColorForFaction,
  type Technology,
} from '@/data/technologies';
import { FACTIONS } from '@/data/factions';
import type { MobileCommand } from '@/lib/sync/types';
import MobileTechDetailsModal from './MobileTechDetailsModal';

const NEKRO_FACTION_IDX = 10;

interface Props {
  /** playerIdx of the faction whose sheet is currently shown. */
  viewingPlayerIdx: number;
  /** playerIdx of this device's paired player; -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

const COLOR_ORDER: TechColor[] = ['green', 'blue', 'yellow', 'red'];
const COLOR_LABELS: Record<TechColor, { es: string; en: string }> = {
  green: { es: 'Biótica', en: 'Biotic' },
  blue: { es: 'Propulsión', en: 'Propulsion' },
  yellow: { es: 'Cibernética', en: 'Cybernetic' },
  red: { es: 'Guerra', en: 'Warfare' },
};

export default function MobileTechSection({ viewingPlayerIdx, myPlayerIdx, sendCommand }: Props) {
  const lang = useGameStore((s) => s.lang);
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const exhaustedTechs = useGameStore((s) => s.exhaustedTechs);
  const players = useGameStore((s) => s.players);
  const [expanded, setExpanded] = useState(false);
  const [openTech, setOpenTech] = useState<Technology | null>(null);

  const nekroAssimilated = useGameStore((s) => s.nekroAssimilated);
  const myResearched = researchedTechs[viewingPlayerIdx] ?? [];
  const myExhausted = exhaustedTechs[viewingPlayerIdx] ?? [];
  const myAssimilated = nekroAssimilated[viewingPlayerIdx] ?? [];
  const viewingFactionIdx =
    viewingPlayerIdx >= 0 ? players[viewingPlayerIdx]?.faction ?? null : null;
  const isNekro = viewingFactionIdx === NEKRO_FACTION_IDX;
  // Counter only reflects basic techs (unit upgrades are handled from the unit cards)
  const basicTechsAll = getAvailableTechsForFaction(viewingFactionIdx).filter(
    (t) => t.category !== 'unitUpgrade',
  );
  const totalCount = basicTechsAll.length;
  const researchedBasicCount = myResearched.filter((id) => {
    const t = basicTechsAll.find((x) => x.id === id);
    return t !== undefined;
  }).length;
  const canToggle = viewingPlayerIdx >= 0 && viewingPlayerIdx === myPlayerIdx;

  return (
    <>
      <div className="flex flex-col">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center justify-between gap-2 px-3 py-2 border-y border-orange-500/30 bg-orange-500/5 pointer-events-auto"
        >
          <span
            className="text-sm text-orange-300 flex-shrink-0"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {expanded ? '▼' : '▶'} {lang === 'es' ? 'Tecnologías' : 'Technologies'}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {canToggle && myExhausted.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  sendCommand({ type: 'readyAllMyTechs' });
                }}
                role="button"
                className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/60 bg-yellow-500/15 text-yellow-200 active:bg-yellow-500/30"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                ↻ {lang === 'es' ? `Enderezar (${myExhausted.length})` : `Ready (${myExhausted.length})`}
              </span>
            )}
            <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              {researchedBasicCount} / {totalCount}
            </span>
          </div>
        </button>

        {expanded && isNekro && (
          <NekroAssimilatorPanel
            viewingPlayerIdx={viewingPlayerIdx}
            canToggle={canToggle}
            players={players}
            myResearched={myResearched}
            myExhausted={myExhausted}
            myAssimilated={myAssimilated}
            sendCommand={sendCommand}
            setOpenTech={setOpenTech}
            lang={lang}
          />
        )}

        {expanded && !isNekro && (
          <div className="flex flex-col gap-3 px-2 py-3">
            {COLOR_ORDER.map((color) => {
              const colorHex = TECH_COLOR_HEX[color];
              const techs = getTechsByColorForFaction(color, viewingFactionIdx).sort(
                (a, b) => a.level - b.level,
              );
              const researchedInColor = techs.filter((t) => myResearched.includes(t.id)).length;
              return (
                <div key={color} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <span
                      className="w-3 h-3 rounded-full border border-black/60"
                      style={{ background: colorHex, boxShadow: `0 0 6px ${colorHex}90` }}
                    />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: colorHex, fontFamily: 'var(--font-aldrich)' }}
                    >
                      {COLOR_LABELS[color][lang]}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto">
                      {researchedInColor} / {techs.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {techs.map((tech) => {
                      const isResearched = myResearched.includes(tech.id);
                      const isExhausted = isResearched && myExhausted.includes(tech.id);
                      const isResearchable = !isResearched && canResearch(myResearched, tech);
                      return (
                        <button
                          key={tech.id}
                          onClick={() => setOpenTech(tech)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-left pointer-events-auto active:scale-[0.98] ${
                            isResearched
                              ? isExhausted
                                ? 'opacity-55'
                                : ''
                              : isResearchable
                              ? 'opacity-100'
                              : 'opacity-50'
                          }`}
                          style={{
                            borderColor: isResearched
                              ? isExhausted
                                ? `${colorHex}66`
                                : colorHex
                              : isResearchable
                              ? `${colorHex}99`
                              : 'rgba(75,85,99,0.4)',
                            background: isResearched
                              ? isExhausted
                                ? `linear-gradient(90deg, ${colorHex}15 0%, rgba(0,0,0,0.5) 100%)`
                                : `linear-gradient(90deg, ${colorHex}30 0%, ${colorHex}08 100%)`
                              : isResearchable
                              ? `linear-gradient(90deg, ${colorHex}12 0%, rgba(0,0,0,0.4) 100%)`
                              : 'rgba(0,0,0,0.35)',
                          }}
                        >
                          <span
                            className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded leading-none"
                            style={{ background: colorHex, fontFamily: 'var(--font-share-tech-mono)' }}
                          >
                            L{tech.level}
                          </span>
                          <span
                            className={`flex-1 text-xs leading-tight truncate ${
                              isExhausted ? 'text-gray-400 italic' : 'text-white'
                            }`}
                            style={{ fontFamily: 'var(--font-electrolize)' }}
                          >
                            {lang === 'es' ? tech.nameEs : tech.nameEn}
                          </span>
                          {tech.factionIdx !== undefined && (
                            <span
                              className="text-[9px] text-amber-200 border border-amber-400/60 bg-amber-500/10 px-1 rounded leading-none"
                              title={lang === 'es' ? 'Tecnología de facción' : 'Faction technology'}
                            >
                              ◆ {lang === 'es' ? 'FACCIÓN' : 'FACTION'}
                            </span>
                          )}
                          {tech.expansion === 'pok' && (
                            <span className="text-[9px] text-purple-300 border border-purple-500/40 px-1 rounded leading-none">
                              PoK
                            </span>
                          )}
                          {isExhausted && (
                            <span
                              className="text-[10px] text-yellow-400 leading-none"
                              title={lang === 'es' ? 'Agotada' : 'Exhausted'}
                            >
                              ⌀
                            </span>
                          )}
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                              isResearched ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'
                            }`}
                          >
                            {isResearched ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!canToggle && (
              <p className="text-[10px] text-gray-500 italic text-center mt-1">
                {lang === 'es'
                  ? 'Solo el jugador emparejado con esta facción puede modificar el estado.'
                  : 'Only the device paired with this faction can change research state.'}
              </p>
            )}
          </div>
        )}
      </div>

      {openTech && (
        <MobileTechDetailsModal
          tech={openTech}
          canToggle={canToggle}
          researchedIds={myResearched}
          exhaustedIds={myExhausted}
          sendCommand={sendCommand}
          onClose={() => setOpenTech(null)}
        />
      )}
    </>
  );
}

// ─── Nekro Virus — Valefar Assimilator panel ──────────────────────────────────

interface NekroPanelProps {
  viewingPlayerIdx: number;
  canToggle: boolean;
  players: { faction: number }[];
  myResearched: string[];
  myExhausted: string[];
  myAssimilated: string[];
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
  setOpenTech: (t: Technology | null) => void;
  lang: 'es' | 'en';
}

function NekroAssimilatorPanel({
  viewingPlayerIdx: _viewingPlayerIdx,
  canToggle,
  players,
  myExhausted,
  myAssimilated,
  sendCommand,
  setOpenTech,
  lang,
}: NekroPanelProps) {
  void _viewingPlayerIdx;
  // Factions of all OTHER players currently in the game (excluding Nekro itself).
  const otherFactionIdxs = new Set<number>();
  for (const p of players) {
    if (p.faction !== NEKRO_FACTION_IDX && p.faction >= 0) otherFactionIdxs.add(p.faction);
  }
  // All faction-specific techs whose owner is in the game.
  const availableTechs = FACTION_TECHNOLOGIES.filter(
    (t) => t.factionIdx !== undefined && otherFactionIdxs.has(t.factionIdx),
  );

  const slots: Array<{ label: string; tech: Technology | null }> = [
    { label: 'X', tech: myAssimilated[0] ? FACTION_TECHNOLOGIES.find((t) => t.id === myAssimilated[0]) ?? null : null },
    { label: 'Y', tech: myAssimilated[1] ? FACTION_TECHNOLOGIES.find((t) => t.id === myAssimilated[1]) ?? null : null },
  ];
  const slotsFull = myAssimilated.length >= 2;

  const onTapTech = async (tech: Technology) => {
    if (!canToggle) {
      setOpenTech(tech);
      return;
    }
    if (myAssimilated.includes(tech.id)) {
      await sendCommand({ type: 'unassimilateTech', techId: tech.id });
      return;
    }
    if (slotsFull) {
      setOpenTech(tech);
      return;
    }
    await sendCommand({ type: 'assimilateTech', techId: tech.id });
  };

  const onClearSlot = async (techId: string) => {
    if (!canToggle) return;
    await sendCommand({ type: 'unassimilateTech', techId });
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-3">
      {/* Assimilator slots */}
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.label}
            className="rounded-lg border-2 border-fuchsia-500/60 bg-gradient-to-b from-fuchsia-900/30 to-black/60 p-2 flex flex-col gap-1"
          >
            <span
              className="text-[10px] uppercase tracking-wider text-fuchsia-300 leading-none"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              ◇ Asimilador Valefar {slot.label}
            </span>
            {slot.tech ? (
              <button
                type="button"
                onClick={() => setOpenTech(slot.tech!)}
                className="text-left text-sm text-white leading-tight pointer-events-auto active:scale-[0.98]"
                style={{ fontFamily: 'var(--font-electrolize)' }}
              >
                {lang === 'es' ? slot.tech.nameEs : slot.tech.nameEn}
              </button>
            ) : (
              <span className="text-xs text-gray-500 italic">
                {lang === 'es' ? 'Vacío' : 'Empty'}
              </span>
            )}
            {slot.tech && canToggle && (
              <button
                type="button"
                onClick={() => onClearSlot(slot.tech!.id)}
                className="text-[10px] px-2 py-0.5 rounded border border-red-500/60 bg-red-500/15 text-red-200 active:bg-red-500/30 pointer-events-auto self-start"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                ✕ {lang === 'es' ? 'Liberar' : 'Release'}
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-fuchsia-200/80 italic px-1">
        {lang === 'es'
          ? 'Nekro no investiga tecnologías: asimila hasta 2 tecnologías específicas del resto de jugadores.'
          : 'Nekro does not research: it assimilates up to 2 faction-specific technologies from other players.'}
      </p>

      {/* List of assimilable techs */}
      {availableTechs.length === 0 ? (
        <p className="text-xs text-gray-400 italic text-center">
          {lang === 'es'
            ? 'No hay tecnologías específicas disponibles (faltan oponentes).'
            : 'No faction-specific techs available (no opponents).'}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {availableTechs.map((tech) => {
            const isAssimilated = myAssimilated.includes(tech.id);
            const isExhausted = isAssimilated && myExhausted.includes(tech.id);
            const ownerFaction =
              tech.factionIdx !== undefined ? FACTIONS[tech.factionIdx] : null;
            const disabled = !isAssimilated && slotsFull;
            return (
              <button
                key={tech.id}
                onClick={() => onTapTech(tech)}
                disabled={!canToggle ? false : disabled}
                className={`flex items-center gap-2 px-2 py-1.5 rounded border text-left pointer-events-auto active:scale-[0.98] ${
                  isAssimilated
                    ? isExhausted
                      ? 'opacity-55 border-fuchsia-500/40 bg-fuchsia-500/5'
                      : 'border-fuchsia-400 bg-fuchsia-500/15'
                    : disabled
                    ? 'opacity-40 border-gray-700 bg-gray-900/40'
                    : 'border-gray-600 bg-gray-900/30'
                }`}
              >
                <span
                  className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded leading-none"
                  style={{ background: '#a21caf', fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  L{tech.level}
                </span>
                <span
                  className={`flex-1 text-xs leading-tight truncate ${
                    isExhausted ? 'text-gray-400 italic' : 'text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {lang === 'es' ? tech.nameEs : tech.nameEn}
                </span>
                {ownerFaction && (
                  <span className="text-[9px] text-amber-200/80 italic truncate max-w-[70px]">
                    {ownerFaction.shortName}
                  </span>
                )}
                {isAssimilated && (
                  <span
                    className="text-[10px] text-fuchsia-300 leading-none"
                    title={lang === 'es' ? 'Asimilada' : 'Assimilated'}
                  >
                    ◇
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!canToggle && (
        <p className="text-[10px] text-gray-500 italic text-center mt-1">
          {lang === 'es'
            ? 'Solo el jugador emparejado con esta facción puede asimilar tecnologías.'
            : 'Only the device paired with this faction can assimilate technologies.'}
        </p>
      )}
    </div>
  );
}
