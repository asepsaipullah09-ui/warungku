'use client';

import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatDate, formatTime, formatRupiah, isToday, isSameDay } from '@/lib/utils';
import { TransactionType, ExpenseCategory } from '@/types';

interface PageProps {
  onOpenAddTx?: (type: TransactionType) => void;
}

export default function TransaksiPage({ onOpenAddTx }: PageProps) {
  const { transactions, deleteTransaction, isLoaded } = useWarung();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('semua');

  // Filter Logic
  const filteredTx = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'semua' && tx.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== 'semua' && tx.category !== selectedCategory) return false;

      // Date filter
      if (selectedDateFilter === 'hari_ini') {
        if (!isToday(tx.transaction_date)) return false;
      } else if (selectedDateFilter === 'kemarin') {
        const yesterdayObj = new Date();
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        if (!isSameDay(tx.transaction_date, yesterdayObj.toISOString())) return false;
      } else if (selectedDateFilter === '7_hari') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (new Date(tx.transaction_date) < sevenDaysAgo) return false;
      } else if (selectedDateFilter === 'bulan_ini') {
        const now = new Date();
        const txDate = new Date(tx.transaction_date);
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(q);
        const matchCat = tx.category.toLowerCase().includes(q);
        const matchAmount = tx.amount.toString().includes(q);
        if (!matchDesc && !matchCat && !matchAmount) return false;
      }

      return true;
    });
  }, [transactions, selectedType, selectedCategory, selectedDateFilter, searchTerm]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Add Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Semua catatan penjualan, pengeluaran, dan tabungan warung
          </p>
        </div>

        <button
          onClick={() => onOpenAddTx?.('penjualan')}
          className="flex items-center justify-center space-x-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Catat Transaksi Baru</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan catatan, kategori, atau nominal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Filter Jenis */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Jenis Transaksi
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none"
            >
              <option value="semua">Semua Jenis</option>
              <option value="penjualan">Penjualan (+)</option>
              <option value="pengeluaran">Pengeluaran (-)</option>
              <option value="tabungan">Tabungan</option>
            </select>
          </div>

          {/* Filter Periode Tanggal */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Periode Waktu
            </label>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none"
            >
              <option value="semua">Semua Waktu</option>
              <option value="hari_ini">Hari Ini</option>
              <option value="kemarin">Kemarin</option>
              <option value="7_hari">7 Hari Terakhir</option>
              <option value="bulan_ini">Bulan Ini</option>
            </select>
          </div>

          {/* Filter Kategori */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none"
            >
              <option value="semua">Semua Kategori</option>
              <option value="Penjualan Warung">Penjualan Warung</option>
              <option value="Belanja Stok">Belanja Stok</option>
              <option value="Makan">Makan</option>
              <option value="Es">Es</option>
              <option value="Uang Orang Tua">Uang Orang Tua</option>
              <option value="Keperluan Warung">Keperluan Warung</option>
              <option value="Keperluan Pribadi">Keperluan Pribadi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Menampilkan {filteredTx.length} Transaksi
          </span>
        </div>

        {filteredTx.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada transaksi ditemukan</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci atau filter pencarian Anda</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Tanggal & Jam</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Catatan</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        <div>{formatDate(tx.transaction_date)}</div>
                        <div className="text-xs text-slate-400">{formatTime(tx.transaction_date)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            tx.type === 'penjualan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.type === 'pengeluaran'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tx.type === 'penjualan' ? (
                            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {tx.category}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {tx.description || '-'}
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                          tx.type === 'penjualan'
                            ? 'text-emerald-600'
                            : tx.type === 'pengeluaran'
                            ? 'text-rose-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {tx.type === 'penjualan' ? '+' : '-'}
                        {formatRupiah(tx.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          tx.type === 'penjualan'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.type === 'pengeluaran'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <span className="capitalize">{tx.type}</span>
                      </span>
                      <span className="text-xs font-bold text-slate-800">{tx.category}</span>
                    </div>

                    <span
                      className={`text-sm font-black ${
                        tx.type === 'penjualan'
                          ? 'text-emerald-600'
                          : tx.type === 'pengeluaran'
                          ? 'text-rose-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {tx.type === 'penjualan' ? '+' : '-'}
                      {formatRupiah(tx.amount)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{tx.description || '-'}</p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>
                      {formatDate(tx.transaction_date)}, {formatTime(tx.transaction_date)}
                    </span>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-rose-500 hover:text-rose-700 font-semibold p-1"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
