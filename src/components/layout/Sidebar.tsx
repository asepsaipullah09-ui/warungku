'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, PiggyBank, BarChart3, Settings, Store, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transaksi', href: '/transaksi', icon: ReceiptText },
    { name: 'Tabungan', href: '/tabungan', icon: PiggyBank },
    { name: 'Laporan', href: '/laporan', icon: BarChart3 },
    { name: 'Pengaturan', href: '/pengaturan', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-xl min-h-[calc(100vh-73px)] p-6 border-r border-slate-200/60 shrink-0">
      {/* Sidebar Logo / Brand */}
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl text-slate-800 tracking-tight">
            Warung<span className="text-teal-600">Ku</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">Keuangan Warung</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-600/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-teal-700 hover:bg-white/80 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Info Highlight Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-200/50 mt-auto shadow-sm">
        <div className="flex items-center space-x-2 text-teal-800 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Tips Kas Minus</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Kas minus adalah hal wajar saat belanja stok di awal hari. Kas akan tertutup otomatis oleh hasil penjualan.
        </p>
      </div>
    </aside>
  );
};
