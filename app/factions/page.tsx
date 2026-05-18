import { Suspense } from 'react';
import FactionBrowserPage from '@/components/factions/FactionBrowserPage';

export default function FactionsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <FactionBrowserPage />
    </Suspense>
  );
}
