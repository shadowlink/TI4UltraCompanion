'use client';

import { useEffect, useRef } from 'react';
import { useVisualEffects } from '@/hooks/useVisualEffects';

interface Star {
  x: number;
  y: number;
  z: number; // profundidad: rige tamaño, brillo y velocidad de parallax
  r: number;
  tw: number; // velocidad de parpadeo
  ph: number; // fase de parpadeo
}

/**
 * Fondo estelar global en <canvas>, detrás de toda la app. Ligero y respetuoso:
 * densidad escalada al viewport, devicePixelRatio capado, se pausa con la
 * pestaña oculta y no anima si los efectos están desactivados (pinta estrellas
 * estáticas tenues). Se monta una sola vez en el layout raíz.
 */
export default function StarfieldBackground() {
  const enabled = useVisualEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((width * height) / 9000);
      const count = Math.max(40, Math.min(220, target));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.4 + z * 1.4,
          tw: 0.5 + Math.random(),
          ph: Math.random() * Math.PI * 2,
        };
      });
      if (!running) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 225, 255, ${0.16 + s.z * 0.28})`;
        ctx.fill();
      }
    };

    const draw = (t: number) => {
      if (!running) return;
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.y -= (4 + s.z * 14) * (dt / 1000); // deriva lenta hacia arriba, parallax por profundidad
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
        const tw = 0.55 + 0.45 * Math.sin(s.ph + t * 0.001 * s.tw);
        const alpha = (0.25 + s.z * 0.55) * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${200 + Math.round(s.z * 55)}, ${210 + Math.round(s.z * 40)}, 255, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener('resize', resize);

    if (enabled) {
      start();
      document.addEventListener('visibilitychange', onVisibility);
    } else {
      drawStatic();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  return (
    <div aria-hidden className="starfield-root">
      <div className="nebula-layer" />
      <canvas ref={canvasRef} className="starfield-canvas" />
    </div>
  );
}
