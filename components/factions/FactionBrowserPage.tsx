'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import FactionGrid from './FactionGrid';
import FactionList from './FactionList';
import FactionDetailView from './FactionDetailView';

export default function FactionBrowserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useGameStore((s) => s.lang);

  const factionParam = searchParams.get('faction');
  const selectedIdx = factionParam !== null ? parseInt(factionParam, 10) : null;
  const hasSelection = selectedIdx !== null && !Number.isNaN(selectedIdx);

  const goHome = () => router.push('/');
  const goList = () => router.push('/factions');
  const selectFaction = (idx: number) => router.push(`/factions?faction=${idx}`);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-4 px-6 py-3 border-b border-orange-500/30 bg-black/40">
        <button
          onClick={hasSelection ? goList : goHome}
          className="text-orange-300 hover:text-orange-200 transition-colors text-sm"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          ← {hasSelection ? (lang === 'es' ? 'Lista' : 'List') : (lang === 'es' ? 'Menú' : 'Menu')}
        </button>
        <h1
          className="text-xl text-orange-300 flex-1 text-center text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {lang === 'es' ? 'Explorador de Facciones' : 'Faction Explorer'}
        </h1>
        <div className="w-16" />
      </header>

      {hasSelection ? (
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-72 flex-shrink-0 border-r border-orange-500/20 bg-black/30 overflow-y-auto">
            <FactionList selectedIdx={selectedIdx!} onSelect={selectFaction} />
          </aside>
          <main className="flex-1 overflow-y-auto">
            <FactionDetailView factionIdx={selectedIdx!} />
          </main>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <FactionGrid onSelect={selectFaction} />
        </main>
      )}
    </div>
  );
}
