'use client';

import { createContext, useContext } from 'react';
import { TransactionType } from '@/types';

interface LayoutActions {
  openAddTx: (type?: TransactionType) => void;
  openAddSavings: () => void;
  openDailyClose: () => void;
}

const LayoutActionsContext = createContext<LayoutActions | undefined>(undefined);

export function LayoutActionsProvider({
  value,
  children,
}: {
  value: LayoutActions;
  children: React.ReactNode;
}) {
  return <LayoutActionsContext.Provider value={value}>{children}</LayoutActionsContext.Provider>;
}

export function useLayoutActions() {
  const context = useContext(LayoutActionsContext);

  if (!context) {
    throw new Error('useLayoutActions must be used inside LayoutActionsProvider');
  }

  return context;
}