'use client';

import React from 'react';
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Moon,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Store,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useWarung } from '@/context/WarungContext';
import { useLayoutActions } from '@/context/LayoutActionsContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TodaySummary } from '@/components/dashboard/TodaySummary';
import { formatDate, formatRupiah, formatTime } from '@/lib/utils';
export default function DashboardPage() {
  const { metrics, transactions, isLoaded } = useWarung();
  const { openAddTx, openAddSavings, openDailyClose } = useLayoutActions();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  const todayStr = new Date().toISOString();
  const recentTx = transactions.slice(0, 5);

  // Ratio calculation for progress bar
  const totalTodayFlow = metrics.penjualanHariIni + metrics.pengeluaranHariIni;
  const salesPercent = totalTodayFlow > 0 ? Math.round((metrics.penjualanHariIni / totalTodayFlow) * 100) : 50;
  const expensePercent = totalTodayFlow > 0 ? 100 - salesPercent : 50;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Quick Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-sm">
        <div className="flex items-center space-x-2 px-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span className="text-xs font-bold text-slate-700">Aksi Cepat Transaksi Warung</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openAddTx('penjualan')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Penjualan</span>
          </button>

          <button
            onClick={() => openAddTx('pengeluaran')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all"
          >
            <MinusCircle className="w-4 h-4" />
            <span>− Pengeluaran</span>
          </button>

          <button
            onClick={openAddSavings}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <PiggyBank className="w-4 h-4" />
            <span>+ Tabungan</span>
          </button>

          <button
            onClick={openDailyClose}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-slate-900/20 transition-all"
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span>Tutup Hari</span>
          </button>
        </div>
      </div>

      {/* Main Grid matching CoachPro Dashboard Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* UPPER LEFT: Main Status Highlight Card (7 cols) */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
              Perputaran Kas Hari Ini
            </span>
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{formatDate(todayStr)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Warung vs Kas Box */}
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Kas Warung</span>
                <p className={`text-xl font-black ${metrics.kasWarung < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatRupiah(metrics.kasWarung)}
                </p>
              </div>
            </div>

            {/* Tabungan Box */}
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Tabungan Safe</span>
                <p className="text-xl font-black text-slate-800">
                  {formatRupiah(metrics.totalTabungan)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Sisa Hasil Hari Ini: <strong className="text-slate-800 font-black">{formatRupiah(metrics.sisaHariIni)}</strong>
            </span>
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Kas kembali Rp0 saat Tutup Hari
            </span>
          </div>
        </div>

        {/* UPPER RIGHT: Games Statistic Style Ratio Card (5 cols) */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Rasio Keuangan Hari Ini
            </h3>
            <span className="text-xs text-teal-600 font-bold">Hari Ini</span>
          </div>

          {/* Progress Bar Header */}
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${salesPercent}%` }}
                title={`Penjualan: ${salesPercent}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${expensePercent}%` }}
                title={`Pengeluaran: ${expensePercent}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Penjualan ({salesPercent}%)</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Pengeluaran ({expensePercent}%)</span>
              </span>
            </div>
          </div>

          {/* Key Metrics grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Penjualan</span>
              <p className="text-base font-extrabold text-emerald-600">{formatRupiah(metrics.penjualanHariIni)}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Pengeluaran</span>
              <p className="text-base font-extrabold text-rose-600">{formatRupiah(metrics.pengeluaranHariIni)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: 4 Key Metric Cards (Matching Screenshot 4 stat cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="KAS WARUNG"
          amount={metrics.kasWarung}
          icon={Wallet}
          variant="slate"
          isNegativeAllowed={true}
          subtitle="Saldo uang di laci kas saat ini"
        />

        <MetricCard
          title="TOTAL TABUNGAN"
          amount={metrics.totalTabungan}
          icon={PiggyBank}
          variant="blue"
          subtitle="Dana aman yang dipisahkan"
        />

        <MetricCard
          title="PENJUALAN HARI INI"
          amount={metrics.penjualanHariIni}
          icon={TrendingUp}
          variant="emerald"
          subtitle="Total omset penjualan hari ini"
        />

        <MetricCard
          title="PENGELUARAN HARI INI"
          amount={metrics.pengeluaranHariIni}
          icon={TrendingDown}
          variant="rose"
          subtitle="Belanja stok, makan & keperluan"
        />
      </div>

      {/* LOWER SECTION: Standings List (Left 7 cols) & Featured Callout Banner (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LOWER LEFT: Rincian Aktivitas Hari Ini (7 cols) */}
        <div className="lg:col-span-7">
          <TodaySummary />
        </div>

        {/* LOWER RIGHT: Featured Banner Card (5 cols) matching CoachPro banner */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Recent Tx Mini Card */}
          <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-5 shadow-xl shadow-slate-200/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm">Transaksi Terakhir</h3>
              <Link href="/transaksi" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1">
                <span>Lihat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentTx.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada transaksi</p>
              ) : (
                recentTx.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{tx.description || tx.category}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{formatTime(tx.transaction_date)} • {tx.category}</span>
                    </div>
                    <span className={`text-xs font-black ${tx.type === 'penjualan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'penjualan' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Featured Gradient Banner (Matching CoachPro bottom right banner) */}
          <div className="bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-900/30 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/20 mb-1">
                <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
                Sesi Malam Warung
              </span>
              <h3 className="text-xl font-black leading-tight">Selesaikan Tutup Hari Ini</h3>
              <p className="text-xs text-teal-100/90 leading-relaxed max-w-xs">
                Pindahkan sisa uang kas ke Tabungan & reset kas menjadi Rp0 untuk memulai hari besok.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button
                onClick={openDailyClose}
                className="py-2.5 px-5 bg-white text-teal-900 hover:bg-teal-50 font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
              >
                <span>Lakukan Tutup Hari</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
