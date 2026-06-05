import { Suspense } from 'react';
import GameShell from '@/components/GameShell';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function GamePage() {
  return (
    <ErrorBoundary>
      <Suspense>
        <GameShell />
      </Suspense>
    </ErrorBoundary>
  );
}
