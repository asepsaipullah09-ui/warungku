'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Wallet, PiggyBank, ReceiptText } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useWarung } from '@/context/WarungContext';
import { formatDate, formatRupiah, isToday, isSameDay } from '@/lib/utils';
import { ReportPeriod } from '@/types';

export default function LaporanPage() {
  const { transactions, savingsHistory, metrics, isLoaded } = useWarung();
  const [period, setPeriod] = useState<ReportPeriod>('bulan_ini');

  // Filter Data based on selected Period
  const filteredData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredTx = transactions.filter((tx) => {
      const txDate = new Date(tx.transaction_date);

      if (period === 'hari_ini') {
        return isToday(tx.transaction_date);
      } else if (period === 'kemarin') {
        const yesterdayObj = new Date();
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        return isSameDay(tx.transaction_date, yesterdayObj.toISOString());
      } else if (period === '7_hari') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return txDate >= sevenDaysAgo;
      } else if (period === 'bulan_ini') {
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      }
      return true;
    });

    let totalSales = 0;
    let totalExpenses = 0;

    filteredTx.forEach((tx) => {
      if (tx.type === 'penjualan') totalSales += tx.amount;
      if (tx.type === 'pengeluaran') totalExpenses += tx.amount;
    });

    return {
      txList: filteredTx,
      totalSales,
      totalExpenses,
      netRemaining: totalSales - totalExpenses,
      totalTxCount: filteredTx.length,
    };
  }, [transactions, period]);

  // Daily Trend Chart Data Grouping
  const chartData = useMemo(() => {
    const dateMap: Record<string, { date: string; Penjualan: number; Pengeluaran: number }> = {};

    filteredData.txList.forEach((tx) => {
      const dateKey = tx.transaction_date.split('T')[0];
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = {
          date: formatDate(tx.transaction_date),
          Penjualan: 0,
          Pengeluaran: 0,
        };
      }

      if (tx.type === 'penjualan') {
        dateMap[dateKey].Penjualan += tx.amount;
      } else if (tx.type === 'pengeluaran') {
        dateMap[dateKey].Pengeluaran += tx.amount;
      }
    });

    return Object.values(dateMap).reverse();
  }, [filteredData]);

  // Expense Category Chart Data
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};

    filteredData.txList.forEach((tx) => {
      if (tx.type === 'pengeluaran') {
        catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
      }
    });

    return Object.entries(catMap).map(([category, nominal]) => ({
      category,
      nominal,
    }));
  }, [filteredData]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Laporan Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Analisis ringkas perputaran kas, penjualan, pengeluaran & tabungan
          </p>
        </div>

        {/* Period Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm self-start sm:self-auto">
          {[
            { id: 'hari_ini', label: 'Hari Ini' },
            { id: 'kemarin', label: 'Kemarin' },
            { id: '7_hari', label: '7 Hari' },
            { id: 'bulan_ini', label: 'Bulan Ini' },
            { id: 'custom', label: 'Semua' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as ReportPeriod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === item.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summaries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penjualan */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Penjualan</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatRupiah(filteredData.totalSales)}
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pengeluaran</span>
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {formatRupiah(filteredData.totalExpenses)}
          </div>
        </div>

        {/* Saldo Kas Warung Current */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saldo Kas Saat Ini</span>
            <div className="p-2 bg-slate-800 text-white rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-2xl font-black ${
              metrics.kasWarung < 0 ? 'text-rose-600' : 'text-slate-800'
            }`}
          >
            {formatRupiah(metrics.kasWarung)}
          </div>
        </div>

        {/* Total Tabungan */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tabungan</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">
            {formatRupiah(metrics.totalTabungan)}
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Penjualan vs Pengeluaran per Hari (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-base">Grafik Penjualan vs Pengeluaran</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Per Hari</span>
          </div>

          <div className="h-72 w-full pt-2">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Belum ada data grafik untuk periode ini
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value) || 0), '']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Penjualan" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Category Breakdown (1 Col) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Pengeluaran per Kategori</h3>

          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Belum ada data pengeluaran
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {categoryData.map((item) => {
                const percentage =
                  filteredData.totalExpenses > 0
                    ? Math.round((item.nominal / filteredData.totalExpenses) * 100)
                    : 0;

                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{item.category}</span>
                      <span className="font-extrabold text-slate-900">
                        {formatRupiah(item.nominal)} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
