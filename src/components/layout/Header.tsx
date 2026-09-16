'use client';

import React from 'react';
import { Search, Bell, Database, HardDrive, Sparkles } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatDate } from '@/lib/utils';

export const Header: React.FC = () => {
  const { isSupabase, metrics } = useWarung();
  const todayStr = new Date().toISOString();

  return (
    <header className="sticky top-0 z-30 border-b border-white/75 bg-white/45 px-4 py-4 backdrop-blur-2xl transition-all lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        {/* Welcome Greeting & Date */}
        <div>
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-teal-700">
            <span>Selamat datang kembali, Pemilik Warung</span>
            <span>👋</span>
          </span>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-800">
            Dashboard <span className="text-slate-400 font-medium text-lg hidden sm:inline">| {formatDate(todayStr)}</span>
          </h1>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Status Badge */}
          {metrics.hariIniSudahTutup ? (
            <span className="hidden items-center rounded-full border border-emerald-300/60 bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm sm:inline-flex">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Hari Sudah Ditutup
            </span>
          ) : (
            <span className="hidden items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 shadow-sm sm:inline-flex">
              Hari Masih Berjalan
            </span>
          )}

          {/* Database Mode Badge */}
          <div
            className={`flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm ${
              isSupabase
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isSupabase ? <Database className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSupabase ? 'Cloud Supabase' : 'Offline Mode'}</span>
          </div>

          {/* Icon Actions */}
          <button aria-label="Cari" className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Notifikasi" className="relative rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-xs text-teal-700">
                W
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-700">Warungku</span>
          </div>
        </div>
      </div>
    </header>
  );
};
