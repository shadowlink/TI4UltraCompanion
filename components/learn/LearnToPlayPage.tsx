'use client';

import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LEARN_SECTIONS,
  type LearnSection,
  type LearnBlock,
  type StepsBlock,
  type CardsBlock,
  type CalloutBlock,
  type DiagramBlock,
} from '@/data/learnToPlay';
import { getIcon } from '@/components/ui/iconMap';
import { Info, Sparkles, AlertTriangle, ClipboardList, Rocket, ArrowRight, RefreshCw } from '@/components/ui/icons';

export default function LearnToPlayPage() {
  const router = useRouter();
  const [active, setActive] = useState<string>(LEARN_SECTIONS[0].id);

  const goSection = (id: string) => {
    setActive(id);
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          {'Aprende a jugar'}
        </h1>
        <div className="w-10 sm:w-16" />
      </header>

      {/* Navegación rápida por secciones (chips horizontales) */}
      <nav className="flex-shrink-0 border-b border-orange-500/15 bg-black/20 px-4 sm:px-6 py-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 max-w-5xl mx-auto">
          {LEARN_SECTIONS.map((s, i) => {
            const Icon = getIcon(s.icon);
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => goSection(s.id)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider border transition-colors"
                style={{
                  fontFamily: 'var(--font-aldrich)',
                  borderColor: isActive ? 'var(--accent-border-strong)' : 'rgba(255,255,255,0.12)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(255,153,51,0.18)' : 'transparent',
                }}
              >
                <Icon size={13} strokeWidth={2} aria-hidden />
                <span className="opacity-60">{i + 1}.</span> {s.title}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-12 pb-16">
          {LEARN_SECTIONS.map((section, idx) => (
            <SectionView key={section.id} section={section} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}

function SectionView({ section, index }: { section: LearnSection; index: number }) {
  const Icon = getIcon(section.icon);
  return (
    <section id={`sec-${section.id}`} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius)] bg-[color:var(--accent)]/12 border border-[color:var(--accent-border)] text-[color:var(--accent)]">
          <Icon size={18} strokeWidth={2} aria-hidden />
        </span>
        <h2
          className="text-xl sm:text-2xl text-white text-shadow"
          style={{ fontFamily: 'var(--font-audiowide)' }}
        >
          <span className="text-[color:var(--accent)]/70 mr-1">{index + 1}.</span>
          {section.title}
        </h2>
      </div>

      {section.intro && (
        <p
          className="text-sm sm:text-base leading-relaxed text-[color:var(--text-secondary)] mb-4"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          {section.intro}
        </p>
      )}

      <div className="space-y-4">
        {section.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

function BlockView({ block }: { block: LearnBlock }) {
  switch (block.kind) {
    case 'text':
      return (
        <div className="space-y-2.5">
          {block.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm sm:text-base leading-relaxed text-[color:var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {p}
            </p>
          ))}
        </div>
      );
    case 'steps':
      return <StepsView block={block} />;
    case 'cards':
      return <CardsView block={block} />;
    case 'callout':
      return <CalloutView block={block} />;
    case 'diagram':
      return <DiagramView block={block} />;
    default:
      return null;
  }
}

function StepsView({ block }: { block: StepsBlock }) {
  return (
    <ol className="relative space-y-4 pl-2">
      {block.steps.map((step, i) => (
        <li key={i} className="relative flex gap-3">
          {/* Conector vertical */}
          {i < block.steps.length - 1 && (
            <span className="absolute left-[15px] top-8 bottom-[-1rem] w-px bg-[color:var(--accent-border)]" />
          )}
          <span
            className="relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[color:var(--accent)]/15 border border-[color:var(--accent-border-strong)] text-[color:var(--accent-soft)] text-sm"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {i + 1}
          </span>
          <div className="pt-0.5">
            <h4
              className="text-sm sm:text-base text-white"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {step.title}
            </h4>
            <p
              className="text-sm leading-relaxed text-[color:var(--text-secondary)] mt-0.5"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CardsView({ block }: { block: CardsBlock }) {
  const cols =
    block.columns === 2
      ? 'sm:grid-cols-2'
      : block.columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : block.columns === 4
          ? 'sm:grid-cols-2 lg:grid-cols-4'
          : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${cols} gap-3`}>
      {block.cards.map((card, i) => {
        const accent = card.accent ?? 'var(--accent)';
        const Icon = card.icon ? getIcon(card.icon) : null;
        return (
          <div
            key={i}
            className="rounded-[var(--radius)] border bg-[var(--bg-surface)] p-3.5 flex flex-col gap-2"
            style={{ borderColor: `${accent}40` }}
          >
            <div className="flex items-center gap-2">
              {Icon && (
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[var(--radius)] flex-shrink-0"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  <Icon size={16} strokeWidth={2} aria-hidden />
                </span>
              )}
              {card.badge && (
                <span
                  className="inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-full text-sm flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-audiowide)',
                    background: `${accent}26`,
                    color: accent,
                    border: `1px solid ${accent}66`,
                  }}
                >
                  {card.badge}
                </span>
              )}
              <h4
                className="text-sm text-white leading-tight"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {card.title}
              </h4>
            </div>
            <p
              className="text-[13px] leading-relaxed text-[color:var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {card.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function CalloutView({ block }: { block: CalloutBlock }) {
  const tone = block.tone ?? 'info';
  const config = {
    info: { color: 'var(--info)', Icon: Info },
    tip: { color: 'var(--success)', Icon: Sparkles },
    warning: { color: 'var(--warning)', Icon: AlertTriangle },
    example: { color: 'var(--accent)', Icon: ClipboardList },
  }[tone];
  const { color, Icon } = config;

  return (
    <div
      className="rounded-[var(--radius)] border p-3.5 flex gap-3"
      style={{ borderColor: `${color}55`, background: `${color}12` }}
    >
      <Icon size={18} strokeWidth={2} aria-hidden className="flex-shrink-0 mt-0.5" style={{ color }} />
      <div className="space-y-1">
        {block.title && (
          <h4 className="text-sm text-white" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {block.title}
          </h4>
        )}
        <p
          className="text-sm leading-relaxed text-[color:var(--text-secondary)]"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          {block.text}
        </p>
      </div>
    </div>
  );
}

// ── Diagramas ilustrados (dibujados con CSS) ─────────────────────────────────

function DiagramView({ block }: { block: DiagramBlock }) {
  const Inner = {
    galaxy: GalaxyDiagram,
    planetCard: PlanetCardDiagram,
    reserves: ReservesDiagram,
    initiative: InitiativeDiagram,
    combat: CombatDiagram,
    phaseFlow: PhaseFlowDiagram,
  }[block.variant];

  return (
    <figure className="rounded-[var(--radius)] border border-white/8 bg-black/30 p-4 sm:p-5">
      <div className="flex justify-center overflow-x-auto">
        <Inner />
      </div>
      {block.caption && (
        <figcaption
          className="mt-3 text-xs leading-relaxed text-[color:var(--text-muted)] text-center max-w-xl mx-auto"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

function Hex({
  fill,
  border,
  label,
  sub,
  labelColor = '#fff',
}: {
  fill: string;
  border: string;
  label?: string;
  sub?: string;
  labelColor?: string;
}) {
  return (
    <div className="relative" style={{ width: 58, height: 66 }}>
      <div className="absolute inset-0" style={{ clipPath: HEX_CLIP, background: border }} />
      <div className="absolute" style={{ inset: 2, clipPath: HEX_CLIP, background: fill }} />
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1 leading-none">
          <span
            className="uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-aldrich)', color: labelColor, fontSize: 8 }}
          >
            {label}
          </span>
          {sub && (
            <span style={{ fontFamily: 'var(--font-aldrich)', color: labelColor, fontSize: 8 }}>
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function GalaxyDiagram() {
  const ring = { fill: 'var(--bg-elevated)', border: 'rgba(96,165,250,0.45)' };
  const home = { fill: 'rgba(74,222,128,0.18)', border: 'rgba(74,222,128,0.65)' };
  const rex = { fill: 'rgba(255,153,51,0.22)', border: 'var(--accent-border-strong)' };
  return (
    <div className="flex flex-col items-center select-none py-1">
      <div className="flex gap-[3px]">
        <Hex {...ring} />
        <Hex {...ring} />
      </div>
      <div className="flex gap-[3px]" style={{ marginTop: -16 }}>
        <Hex {...ring} />
        <Hex {...rex} label="Mecatol" sub="Rex" labelColor="var(--accent-soft)" />
        <Hex {...ring} />
      </div>
      <div className="flex gap-[3px]" style={{ marginTop: -16 }}>
        <Hex {...home} label="Hogar" labelColor="var(--success)" />
        <Hex {...home} label="Hogar" labelColor="var(--success)" />
      </div>
    </div>
  );
}

function PhaseFlowDiagram() {
  const phases = [
    { n: '1', name: 'Estrategia', icon: 'Star', color: 'var(--vp-gold)' },
    { n: '2', name: 'Acción', icon: 'Zap', color: 'var(--accent)' },
    { n: '3', name: 'Estado', icon: 'Trophy', color: 'var(--success)' },
    { n: '4', name: 'Consejo', icon: 'Users', color: 'var(--info)' },
  ];
  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <div className="flex items-center gap-1 sm:gap-1.5">
        {phases.map((p, i) => {
          const Icon = getIcon(p.icon);
          return (
            <Fragment key={p.name}>
              <div className="flex flex-col items-center gap-1.5 w-[68px] sm:w-[76px] flex-shrink-0">
                <span
                  className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${p.color}1f`, border: `1px solid ${p.color}` }}
                >
                  <Icon size={18} strokeWidth={2} aria-hidden style={{ color: p.color }} />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                    style={{ fontFamily: 'var(--font-audiowide)', background: p.color, color: '#0a0a12' }}
                  >
                    {p.n}
                  </span>
                </span>
                <span
                  className="text-[11px] text-center leading-tight text-white"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {p.name}
                </span>
              </div>
              {i < phases.length - 1 && (
                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                  className="flex-shrink-0 text-[color:var(--accent-soft)]"
                />
              )}
            </Fragment>
          );
        })}
      </div>
      <div
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] rounded-full border border-white/10 px-3 py-1"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        <RefreshCw size={13} strokeWidth={2} aria-hidden className="text-[color:var(--accent-soft)]" />
        Y vuelta a empezar la siguiente ronda
      </div>
    </div>
  );
}

function AnnotRow({
  color,
  n,
  title,
  text,
}: {
  color: string;
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2.5 max-w-xs">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
        style={{ background: color, color: '#0a0a12', fontFamily: 'var(--font-audiowide)' }}
      >
        {n}
      </span>
      <div>
        <div className="text-sm text-white" style={{ fontFamily: 'var(--font-aldrich)' }}>
          {title}
        </div>
        <div
          className="text-xs text-[color:var(--text-secondary)]"
          style={{ fontFamily: 'var(--font-electrolize)' }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function PlanetCardDiagram() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      {/* La cartita de planeta */}
      <div className="relative w-32 h-44 rounded-lg border border-white/15 shadow-[var(--elevation-2)] flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #11213c 0%, #0a0f1e 100%)' }} />
        {/* Planeta */}
        <div
          className="absolute right-3 top-4 w-12 h-12 rounded-full"
          style={{ background: 'radial-gradient(circle at 32% 30%, #6aa6ff, #1b3a6b 70%)' }}
        />
        {/* Recurso (arriba-izq, amarillo) */}
        <span
          className="absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'var(--accent)', color: '#1a1205', fontFamily: 'var(--font-audiowide)' }}
        >
          2
        </span>
        {/* Influencia (abajo-izq, azul) */}
        <span
          className="absolute bottom-2 left-2 w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: 'var(--info)', color: '#04122b', fontFamily: 'var(--font-audiowide)' }}
        >
          3
        </span>
        {/* Nombre */}
        <span
          className="absolute inset-x-0 bottom-3 text-center text-xs uppercase tracking-widest text-white/90"
          style={{ fontFamily: 'var(--font-aldrich)' }}
        >
          Jord
        </span>
      </div>
      {/* Anotaciones */}
      <div className="space-y-3">
        <AnnotRow color="var(--accent)" n="2" title="Recursos" text="Cifra amarilla, arriba. Se gastan para producir naves y unidades." />
        <AnnotRow color="var(--info)" n="3" title="Influencia" text="Cifra azul, abajo. Sirve para ganar fichas de Mando y para votar." />
      </div>
    </div>
  );
}

function ReservesDiagram() {
  const reserves = [
    { name: 'Táctica', count: 3, color: 'var(--accent)', use: 'Pagar acciones tácticas' },
    { name: 'Flota', count: 3, color: 'var(--info)', use: 'Límite de naves por sistema' },
    { name: 'Estrategia', count: 2, color: 'var(--vp-gold)', use: 'Usar cartas ajenas' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md">
      {reserves.map((r) => (
        <div
          key={r.name}
          className="rounded-[var(--radius)] border p-3 flex flex-col items-center gap-2 text-center"
          style={{ borderColor: `${r.color}55`, background: `${r.color}10` }}
        >
          <div className="flex gap-1 h-4 items-center">
            {Array.from({ length: r.count }).map((_, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border"
                style={{ background: `${r.color}40`, borderColor: r.color }}
              />
            ))}
          </div>
          <div className="text-xs uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {r.name}
          </div>
          <div
            className="text-[10px] text-[color:var(--text-muted)] leading-tight"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {r.use}
          </div>
        </div>
      ))}
    </div>
  );
}

function InitiativeDiagram() {
  const cards = [
    'Liderazgo',
    'Diplomacia',
    'Política',
    'Construcción',
    'Comercio',
    'Guerra',
    'Tecnología',
    'Imperialismo',
  ];
  return (
    <div className="w-full max-w-lg">
      <div
        className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[color:var(--text-muted)] mb-1.5 px-1"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        <span>← juega antes</span>
        <span>juega después →</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {cards.map((name, i) => (
          <div key={name} className="flex-shrink-0 flex flex-col items-center gap-1 w-[58px]">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                fontFamily: 'var(--font-audiowide)',
                background: 'rgba(255,153,51,0.16)',
                border: '1px solid var(--accent-border-strong)',
                color: 'var(--accent-soft)',
              }}
            >
              {i + 1}
            </span>
            <span
              className="text-[9px] text-center leading-tight text-[color:var(--text-secondary)]"
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CombatDiagram() {
  const units = [
    { name: 'Acorazado', combat: 5, roll: 6, hit: true },
    { name: 'Crucero', combat: 7, roll: 4, hit: false },
    { name: 'Crucero', combat: 7, roll: 8, hit: true },
  ];
  return (
    <div className="w-full max-w-md space-y-2">
      {units.map((u, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-[var(--radius)] border border-white/8 bg-[var(--bg-surface)] px-3 py-2"
        >
          <Rocket size={16} strokeWidth={2} aria-hidden className="text-[color:var(--text-secondary)] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white" style={{ fontFamily: 'var(--font-aldrich)' }}>
              {u.name}
            </div>
            <div
              className="text-[10px] text-[color:var(--text-muted)]"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              Combate {u.combat} · impacta con {u.combat}+
            </div>
          </div>
          <span
            className="w-9 h-9 rounded-md flex items-center justify-center text-base flex-shrink-0"
            style={{
              fontFamily: 'var(--font-audiowide)',
              background: u.hit ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${u.hit ? 'var(--success)' : 'rgba(255,255,255,0.15)'}`,
              color: u.hit ? 'var(--success)' : 'var(--text-muted)',
            }}
          >
            {u.roll}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider w-16 text-right flex-shrink-0"
            style={{ fontFamily: 'var(--font-aldrich)', color: u.hit ? 'var(--success)' : 'var(--text-muted)' }}
          >
            {u.hit ? '¡Impacto!' : 'Falla'}
          </span>
        </div>
      ))}
      <div className="text-center text-sm text-white pt-1" style={{ fontFamily: 'var(--font-aldrich)' }}>
        = <span className="text-[color:var(--success)]">2 impactos</span> → tu rival destruye 2 naves
      </div>
    </div>
  );
}
