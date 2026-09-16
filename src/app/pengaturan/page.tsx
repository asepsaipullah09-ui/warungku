'use client';

import React, { useState } from 'react';
import { Settings, Database, RefreshCw, Download, Upload, CheckCircle, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';

export default function PengaturanPage() {
  const {
    isSupabase,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    transactions,
    savingsHistory,
    dailyClosings,
  } = useWarung();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warungku_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Data berhasil diimpor!');
        } else {
          setImportStatus('Gagal mengimpor data. Format JSON tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Pengaturan & Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Pengelolaan koneksi database, cadangan data JSON, dan informasi aturan keuangan warung
        </p>
      </div>

      {/* Financial Rules Cheatsheet */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-2xl text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg text-emerald-400">Aturan Perputaran Keuangan WarungKu</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">1. Saldo Kas Boleh Minus</span>
            <p className="text-slate-300">
              Belanja stok, makan, es, atau pengeluaran di awal hari membuat kas minus. Kas minus **bukan error**, dan akan tertutup oleh penjualan sepanjang hari.
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">2. Tutup Hari Malam Sisa Kas ke Tabungan</span>
            <p className="text-slate-300">
              Jika kas positif pada malam hari saat Tutup Hari, sisa kas dipindahkan ke Tabungan dan Kas di-reset ke **Rp0**.
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">3. Kas Minus Tidak Transfer ke Tabungan</span>
            <p className="text-slate-300">
              Jika kas minus/nol saat Tutup Hari, tidak ada transfer ke Tabungan. Kas tetap minus untuk dilanjutkan keesokan harinya.
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">4. Tabungan Terpisah dari Operasional</span>
            <p className="text-slate-300">
              Tabungan tidak dianggap sebagai modal dan tidak digunakan otomatis untuk menutup saldo kas yang minus.
            </p>
          </div>
        </div>
      </div>

      {/* Database Status Card */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Status Database Storage</h3>
              <p className="text-xs text-slate-500">
                {isSupabase
                  ? 'Terhubung dengan PostgreSQL Supabase'
                  : 'Mode LocalStorage (Tersimpan di Peramban Web)'}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isSupabase
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isSupabase ? 'Cloud Supabase Active' : 'LocalStorage Offline'}
          </span>
        </div>

        {!isSupabase && (
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Ingin Menghubungkan Supabase Cloud?</span>
            </div>
            <p className="leading-relaxed">
              Cukup isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di file <code>.env.local</code> proyek ini, kemudian jalankan script di <code>supabase/schema.sql</code>.
            </p>
          </div>
        )}
      </div>

      {/* Backup & Data Management */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Cadangan & Pemulihan Data (JSON)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data ke File JSON</span>
          </button>

          {/* Import Button */}
          <label className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl cursor-pointer border border-slate-300 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Impor Data dari File JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            {importStatus}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Jumlah Transaksi: <strong>{transactions.length}</strong></span>
          <span>Catatan Tabungan: <strong>{savingsHistory.length}</strong></span>
          <span>Sesi Tutup Hari: <strong>{dailyClosings.length}</strong></span>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white border border-rose-200 p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold text-base">Reset ke Data Contoh Demo</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Tombol ini akan me-reset seluruh data transaksi, tabungan, dan tutup hari kembali ke data contoh warung default.
        </p>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data demo?')) {
              resetToDemoData();
              alert('Data berhasil di-reset ke data demo!');
            }
          }}
          className="flex items-center space-x-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Data ke Contoh Demo</span>
        </button>
      </div>
    </div>
  );
}
