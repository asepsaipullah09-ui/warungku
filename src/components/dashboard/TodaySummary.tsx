'use client';

import React from 'react';
import { ShoppingCart, Utensils, IceCream, HeartHandshake, Wrench, User, MoreHorizontal, TrendingUp, Layers } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatRupiah, isToday } from '@/lib/utils';
import { ExpenseCategory } from '@/types';

export const TodaySummary: React.FC = () => {
  const { transactions } = useWarung();

  // Filter today's transactions
  const todayTx = transactions.filter((tx) => isToday(tx.transaction_date));

  // Category totals & counts
  const categoryStats: Record<string, { amount: number; count: number }> = {
    Penjualan: { amount: 0, count: 0 },
    'Belanja Stok': { amount: 0, count: 0 },
    Makan: { amount: 0, count: 0 },
    Es: { amount: 0, count: 0 },
    'Uang Orang Tua': { amount: 0, count: 0 },
    'Keperluan Warung': { amount: 0, count: 0 },
    'Keperluan Pribadi': { amount: 0, count: 0 },
    Lainnya: { amount: 0, count: 0 },
  };

  todayTx.forEach((tx) => {
    if (tx.type === 'penjualan') {
      categoryStats['Penjualan'].amount += tx.amount;
      categoryStats['Penjualan'].count += 1;
    } else if (tx.type === 'pengeluaran') {
      const cat = tx.category as ExpenseCategory;
      if (categoryStats[cat]) {
        categoryStats[cat].amount += tx.amount;
        categoryStats[cat].count += 1;
      } else {
        categoryStats['Lainnya'].amount += tx.amount;
        categoryStats['Lainnya'].count += 1;
      }
    }
  });

  const categoryItems = [
    { rank: 1, name: 'Penjualan', amount: categoryStats['Penjualan'].amount, count: categoryStats['Penjualan'].count, icon: TrendingUp, color: 'emerald' },
    { rank: 2, name: 'Belanja Stok', amount: categoryStats['Belanja Stok'].amount, count: categoryStats['Belanja Stok'].count, icon: ShoppingCart, color: 'blue' },
    { rank: 3, name: 'Makan', amount: categoryStats['Makan'].amount, count: categoryStats['Makan'].count, icon: Utensils, color: 'amber' },
    { rank: 4, name: 'Es', amount: categoryStats['Es'].amount, count: categoryStats['Es'].count, icon: IceCream, color: 'cyan' },
    { rank: 5, name: 'Uang Orang Tua', amount: categoryStats['Uang Orang Tua'].amount, count: categoryStats['Uang Orang Tua'].count, icon: HeartHandshake, color: 'rose' },
    { rank: 6, name: 'Keperluan Warung', amount: categoryStats['Keperluan Warung'].amount, count: categoryStats['Keperluan Warung'].count, icon: Wrench, color: 'indigo' },
    { rank: 7, name: 'Keperluan Pribadi', amount: categoryStats['Keperluan Pribadi'].amount, count: categoryStats['Keperluan Pribadi'].count, icon: User, color: 'violet' },
    { rank: 8, name: 'Lainnya', amount: categoryStats['Lainnya'].amount, count: categoryStats['Lainnya'].count, icon: MoreHorizontal, color: 'slate' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <h3 className="font-extrabold text-slate-800 text-base">Rincian Aktivitas Hari Ini</h3>
        </div>
        <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          {todayTx.length} Transaksi Hari Ini
        </span>
      </div>

      {/* Table Format matching Standings table in Screenshot */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Kategori</th>
              <th className="py-2.5 px-3 text-center">Jumlah</th>
              <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isSales = item.name === 'Penjualan';
              const hasAmount = item.amount > 0;

              return (
                <tr
                  key={item.name}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    hasAmount ? 'font-semibold' : 'text-slate-400 opacity-60'
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-400">{item.rank}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSales
                            ? 'bg-emerald-100 text-emerald-700'
                            : hasAmount
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`font-bold ${isSales ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-600">
                      {item.count}x
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-black ${
                      isSales
                        ? 'text-emerald-600'
                        : hasAmount
                        ? 'text-rose-600'
                        : 'text-slate-300'
                    }`}
                  >
                    {formatRupiah(item.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
