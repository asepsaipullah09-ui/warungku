'use client';

import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { WarungProvider } from '@/context/WarungContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AddTransactionModal } from '@/components/modal/AddTransactionModal';
import { AddSavingsModal } from '@/components/modal/AddSavingsModal';
import { DailyCloseModal } from '@/components/modal/DailyCloseModal';
import { LayoutActionsProvider } from '@/context/LayoutActionsContext';
import { TransactionType } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <title>WarungKu - Pencatatan Keuangan Warung Realistis & Sederhana</title>
        <meta
          name="description"
          content="Aplikasi pencatatan keuangan sederhana untuk warung kecil. Uang kas, pengeluaran, tabungan, dan tutup hari."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} bg-slate-100 text-slate-900 min-h-screen antialiased`}>
        <WarungProvider>
          <LayoutContent>{children}</LayoutContent>
        </WarungProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txDefaultType, setTxDefaultType] = useState<TransactionType>('penjualan');
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false);
  const [isDailyCloseOpen, setIsDailyCloseOpen] = useState(false);

  const openAddTx = (type: TransactionType = 'penjualan') => {
    setTxDefaultType(type);
    setIsAddTxOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <Header />

        <main className="w-full max-w-full flex-1 overflow-x-hidden px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8 md:pb-8">
          <LayoutActionsProvider
            value={{
              openAddTx,
              openAddSavings: () => setIsAddSavingsOpen(true),
              openDailyClose: () => setIsDailyCloseOpen(true),
            }}
          >
            {children}
          </LayoutActionsProvider>
        </main>
      </div>

      <BottomNav onOpenAddModal={() => openAddTx('penjualan')} />

      {/* Global Modals */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        defaultType={txDefaultType}
      />
      <AddSavingsModal
        isOpen={isAddSavingsOpen}
        onClose={() => setIsAddSavingsOpen(false)}
      />
      <DailyCloseModal
        isOpen={isDailyCloseOpen}
        onClose={() => setIsDailyCloseOpen(false)}
      />
    </div>
  );
}
