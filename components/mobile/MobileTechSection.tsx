'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TECH_COLOR_HEX, type TechColor } from '@/data/factionSheets';
import {
  BASIC_TECHNOLOGIES,
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

export interface NekroModalActions {
  markLabel: string;
  unmarkLabel: string;
  onMark: () => Promise<void>;
  onUnmark: () => Promise<void>;
  markDisabled?: boolean;
  markDisabledReason?: string;
}

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
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const exhaustedTechs = useGameStore((s) => s.exhaustedTechs);
  const players = useGameStore((s) => s.players);
  const [openTech, setOpenTech] = useState<Technology | null>(null);
  const [openTechNekroActions, setOpenTechNekroActions] = useState<NekroModalActions | null>(null);
  const openWithActions = (tech: Technology | null, actions?: NekroModalActions) => {
    setOpenTech(tech);
    setOpenTechNekroActions(actions ?? null);
  };

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
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-orange-500/30 bg-orange-500/5">
          <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            {researchedBasicCount} / {totalCount} {'investigadas'}
          </span>
          {canToggle && myExhausted.length > 0 && (
            <button
              onClick={() => { sendCommand({ type: 'readyAllMyTechs' }); }}
              className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/60 bg-yellow-500/15 text-yellow-200 active:bg-yellow-500/30 pointer-events-auto"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              ↻ {`Enderezar (${myExhausted.length})`}
            </button>
          )}
        </div>

        {isNekro && (
          <NekroAssimilatorPanel
            viewingPlayerIdx={viewingPlayerIdx}
            canToggle={canToggle}
            players={players}
            myResearched={myResearched}
            myExhausted={myExhausted}
            myAssimilated={myAssimilated}
            sendCommand={sendCommand}
            setOpenTech={openWithActions}
          />
        )}

        {!isNekro && (
          <div className="flex flex-col gap-3 px-2 py-3">

            {/* ── Zone A: Mis Tecnologías (cards con efecto) ── */}
            <div className="flex flex-col gap-2">
              <h3
                className="text-[10px] uppercase tracking-wider text-orange-300 px-1"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Mis tecnologías'}
              </h3>
              {(() => {
                const researchedFlat = COLOR_ORDER.flatMap((color) =>
                  getTechsByColorForFaction(color, viewingFactionIdx)
                    .filter((t) => myResearched.includes(t.id))
                    .sort((a, b) => a.level - b.level),
                );
                if (researchedFlat.length === 0) {
                  return (
                    <p className="text-xs text-gray-500 italic px-1 py-2">
                      {'Aún no has investigado ninguna tecnología.'}
                    </p>
                  );
                }
                return (
                  <div className="flex flex-col gap-2">
                    {researchedFlat.map((tech) => {
                      const colorHex = TECH_COLOR_HEX[tech.color];
                      const isExhausted = myExhausted.includes(tech.id);
                      return (
                        <button
                          key={tech.id}
                          onClick={() => setOpenTech(tech)}
                          className="rounded border p-3 text-left pointer-events-auto active:scale-[0.99] transition-transform"
                          style={{
                            borderColor: `${colorHex}66`,
                            background: `linear-gradient(135deg, ${colorHex}18 0%, rgba(0,0,0,0.4) 100%)`,
                            opacity: isExhausted ? 0.55 : 1,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: colorHex, boxShadow: `0 0 5px ${colorHex}` }}
                            />
                            <span
                              className="text-[10px] uppercase tracking-wider"
                              style={{ color: colorHex, fontFamily: 'var(--font-aldrich)' }}
                            >
                              {COLOR_LABELS[tech.color].es}
                            </span>
                            <span
                              className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded leading-none"
                              style={{ background: colorHex, fontFamily: 'var(--font-share-tech-mono)' }}
                            >
                              L{tech.level}
                            </span>
                            {tech.factionIdx !== undefined && (
                              <span
                                className="text-[9px] text-amber-200 border border-amber-400/60 bg-amber-500/10 px-1 rounded leading-none"
                                title={'Tecnología de facción'}
                              >
                                ◆ FACCIÓN
                              </span>
                            )}
                            {isExhausted && (
                              <span className="ml-auto text-xs text-yellow-400 leading-none" title={'Agotada'}>
                                ⌀
                              </span>
                            )}
                          </div>
                          <p
                            className="text-sm text-white mb-1"
                            style={{ fontFamily: 'var(--font-audiowide)' }}
                          >
                            {tech.nameEs}
                          </p>
                          <p
                            className="text-sm text-gray-200 leading-snug"
                            style={{ fontFamily: 'var(--font-electrolize)' }}
                          >
                            {tech.effectEs}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── Zone B header ── */}
            <h3
              className="text-[10px] uppercase tracking-wider text-gray-400 px-1 mt-2 pt-2 border-t border-gray-800"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {'Disponibles'}
            </h3>

            {/* ── Zone B: lista compacta de no investigadas, agrupada por color ── */}
            {COLOR_ORDER.map((color) => {
              const colorHex = TECH_COLOR_HEX[color];
              const allTechs = getTechsByColorForFaction(color, viewingFactionIdx).sort(
                (a, b) => a.level - b.level,
              );
              const available = allTechs.filter((t) => !myResearched.includes(t.id));
              const researchedInColor = allTechs.length - available.length;
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
                      {COLOR_LABELS[color].es}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto">
                      {researchedInColor} / {allTechs.length}
                    </span>
                  </div>
                  {available.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic px-1">
                      {'Todas investigadas.'}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {available.map((tech) => {
                        const isResearchable = canResearch(myResearched, tech);
                        return (
                          <button
                            key={tech.id}
                            onClick={() => setOpenTech(tech)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded border text-left pointer-events-auto active:scale-[0.98] ${
                              isResearchable ? 'opacity-100' : 'opacity-50'
                            }`}
                            style={{
                              borderColor: isResearchable ? `${colorHex}99` : 'rgba(75,85,99,0.4)',
                              background: isResearchable
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
                              className="flex-1 text-xs leading-tight truncate text-white"
                              style={{ fontFamily: 'var(--font-electrolize)' }}
                            >
                              {tech.nameEs}
                            </span>
                            {tech.factionIdx !== undefined && (
                              <span
                                className="text-[9px] text-amber-200 border border-amber-400/60 bg-amber-500/10 px-1 rounded leading-none"
                                title={'Tecnología de facción'}
                              >
                                ◆ {'FACCIÓN'}
                              </span>
                            )}
                            {tech.expansion === 'pok' && (
                              <span className="text-[9px] text-purple-300 border border-purple-500/40 px-1 rounded leading-none">
                                PoK
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {!canToggle && (
              <p className="text-[10px] text-gray-500 italic text-center mt-1">
                {'Solo el jugador emparejado con esta facción puede modificar el estado.'}
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
          onClose={() => { setOpenTech(null); setOpenTechNekroActions(null); }}
          nekroActions={openTechNekroActions ?? undefined}
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
  setOpenTech: (t: Technology | null, actions?: NekroModalActions) => void;
}

function NekroAssimilatorPanel({
  viewingPlayerIdx: _viewingPlayerIdx,
  canToggle,
  players,
  myResearched,
  myExhausted,
  myAssimilated,
  sendCommand,
  setOpenTech,
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

  const onTapFactionTech = (tech: Technology) => {
    const isAssimilated = myAssimilated.includes(tech.id);
    setOpenTech(tech, {
      markLabel: 'Asimilar (Valefar)',
      unmarkLabel: 'Liberar slot Valefar',
      onMark: async () => { await sendCommand({ type: 'assimilateTech', techId: tech.id }); },
      onUnmark: async () => { await sendCommand({ type: 'unassimilateTech', techId: tech.id }); },
      markDisabled: !isAssimilated && slotsFull,
      markDisabledReason: 'Ambos slots Valefar están ocupados.',
    });
  };

  const onTapBasicTech = (tech: Technology) => {
    setOpenTech(tech, {
      markLabel: 'Obtener (vía habilidad)',
      unmarkLabel: 'Devolver',
      onMark: async () => { await sendCommand({ type: 'nekroGainTech', techId: tech.id }); },
      onUnmark: async () => { await sendCommand({ type: 'nekroUngainTech', techId: tech.id }); },
    });
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
                {slot.tech.nameEs}
              </button>
            ) : (
              <span className="text-xs text-gray-500 italic">
                {'Vacío'}
              </span>
            )}
            {slot.tech && canToggle && (
              <button
                type="button"
                onClick={() => onClearSlot(slot.tech!.id)}
                className="text-[10px] px-2 py-0.5 rounded border border-red-500/60 bg-red-500/15 text-red-200 active:bg-red-500/30 pointer-events-auto self-start"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                ✕ {'Liberar'}
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-fuchsia-200/80 italic px-1">
        {'Nekro no investiga tecnologías: asimila hasta 2 tecnologías específicas del resto de jugadores.'}
      </p>

      {/* List of assimilable techs */}
      {availableTechs.length === 0 ? (
        <p className="text-xs text-gray-400 italic text-center">
          {'No hay tecnologías específicas disponibles (faltan oponentes).'}
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
                onClick={() => onTapFactionTech(tech)}
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
                  {tech.nameEs}
                </span>
                {ownerFaction && (
                  <span className="text-[9px] text-amber-200/80 italic truncate max-w-[70px]">
                    {ownerFaction.shortName}
                  </span>
                )}
                {isAssimilated && (
                  <span
                    className="text-[10px] text-fuchsia-300 leading-none"
                    title={'Asimilada'}
                  >
                    ◇
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Basic technologies — obtained via Galactic Threat / Technological Singularity */}
      <div className="flex flex-col gap-2 mt-1">
        <p
          className="text-[10px] uppercase tracking-wider text-gray-400 px-1"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {'── Tecnologías estándar (Amenaza Galáctica / Singularidad) ──'}
        </p>
        {COLOR_ORDER.map((color) => {
          const techs = BASIC_TECHNOLOGIES.filter(
            (t) => t.color === color && t.category !== 'unitUpgrade',
          );
          if (techs.length === 0) return null;
          return (
            <div key={color} className="flex flex-col gap-0.5">
              <span
                className="text-[10px] font-bold px-1 leading-none mb-0.5"
                style={{ color: TECH_COLOR_HEX[color], fontFamily: 'var(--font-share-tech-mono)' }}
              >
                ● {COLOR_LABELS[color].es}
              </span>
              {techs.map((tech) => {
                const isOwned = myResearched.includes(tech.id);
                const isExhausted = isOwned && myExhausted.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => onTapBasicTech(tech)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded border text-left pointer-events-auto active:scale-[0.98] ${
                      isOwned
                        ? isExhausted
                          ? 'opacity-55 border-gray-500/40 bg-gray-700/20'
                          : 'border-gray-400/60 bg-gray-700/25'
                        : 'border-gray-700/50 bg-gray-900/20'
                    }`}
                  >
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0"
                      style={{ background: TECH_COLOR_HEX[color], fontFamily: 'var(--font-share-tech-mono)' }}
                    >
                      L{tech.level}
                    </span>
                    <span
                      className={`flex-1 text-xs leading-tight truncate ${
                        isExhausted ? 'text-gray-500 italic' : isOwned ? 'text-white' : 'text-gray-400'
                      }`}
                      style={{ fontFamily: 'var(--font-electrolize)' }}
                    >
                      {tech.nameEs}
                    </span>
                    {isOwned && (
                      <span className="text-[11px] text-green-400 leading-none shrink-0">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {!canToggle && (
        <p className="text-[10px] text-gray-500 italic text-center mt-1">
          {'Solo el jugador emparejado con esta facción puede asimilar tecnologías.'}
        </p>
      )}
    </div>
  );
}
