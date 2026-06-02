'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  REFERENCE_GUIDE,
  REF_ENTRY_BY_ID,
  type RefCategory,
  type RefEntry,
} from '@/data/referenceGuide';
import { getIcon } from '@/components/ui/iconMap';
import { Search, ChevronDown, X } from '@/components/ui/icons';

/** Quita acentos y pasa a minúsculas para una búsqueda tolerante. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function entryMatches(entry: RefEntry, q: string): boolean {
  if (!q) return true;
  const haystack = normalize(
    [entry.title, entry.tag ?? '', ...entry.body].join(' '),
  );
  return haystack.includes(q);
}

export default function ReferenceGuidePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const q = normalize(query.trim());

  // Categorías con sus entradas filtradas por búsqueda + categoría activa.
  const filtered = useMemo(() => {
    return REFERENCE_GUIDE.map((cat) => ({
      ...cat,
      entries: cat.entries.filter((e) => entryMatches(e, q)),
    })).filter(
      (cat) =>
        cat.entries.length > 0 && (activeCat === null || cat.id === activeCat),
    );
  }, [q, activeCat]);

  const totalMatches = filtered.reduce((n, c) => n + c.entries.length, 0);

  /** Abre una entrada por id (desde un enlace "Véase también") y hace scroll. */
  const openEntry = (id: string) => {
    const cat = REFERENCE_GUIDE.find((c) => c.entries.some((e) => e.id === id));
    if (cat && activeCat !== null && cat.id !== activeCat) setActiveCat(null);
    setQuery('');
    setOpenId(id);
    // Scroll tras el re-render.
    requestAnimationFrame(() => {
      entryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-orange-500/30 bg-black/40">
        <button
          onClick={() => router.push('/')}
          className="text-orange-300 hover:text-orange-200 transition-colors text-sm whitespace-nowrap"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          ← {'Menú'}
        </button>
        <h1
          className="text-lg sm:text-xl text-orange-300 flex-1 text-center text-shadow truncate"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          {'Guía de referencia'}
        </h1>
        <div className="w-10 sm:w-16" />
      </header>

      {/* Controles: buscador + chips de categoría */}
      <div className="flex-shrink-0 border-b border-orange-500/15 bg-black/20 px-4 sm:px-6 py-3 space-y-3">
        <div className="relative max-w-2xl mx-auto">
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar término o regla…"
            className="w-full bg-[var(--bg-surface)] border border-[color:var(--accent-border)] rounded-[var(--radius)] pl-9 pr-9 py-2 text-white text-sm outline-none focus:border-[color:var(--accent-border-strong)] transition-colors"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-white transition-colors"
            >
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
          <CatChip
            label="Todas"
            active={activeCat === null}
            onClick={() => setActiveCat(null)}
          />
          {REFERENCE_GUIDE.map((cat) => (
            <CatChip
              key={cat.id}
              label={cat.title}
              accent={cat.accent}
              active={activeCat === cat.id}
              onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Lista de entradas */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
          {q && (
            <p
              className="text-xs text-[color:var(--text-muted)] text-center"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              {totalMatches} resultado{totalMatches === 1 ? '' : 's'} para “{query.trim()}”
            </p>
          )}

          {filtered.length === 0 ? (
            <p className="text-center text-[color:var(--text-muted)] py-16">
              No se ha encontrado ningún término. Prueba con otra palabra.
            </p>
          ) : (
            filtered.map((cat) => (
              <CategoryBlock
                key={cat.id}
                category={cat}
                openId={openId}
                onToggle={(id) => setOpenId(openId === id ? null : id)}
                onOpenEntry={openEntry}
                forceOpen={Boolean(q)}
                registerRef={(id, el) => {
                  entryRefs.current[id] = el;
                }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function CatChip({
  label,
  accent = 'var(--accent)',
  active,
  onClick,
}: {
  label: string;
  accent?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-3 py-1 rounded-full text-xs uppercase tracking-wider border transition-colors"
      style={{
        fontFamily: 'var(--font-aldrich)',
        borderColor: active ? accent : 'rgba(255,255,255,0.12)',
        color: active ? '#fff' : 'var(--text-secondary)',
        background: active ? `${accent.startsWith('var') ? 'rgba(255,153,51,0.18)' : accent}` : 'transparent',
      }}
    >
      {label}
    </button>
  );
}

function CategoryBlock({
  category,
  openId,
  onToggle,
  onOpenEntry,
  forceOpen,
  registerRef,
}: {
  category: RefCategory;
  openId: string | null;
  onToggle: (id: string) => void;
  onOpenEntry: (id: string) => void;
  forceOpen: boolean;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const Icon = getIcon(category.icon);
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius)]"
          style={{ background: `${category.accent}1f`, color: category.accent }}
        >
          <Icon size={16} strokeWidth={2} aria-hidden />
        </span>
        <h2
          className="text-sm uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-aldrich)', color: category.accent }}
        >
          {category.title}
        </h2>
        <span className="flex-1 h-px bg-white/8" />
      </div>

      <div className="space-y-2">
        {category.entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            accent={category.accent}
            open={forceOpen || openId === entry.id}
            onToggle={() => onToggle(entry.id)}
            onOpenEntry={onOpenEntry}
            registerRef={registerRef}
          />
        ))}
      </div>
    </section>
  );
}

function EntryCard({
  entry,
  accent,
  open,
  onToggle,
  onOpenEntry,
  registerRef,
}: {
  entry: RefEntry;
  accent: string;
  open: boolean;
  onToggle: () => void;
  onOpenEntry: (id: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={(el) => registerRef(entry.id, el)}
      className="rounded-[var(--radius)] border border-white/8 bg-[var(--bg-surface)] overflow-hidden scroll-mt-24"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span
          className="text-sm sm:text-base text-white"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          {entry.title}
        </span>
        {entry.tag && (
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[var(--radius-sm)] border"
            style={{
              fontFamily: 'var(--font-aldrich)',
              borderColor: `${accent}99`,
              color: accent,
              background: `${accent}15`,
            }}
          >
            {entry.tag}
          </span>
        )}
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden
          className={`ml-auto flex-shrink-0 text-[color:var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-white/8">
          {entry.body.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[color:var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {p}
            </p>
          ))}

          {entry.seeAlso && entry.seeAlso.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] mr-1">
                Véase también
              </span>
              {entry.seeAlso.map((id) => {
                const target = REF_ENTRY_BY_ID[id];
                if (!target) return null;
                return (
                  <button
                    key={id}
                    onClick={() => onOpenEntry(id)}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-[color:var(--accent-border)] text-[color:var(--accent-soft)] hover:bg-[color:var(--accent)]/10 transition-colors"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {target.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
