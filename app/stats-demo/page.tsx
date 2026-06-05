'use client';

import GameStats, { type StatsData } from '@/components/screens/GameStats';

/**
 * Ruta de previsualización (no enlazada en la app) para ver el diseño de la
 * pantalla de estadísticas de fin de partida con datos ficticios. Visitar
 * /stats-demo en el navegador.
 */
const DEMO: StatsData = {
  durationSec: 4 * 3600 + 37 * 60 + 12, // 04:37:12
  rounds: 7,
  vpGoal: 10,
  players: [
    {
      factionIdx: 5, colorIdx: 1, name: 'Marta', abandoned: false,
      vp: 10, clock: 2820, nbSpeaker: 2, commodities: 3, tradeGoods: 6,
      tokens: { tactic: 3, fleet: 4, strategy: 2 },
      techByColor: { red: 2, green: 3, blue: 1, yellow: 2 }, unitUpgrades: 1,
      objStageI: 4, objStageII: 2,
    },
    {
      factionIdx: 15, colorIdx: 4, name: 'Diego', abandoned: false,
      vp: 9, clock: 3650, nbSpeaker: 1, commodities: 1, tradeGoods: 4,
      tokens: { tactic: 2, fleet: 2, strategy: 3 },
      techByColor: { red: 1, green: 2, blue: 4, yellow: 2 }, unitUpgrades: 2,
      objStageI: 3, objStageII: 2,
    },
    {
      factionIdx: 4, colorIdx: 5, name: 'Lucía', abandoned: false,
      vp: 8, clock: 2100, nbSpeaker: 2, commodities: 6, tradeGoods: 9,
      tokens: { tactic: 4, fleet: 3, strategy: 1 },
      techByColor: { red: 3, green: 1, blue: 1, yellow: 1 }, unitUpgrades: 0,
      objStageI: 4, objStageII: 1,
    },
    {
      factionIdx: 12, colorIdx: 2, name: 'Víctor', abandoned: false,
      vp: 7, clock: 4210, nbSpeaker: 1, commodities: 2, tradeGoods: 3,
      tokens: { tactic: 1, fleet: 2, strategy: 2 },
      techByColor: { red: 2, green: 4, blue: 3, yellow: 3 }, unitUpgrades: 1,
      objStageI: 3, objStageII: 1,
    },
    {
      factionIdx: 6, colorIdx: 3, name: 'Sara', abandoned: false,
      vp: 6, clock: 1530, nbSpeaker: 1, commodities: 4, tradeGoods: 2,
      tokens: { tactic: 2, fleet: 1, strategy: 1 },
      techByColor: { red: 1, green: 1, blue: 1, yellow: 1 }, unitUpgrades: 0,
      objStageI: 4, objStageII: 1,
    },
    {
      factionIdx: 2, colorIdx: 6, name: 'Hugo', abandoned: true,
      vp: 4, clock: 1980, nbSpeaker: 0, commodities: 5, tradeGoods: 8,
      tokens: { tactic: 1, fleet: 1, strategy: 0 },
      techByColor: { red: 0, green: 2, blue: 1, yellow: 2 }, unitUpgrades: 0,
      objStageI: 2, objStageII: 1,
    },
  ],
};

export default function StatsDemoPage() {
  return <GameStats data={DEMO} onNewGame={() => { /* demo: sin acción */ }} />;
}
