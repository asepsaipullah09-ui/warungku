'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Transaction,
  SavingsRecord,
  DailyClosing,
  DashboardMetrics,
  TransactionType,
  TransactionCategory,
} from '@/types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_HISTORY,
  INITIAL_DAILY_CLOSINGS,
} from '@/lib/mockData';
import { getTodayDateString, isSameDay } from '@/lib/utils';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

interface WarungContextType {
  transactions: Transaction[];
  savingsHistory: SavingsRecord[];
  dailyClosings: DailyClosing[];
  metrics: DashboardMetrics;
  isLoaded: boolean;
  isSupabase: boolean;

  // Actions
  addTransaction: (data: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    transaction_date?: string;
  }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addManualSavings: (amount: number, description: string) => Promise<void>;
  executeTutupHari: () => Promise<{ transferredAmount: number; wasPositive: boolean }>;
  resetToDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const WarungContext = createContext<WarungContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'warungku_transactions_v1',
  SAVINGS: 'warungku_savings_v1',
  DAILY_CLOSINGS: 'warungku_daily_closings_v1',
};

export const WarungProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsHistory, setSavingsHistory] = useState<SavingsRecord[]>([]);
  const [dailyClosings, setDailyClosings] = useState<DailyClosing[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSupabase] = useState(isSupabaseConfigured());

  // Load Initial Data (from Supabase or LocalStorage / MockData)
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        try {
          const [txRes, svgRes, dcRes] = await Promise.all([
            supabase.from('transactions').select('*').order('transaction_date', { ascending: false }),
            supabase.from('savings').select('*').order('transaction_date', { ascending: false }),
            supabase.from('daily_closings').select('*').order('closing_date', { ascending: false }),
          ]);

          if (!txRes.error && txRes.data) setTransactions(txRes.data);
          if (!svgRes.error && svgRes.data) setSavingsHistory(svgRes.data);
          if (!dcRes.error && dcRes.data) setDailyClosings(dcRes.data);
          setIsLoaded(true);
          return;
        } catch (err) {
          console.warn('Supabase fetch error, fallback to LocalStorage:', err);
        }
      }

      // LocalStorage Fallback or Default Mock Data
      try {
        const localTx = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
        const localSvg = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVINGS);
        const localDc = localStorage.getItem(LOCAL_STORAGE_KEYS.DAILY_CLOSINGS);

        if (localTx && localSvg && localDc) {
          setTransactions(JSON.parse(localTx));
          setSavingsHistory(JSON.parse(localSvg));
          setDailyClosings(JSON.parse(localDc));
        } else {
          // Initialize with realistic seed data
          setTransactions(INITIAL_TRANSACTIONS);
          setSavingsHistory(INITIAL_SAVINGS_HISTORY);
          setDailyClosings(INITIAL_DAILY_CLOSINGS);

          localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
          localStorage.setItem(LOCAL_STORAGE_KEYS.SAVINGS, JSON.stringify(INITIAL_SAVINGS_HISTORY));
          localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_CLOSINGS, JSON.stringify(INITIAL_DAILY_CLOSINGS));
        }
      } catch (e) {
        console.error('LocalStorage load error:', e);
        setTransactions(INITIAL_TRANSACTIONS);
        setSavingsHistory(INITIAL_SAVINGS_HISTORY);
        setDailyClosings(INITIAL_DAILY_CLOSINGS);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  // Save to LocalStorage helper
  const saveLocal = (
    newTx: Transaction[],
    newSvg: SavingsRecord[],
    newDc: DailyClosing[]
  ) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTx));
      localStorage.setItem(LOCAL_STORAGE_KEYS.SAVINGS, JSON.stringify(newSvg));
      localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_CLOSINGS, JSON.stringify(newDc));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  };

  // Calculations
  const metrics = useMemo<DashboardMetrics>(() => {
    const todayStr = getTodayDateString();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalSalesCumulative = 0;
    let totalExpensesCumulative = 0;
    let totalSavingsFromCashCumulative = 0;

    let penjualanHariIni = 0;
    let pengeluaranHariIni = 0;

    let pengeluaranBulanIni = 0;
    let penjualanBulanIni = 0;

    // Process all transactions
    transactions.forEach((tx) => {
      const txDate = new Date(tx.transaction_date);
      const isTxToday = isSameDay(tx.transaction_date, new Date().toISOString());
      const isTxThisMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;

      if (tx.type === 'penjualan') {
        totalSalesCumulative += tx.amount;
        if (isTxToday) penjualanHariIni += tx.amount;
        if (isTxThisMonth) penjualanBulanIni += tx.amount;
      } else if (tx.type === 'pengeluaran') {
        totalExpensesCumulative += tx.amount;
        if (isTxToday) pengeluaranHariIni += tx.amount;
        if (isTxThisMonth) pengeluaranBulanIni += tx.amount;
      }
    });

    // Savings history accumulated
    let totalTabungan = 0;
    savingsHistory.forEach((svg) => {
      totalTabungan += svg.amount;
      // If savings came from cash (Tutup Hari), it deducted from Kas Warung
      if (svg.source_type === 'tutup_hari') {
        totalSavingsFromCashCumulative += svg.amount;
      }
    });

    // Kas Warung = Total Penjualan - Total Pengeluaran - Uang Kas yang dipindah ke Tabungan via Tutup Hari
    const kasWarung = totalSalesCumulative - totalExpensesCumulative - totalSavingsFromCashCumulative;
    const sisaHariIni = penjualanHariIni - pengeluaranHariIni;

    const todayClosing = dailyClosings.find((dc) => dc.closing_date === todayStr);
    const hariIniSudahTutup = Boolean(todayClosing && todayClosing.is_closed);

    return {
      kasWarung,
      totalTabungan,
      penjualanHariIni,
      pengeluaranHariIni,
      sisaHariIni,
      pengeluaranBulanIni,
      penjualanBulanIni,
      hariIniSudahTutup,
    };
  }, [transactions, savingsHistory, dailyClosings]);

  // Action: Add Transaction
  const addTransaction = async (data: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    transaction_date?: string;
  }) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description || (data.type === 'penjualan' ? 'Penjualan warung' : 'Pengeluaran warung'),
      transaction_date: data.transaction_date || new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    saveLocal(updatedTx, savingsHistory, dailyClosings);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('transactions').insert(newTx);
    }
  };

  // Action: Delete Transaction
  const deleteTransaction = async (id: string) => {
    const updatedTx = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTx);
    saveLocal(updatedTx, savingsHistory, dailyClosings);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('transactions').delete().eq('id', id);
    }
  };

  // Action: Add Manual Savings (e.g. transfer manual directly to savings)
  const addManualSavings = async (amount: number, description: string) => {
    const newSvg: SavingsRecord = {
      id: `svg-${Date.now()}`,
      amount,
      description: description || 'Transfer manual ke tabungan',
      source_type: 'manual',
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const updatedSvg = [newSvg, ...savingsHistory];
    setSavingsHistory(updatedSvg);
    saveLocal(transactions, updatedSvg, dailyClosings);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('savings').insert(newSvg);
    }
  };

  // Action: Execute Tutup Hari
  const executeTutupHari = async () => {
    const todayStr = getTodayDateString();
    const currentKas = metrics.kasWarung;
    const isPositive = currentKas > 0;
    const transferredAmount = isPositive ? currentKas : 0;

    let updatedSvg = [...savingsHistory];

    // If kas is positive, transfer to savings
    if (isPositive) {
      const newSvgRecord: SavingsRecord = {
        id: `svg-close-${Date.now()}`,
        amount: transferredAmount,
        description: `Sisa kas hari ini (Tutup Hari ${todayStr})`,
        source_type: 'tutup_hari',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      updatedSvg = [newSvgRecord, ...updatedSvg];
      setSavingsHistory(updatedSvg);

      if (isSupabaseConfigured() && supabase) {
        await supabase.from('savings').insert(newSvgRecord);
      }
    }

    // Record daily closing entry
    const newClosing: DailyClosing = {
      id: `dc-${Date.now()}`,
      closing_date: todayStr,
      total_sales: metrics.penjualanHariIni,
      total_expenses: metrics.pengeluaranHariIni,
      remaining_cash: currentKas,
      transferred_to_savings: transferredAmount,
      is_closed: true,
      created_at: new Date().toISOString(),
    };

    // Replace if closing already exists for today or add new
    const filteredClosings = dailyClosings.filter((dc) => dc.closing_date !== todayStr);
    const updatedDc = [newClosing, ...filteredClosings];

    setDailyClosings(updatedDc);
    saveLocal(transactions, updatedSvg, updatedDc);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('daily_closings').upsert(newClosing, { onConflict: 'closing_date' });
    }

    return {
      transferredAmount,
      wasPositive: isPositive,
    };
  };

  // Reset demo data
  const resetToDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsHistory(INITIAL_SAVINGS_HISTORY);
    setDailyClosings(INITIAL_DAILY_CLOSINGS);
    saveLocal(INITIAL_TRANSACTIONS, INITIAL_SAVINGS_HISTORY, INITIAL_DAILY_CLOSINGS);
  };

  // Export JSON
  const exportDataJSON = () => {
    return JSON.stringify(
      {
        transactions,
        savingsHistory,
        dailyClosings,
        exported_at: new Date().toISOString(),
        app: 'WarungKu',
      },
      null,
      2
    );
  };

  // Import JSON
  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.transactions) && Array.isArray(parsed.savingsHistory)) {
        setTransactions(parsed.transactions);
        setSavingsHistory(parsed.savingsHistory);
        if (Array.isArray(parsed.dailyClosings)) setDailyClosings(parsed.dailyClosings);
        saveLocal(
          parsed.transactions,
          parsed.savingsHistory,
          parsed.dailyClosings || []
        );
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  };

  return (
    <WarungContext.Provider
      value={{
        transactions,
        savingsHistory,
        dailyClosings,
        metrics,
        isLoaded,
        isSupabase,
        addTransaction,
        deleteTransaction,
        addManualSavings,
        executeTutupHari,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </WarungContext.Provider>
  );
};

export const useWarung = () => {
  const context = useContext(WarungContext);
  if (!context) {
    throw new Error('useWarung must be used within a WarungProvider');
  }
  return context;
};
