'use client';

import React from 'react';
import { Search, Bell, Database, HardDrive, Sparkles } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatDate } from '@/lib/utils';

export const Header: React.FC = () => {
  const { isSupabase, metrics } = useWarung();
  const todayStr = new Date().toISOString();

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Welcome Greeting & Date */}
        <div>
          <span className="text-xs font-semibold text-teal-700 flex items-center space-x-1.5">
            <span>Selamat datang kembali, Pemilik Warung</span>
            <span>👋</span>
          </span>
          <h1 className="font-black text-2xl text-slate-800 tracking-tight mt-0.5">
            Dashboard <span className="text-slate-400 font-medium text-lg hidden sm:inline">| {formatDate(todayStr)}</span>
          </h1>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Badge */}
          {metrics.hariIniSudahTutup ? (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Hari Sudah Ditutup
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 shadow-sm">
              Hari Masih Berjalan
            </span>
          )}

          {/* Database Mode Badge */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
              isSupabase
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isSupabase ? <Database className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSupabase ? 'Cloud Supabase' : 'Offline Mode'}</span>
          </div>

          {/* Icon Actions */}
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 p-0.5 shadow-md">
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
