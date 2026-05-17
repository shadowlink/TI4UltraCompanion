'use client';

import { createContext, useContext } from 'react';

export const ViewOnlyContext = createContext(false);

export function useIsViewOnly() {
  return useContext(ViewOnlyContext);
}
