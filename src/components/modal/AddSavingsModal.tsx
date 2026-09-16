'use client';

import React, { useState } from 'react';
import { X, PiggyBank } from 'lucide-react';
import { useWarung } from '@/context/WarungContext';
import { formatInputNumber, parseNominal } from '@/lib/utils';

interface AddSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSavingsModal: React.FC<AddSavingsModalProps> = ({ isOpen, onClose }) => {
  const { addManualSavings } = useWarung();
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseNominal(amountInput);
    if (!nominal || nominal <= 0) return;

    setIsSubmitting(true);
    try {
      await addManualSavings(
        nominal,
        description.trim() || 'Setoran manual ke tabungan'
      );
      setAmountInput('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <PiggyBank className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Setor ke Tabungan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Nominal Setoran (Rp) *
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
                  const num = parseNominal(e.target.value);
                  setAmountInput(num ? formatInputNumber(num) : '');
                }}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Tabungan dari modal luar, keuntungan tambahan, dll."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

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
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah Tabungan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
