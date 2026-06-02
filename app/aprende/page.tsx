import { Suspense } from 'react';
import LearnToPlayPage from '@/components/learn/LearnToPlayPage';

export default function AprendeRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LearnToPlayPage />
    </Suspense>
  );
}
