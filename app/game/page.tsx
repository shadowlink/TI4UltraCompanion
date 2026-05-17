import { Suspense } from 'react';
import GameShell from '@/components/GameShell';

export default function GamePage() {
  return (
    <Suspense>
      <GameShell />
    </Suspense>
  );
}
