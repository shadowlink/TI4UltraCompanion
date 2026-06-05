'use client';

import { useEffect, useRef, useState } from 'react';
import { useVisualEffects } from '@/hooks/useVisualEffects';

const SPARK_COUNT = 6;

/**
 * Muestra los puntos de victoria con realimentación al subir: conteo animado,
 * destello dorado y una pequeña explosión de chispas. Si los efectos están
 * desactivados, muestra el número plano. `className`/`style` se aplican al
 * número para heredar el estilo del sitio donde se use (VPBar, fila móvil…).
 */
export default function AnimatedVP({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const fx = useVisualEffects();
  const prev = useRef(value);
  const [display, setDisplay] = useState(value);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (!fx || value === from) {
      setDisplay(value);
      return;
    }
    if (value > from) setBurst((k) => k + 1); // chispas solo al incrementar
    let raf = 0;
    const t0 = performance.now();
    const dur = 450;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, fx]);

  return (
    <span className="relative inline-flex items-center justify-center">
      <span key={burst} className={`${className ?? ''} ${fx && burst > 0 ? 'vp-flash' : ''}`} style={style}>
        {display}
      </span>
      {fx && burst > 0 && (
        <span key={`b${burst}`} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          {Array.from({ length: SPARK_COUNT }).map((_, i) => {
            const a = (i / SPARK_COUNT) * Math.PI * 2;
            return (
              <span
                key={i}
                className="vp-spark"
                style={{
                  ['--dx' as string]: `${Math.cos(a) * 14}px`,
                  ['--dy' as string]: `${Math.sin(a) * 14}px`,
                }}
              />
            );
          })}
        </span>
      )}
    </span>
  );
}
