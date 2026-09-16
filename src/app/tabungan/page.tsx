'use client';

import React from 'react';
import { PiggyBank, PlusCircle, Sparkles, History, ShieldCheck } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatDate, formatRupiah, formatTime } from '@/lib/utils';

interface PageProps {
  onOpenAddSavings?: () => void;
}

export default function TabunganPage({ onOpenAddSavings }: PageProps) {
  const { savingsHistory, metrics, isLoaded } = useWarung();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Tabungan Warung
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Uang sisa kas harian yang benar-benar telah dipisahkan dari operasional warung
          </p>
        </div>

        <button
          onClick={onOpenAddSavings}
          className="flex items-center justify-center space-x-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Setor Manual ke Tabungan</span>
        </button>
      </div>

      {/* Main Tabungan Banner Card */}
      <div className="bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Dana Terpisah & Aman</span>
            </div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tabungan Saat Ini
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {formatRupiah(metrics.totalTabungan)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm text-xs leading-relaxed text-slate-200">
            💡 <strong>Prinsip Tabungan Warung:</strong> Tabungan berasal dari sisa uang kas setiap malam saat <strong>Tutup Hari</strong>. Tabungan tidak otomatis terpakai ketika kas warung minus.
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Riwayat Setoran Tabungan</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {savingsHistory.length} Catatan
          </span>
        </div>

        {savingsHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <PiggyBank className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Belum ada riwayat tabungan</p>
            <p className="text-xs text-slate-400">
              Lakukan Tutup Hari ketika ada sisa kas untuk mengisi tabungan
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-5">Tanggal & Jam</th>
                    <th className="py-3 px-5">Sumber</th>
                    <th className="py-3 px-5">Keterangan</th>
                    <th className="py-3 px-5 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {savingsHistory.map((svg) => (
                    <tr key={svg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-medium text-slate-700 whitespace-nowrap">
                        <div>{formatDate(svg.transaction_date)}</div>
                        <div className="text-xs text-slate-400">{formatTime(svg.transaction_date)}</div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            svg.source_type === 'tutup_hari'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {svg.source_type === 'tutup_hari' ? (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              Sisa Kas Hari Ini
                            </>
                          ) : (
                            'Setoran Manual'
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-800 font-semibold">
                        {svg.description}
                      </td>

                      <td className="py-4 px-5 text-right font-black text-blue-600 text-base">
                        +{formatRupiah(svg.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {savingsHistory.map((svg) => (
                <div key={svg.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        svg.source_type === 'tutup_hari'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {svg.source_type === 'tutup_hari' ? 'Sisa Kas Hari Ini' : 'Manual'}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(svg.transaction_date)}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-800">{svg.description}</p>

                  <div className="text-right text-base font-black text-blue-600">
                    +{formatRupiah(svg.amount)}
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
