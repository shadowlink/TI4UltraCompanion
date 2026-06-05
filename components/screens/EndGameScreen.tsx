'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { clearSavedGame } from '@/lib/persistence';
import { TECH_BY_ID } from '@/data/technologies';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import type { TechColor } from '@/data/factionSheets';
import GameStats, { type StatsData, type StatsPlayer } from '@/components/screens/GameStats';

export default function EndGameScreen() {
  const router = useRouter();
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const players = useGameStore((s) => s.players);
  const gameDuration = useGameStore((s) => s.gameDuration);
  const turnCounter = useGameStore((s) => s.turnCounter);
  const vpGoal = useGameStore((s) => s.options.vpWinGoal);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const startNewGame = useGameStore((s) => s.startNewGame);

  const statsPlayers: StatsPlayer[] = players.slice(0, nbPlayers).map((p, i) => {
    // Tecnologías por color + mejoras de unidad
    const techByColor: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
    let unitUpgrades = 0;
    for (const id of researchedTechs[i] ?? []) {
      const t = TECH_BY_ID[id];
      if (!t) continue;
      if (t.category === 'unitUpgrade') unitUpgrades += 1;
      else techByColor[t.color] += 1;
    }
    // Objetivos públicos puntuados por etapa
    let objStageI = 0;
    let objStageII = 0;
    for (const [objId, idxs] of Object.entries(objectivesScoredBy)) {
      if (!idxs.includes(i)) continue;
      const stage = OBJECTIVES_BY_ID[objId]?.stage;
      if (stage === 2) objStageII += 1;
      else objStageI += 1;
    }
    const tokens = p.commandTokens ?? { tactic: 0, fleet: 0, strategy: 0 };
    return {
      factionIdx: p.faction,
      colorIdx: p.color,
      name: p.name,
      abandoned: p.abandoned,
      vp: p.vp,
      clock: p.clock ?? 0,
      nbSpeaker: p.nbSpeaker ?? 0,
      commodities: p.commodities ?? 0,
      tradeGoods: p.tradeGoods ?? 0,
      tokens: { tactic: tokens.tactic, fleet: tokens.fleet, strategy: tokens.strategy },
      techByColor,
      unitUpgrades,
      objStageI,
      objStageII,
    };
  });

  const data: StatsData = {
    durationSec: gameDuration,
    rounds: turnCounter,
    vpGoal,
    players: statsPlayers,
  };

  const handleNewGame = () => {
    clearSavedGame();
    startNewGame();
    router.push('/');
  };

  return <GameStats data={data} onNewGame={handleNewGame} />;
}
