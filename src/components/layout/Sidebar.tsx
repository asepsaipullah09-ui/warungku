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
    <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col overflow-y-auto border-r border-white/70 bg-white/55 p-5 backdrop-blur-2xl md:flex lg:w-[260px] lg:p-6">
      {/* Sidebar Logo / Brand */}
      <div className="mb-10 flex items-center space-x-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 text-white shadow-lg shadow-teal-500/30">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
            Warung<span className="text-teal-600">Ku</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">Keuangan Warung</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3.5 rounded-[14px] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'scale-[1.02] bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-600/25'
                  : 'text-slate-600 hover:bg-white/80 hover:text-teal-700 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Info Highlight Box */}
      <div className="mt-auto rounded-[18px] border border-teal-200/50 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 p-4 shadow-sm">
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
