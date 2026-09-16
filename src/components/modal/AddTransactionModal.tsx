'use client';

import React, { useState, useEffect } from 'react';
import { X, PlusCircle, MinusCircle, Check } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { TransactionType, ExpenseCategory } from '@/types';
import { formatInputNumber, parseNominal } from '@/lib/utils';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Belanja Stok',
  'Makan',
  'Es',
  'Uang Orang Tua',
  'Keperluan Warung',
  'Keperluan Pribadi',
  'Lainnya',
];

const QUICK_PRESETS = [5000, 10000, 20000, 50000, 100000, 200000, 500000];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'penjualan',
}) => {
  const { addTransaction } = useWarung();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amountInput, setAmountInput] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Belanja Stok');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setAmountInput('');
      setDescription('');
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().split(' ')[0].substring(0, 5));
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const handlePreset = (val: number) => {
    const currentNum = parseNominal(amountInput);
    const newNum = currentNum + val;
    setAmountInput(formatInputNumber(newNum));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseNominal(amountInput);
    if (!nominal || nominal <= 0) return;

    setIsSubmitting(true);
    try {
      const transactionDate = `${date}T${time}:00.000Z`;
      const cat = type === 'penjualan' ? 'Penjualan Warung' : category;

      await addTransaction({
        type,
        category: cat,
        amount: nominal,
        description: description.trim(),
        transaction_date: transactionDate,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Catat Transaksi</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('penjualan')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'penjualan'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Penjualan</span>
            </button>
            <button
              type="button"
              onClick={() => setType('pengeluaran')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'pengeluaran'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>− Pengeluaran</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Nominal (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                Rp
              </span>
              <input
                type="text"
                required
                placeholder="0"
                value={amountInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = parseNominal(raw);
                  setAmountInput(num ? formatInputNumber(num) : '');
                }}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_PRESETS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition-colors"
                >
                  +{val >= 1000 ? `${val / 1000}rb` : val}
                </button>
              ))}
              {amountInput && (
                <button
                  type="button"
                  onClick={() => setAmountInput('')}
                  className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors ml-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Selector (for Pengeluaran) */}
          {type === 'pengeluaran' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Kategori Pengeluaran *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between ${
                      category === cat
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-1 ring-rose-500'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <Check className="w-3.5 h-3.5 text-rose-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Jam
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder={
                type === 'penjualan'
                  ? 'Contoh: Penjualan mi goreng & kopi'
                  : 'Contoh: Belanja beras 2 karung'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !parseNominal(amountInput)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                type === 'penjualan'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
