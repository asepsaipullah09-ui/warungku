'use client';

import React, { useState } from 'react';
import { X, Moon, PiggyBank, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWarung } from '@/context/WarungContext';
import { formatRupiah } from '@/lib/utils';

interface DailyCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyCloseModal: React.FC<DailyCloseModalProps> = ({ isOpen, onClose }) => {
  const { metrics, executeTutupHari } = useWarung();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const isPositive = metrics.kasWarung > 0;
  const sisaKas = metrics.kasWarung;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti effect unavailable', e);
    }
  };

  const handleConfirmCloseDay = async () => {
    setIsSubmitting(true);
    try {
      const result = await executeTutupHari();
      if (result.wasPositive) {
        triggerConfetti();
      }
      setIsDone(true);
    } catch (err) {
      console.error('Error executing Tutup Hari:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Tutup Hari Sesi Malam</h2>
              <p className="text-xs text-slate-400">Rekapitulasi Uang Kas Warung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {isDone ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Hari Ini Resmi Ditutup!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {isPositive ? (
                    <>
                      Sebesar <span className="font-bold text-emerald-600">{formatRupiah(sisaKas)}</span> telah dipindahkan ke <span className="font-bold text-slate-800">Tabungan</span>. Kas warung kembali menjadi <span className="font-bold text-slate-800">Rp0</span> untuk memulai hari esok.
                    </>
                  ) : (
                    <>
                      Saldo Kas tetap <span className="font-bold text-amber-600">{formatRupiah(sisaKas)}</span> dan akan dilanjutkan esok hari untuk tertutup oleh penjualan.
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
              >
                Selesai
              </button>
            </div>
          ) : (
            /* Closing Overview */
            <>
              {/* Summary Cards */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ringkasan Transaksi Hari Ini
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Penjualan Hari Ini</span>
                    <p className="text-base font-bold text-emerald-600">
                      {formatRupiah(metrics.penjualanHariIni)}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Pengeluaran Hari Ini</span>
                    <p className="text-base font-bold text-rose-600">
                      {formatRupiah(metrics.pengeluaranHariIni)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Saldo Kas Akhir Saat Ini:</span>
                  <span
                    className={`text-lg font-extrabold ${
                      isPositive
                        ? 'text-emerald-600'
                        : sisaKas < 0
                        ? 'text-rose-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {formatRupiah(sisaKas)}
                  </span>
                </div>
              </div>

              {/* Conditional Action Banner */}
              {isPositive ? (
                /* Positive Cash -> Transfer to Savings */
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 text-sm">
                        Sisa Uang Hari Ini: {formatRupiah(sisaKas)}
                      </h4>
                      <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">
                        Sesuai aturan warung, seluruh sisa kas akhir hari ini akan dipindahkan ke <strong>Tabungan</strong> dan Kas Warung akan di-reset menjadi <strong>Rp0</strong> untuk besok.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-100 flex items-center justify-between text-xs font-semibold">
                    <div className="text-slate-600">
                      Kas: <span className="font-bold text-emerald-600">{formatRupiah(sisaKas)}</span> → <span className="font-bold text-slate-800">Rp0</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <div className="text-slate-600">
                      Tabungan: +<span className="font-bold text-emerald-600">{formatRupiah(sisaKas)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Negative or Zero Cash -> No Transfer */
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">
                        Belum ada sisa untuk ditabung
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                        Saldo kas saat ini adalah <strong>{formatRupiah(sisaKas)}</strong>. Karena saldo tidak positif, <strong>tidak ada uang yang dipindahkan ke Tabungan</strong>. Saldo minus/nol akan tetap berada di Kas Warung untuk tertutup penjualan berikutnya.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmCloseDay}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg text-sm transition-all ${
                    isPositive
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                      : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'
                  } disabled:opacity-50`}
                >
                  {isSubmitting
                    ? 'Proses...'
                    : isPositive
                    ? 'Masukkan Sisa ke Tabungan'
                    : 'Tutup Hari (Tanpa Menabung)'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
