import { Suspense } from 'react';
import ReferenceGuidePage from '@/components/guide/ReferenceGuidePage';

export default function GuiaRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ReferenceGuidePage />
    </Suspense>
  );
}
