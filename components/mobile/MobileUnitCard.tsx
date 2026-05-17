'use client';

import { useGameStore } from '@/store/gameStore';
import { UNIT_TYPE_LABELS, TECH_COLOR_HEX, type FactionUnit, type UnitStatKey } from '@/data/factionSheets';

interface Props {
  unit: FactionUnit;
}

function statValue(v: string | number | null): string {
  if (v === null || v === undefined) return '—';
  return String(v);
}

export default function MobileUnitCard({ unit }: Props) {
  const lang = useGameStore((s) => s.lang);
  const stats = unit.stats;
  const combatDice = stats.combatDice ?? 1;
  const combatLabel =
    stats.combat === null
      ? '—'
      : combatDice > 1
      ? `${stats.combat} ×${combatDice}`
      : `${stats.combat}`;
  const typeLabel = UNIT_TYPE_LABELS[unit.type][lang];
  const abilities = lang === 'es' ? stats.abilitiesEs : stats.abilitiesEn;
  const desc = stats.description ? stats.description[lang] : null;
  const upgradedStats = unit.upgradedStats ?? [];
  const isUpgradedStat = (key: UnitStatKey) => upgradedStats.includes(key);

  const StatBlock = ({
    label,
    value,
    color,
    upgrades,
    hide,
  }: {
    label: string;
    value: string;
    color: string;
    upgrades?: boolean;
    hide?: boolean;
  }) => {
    if (hide) return null;
    return (
      <div className="flex flex-col items-center min-w-0">
        <span
          className="text-[9px] text-white px-1.5 py-0.5 rounded-t leading-none whitespace-nowrap"
          style={{ background: color, fontFamily: 'var(--font-aldrich)' }}
        >
          {label}
        </span>
        <div className="relative w-full">
          <span
            className="text-base font-bold text-white px-1.5 py-0.5 bg-black/40 rounded-b w-full block text-center leading-tight"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {value}
          </span>
          {upgrades && (
            <span
              className="absolute -top-0.5 -right-1 text-[10px] text-yellow-300 leading-none drop-shadow"
              title={lang === 'es' ? 'Mejora con upgrade' : 'Improves on upgrade'}
            >
              ▲
            </span>
          )}
        </div>
      </div>
    );
  };

  // Compute which stat blocks make sense per unit type
  const hideMovement = unit.type === 'infantry' || unit.type === 'pds' || unit.type === 'spaceDock';
  const hideCapacity = unit.type !== 'flagship' && unit.type !== 'dreadnought' &&
                       unit.type !== 'warSun' && unit.type !== 'cruiser' && unit.type !== 'carrier';

  return (
    <div className="rounded-lg border-2 border-red-700/70 bg-gradient-to-b from-red-900/20 to-black/60 p-2 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span
          className="text-[10px] text-red-300 uppercase tracking-wider leading-none"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {typeLabel}
        </span>
      </div>

      <p className="text-sm text-white leading-tight" style={{ fontFamily: 'var(--font-audiowide)' }}>
        {lang === 'es' ? unit.nameEs : unit.nameEn}
      </p>

      <div className="grid grid-cols-4 gap-1">
        <StatBlock
          label={lang === 'es' ? 'Coste' : 'Cost'}
          value={statValue(stats.cost)}
          color="#9b1c1c"
          upgrades={isUpgradedStat('cost')}
        />
        <StatBlock
          label={lang === 'es' ? 'Combate' : 'Combat'}
          value={combatLabel}
          color="#9b1c1c"
          upgrades={isUpgradedStat('combat')}
        />
        <StatBlock
          label={lang === 'es' ? 'Mov' : 'Mov'}
          value={statValue(stats.movement)}
          color="#c2410c"
          upgrades={isUpgradedStat('movement')}
          hide={hideMovement}
        />
        <StatBlock
          label={lang === 'es' ? 'Cap' : 'Cap'}
          value={statValue(stats.capacity)}
          color="#15803d"
          upgrades={isUpgradedStat('capacity')}
          hide={hideCapacity}
        />
      </div>

      {abilities.length > 0 && (
        <ul className="flex flex-col gap-0.5 text-[11px] text-gray-200">
          {abilities.map((a, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="text-yellow-400">◆</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}

      {desc && (
        <p className="text-[10px] text-gray-300 leading-tight italic">
          {desc}
        </p>
      )}

      {unit.hasUpgrade && (
        <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-gray-700/50">
          <span
            className="text-[9px] text-yellow-300 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            ▲ {lang === 'es' ? 'mejora' : 'upgrade'}
          </span>
          {unit.upgradePrereqs && unit.upgradePrereqs.length > 0 && (
            <div className="flex gap-1">
              {unit.upgradePrereqs.map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-black/60"
                  style={{ background: TECH_COLOR_HEX[color], boxShadow: `0 0 4px ${TECH_COLOR_HEX[color]}80` }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
