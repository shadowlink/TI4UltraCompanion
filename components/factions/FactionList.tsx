'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, isAllowedFaction } from '@/data/factions';
import { getFactionSheet } from '@/data/factionSheets';

interface Props {
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export default function FactionList({ selectedIdx, onSelect }: Props) {

  return (
    <ul className="flex flex-col py-2">
      {FACTIONS.map((faction, idx) => {
        if (!isAllowedFaction(idx)) return null;
        const sheet = getFactionSheet(idx);
        const isComplete = sheet?.complete ?? false;
        const isSelected = idx === selectedIdx;
        return (
          <li key={idx}>
            <button
              onClick={() => onSelect(idx)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-all ${
                isSelected
                  ? 'bg-orange-500/20 border-l-4 border-orange-400'
                  : 'border-l-4 border-transparent hover:bg-orange-500/5'
              } ${isComplete ? '' : 'opacity-60'}`}
            >
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
              </div>
              <span
                className={`text-sm leading-tight ${isSelected ? 'text-orange-200' : 'text-gray-300'}`}
                style={{ fontFamily: 'var(--font-electrolize)' }}
              >
                {faction.nameEs}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
