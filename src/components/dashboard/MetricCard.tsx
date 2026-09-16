'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant?: 'emerald' | 'blue' | 'rose' | 'amber' | 'slate';
  subtitle?: string;
  isNegativeAllowed?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  icon: Icon,
  variant = 'slate',
  subtitle,
  isNegativeAllowed = false,
}) => {
  const isNegative = amount < 0;

  // Aesthetic Pastel Icon Palette matching screenshot
  const getVariantStyles = () => {
    if (isNegativeAllowed && isNegative) {
      return {
        cardBorder: 'border-rose-200/80 bg-rose-50/40 hover:bg-rose-50/70',
        iconBg: 'bg-rose-500 text-white shadow-md shadow-rose-200',
        amountColor: 'text-rose-600',
        labelColor: 'text-rose-600',
      };
    }

    switch (variant) {
      case 'emerald':
        return {
          cardBorder: 'border-white/80 bg-white/90 hover:bg-white',
          iconBg: 'bg-emerald-100 text-emerald-700 shadow-sm',
          amountColor: 'text-slate-800',
          labelColor: 'text-slate-500',
        };
      case 'blue':
        return {
          cardBorder: 'border-white/80 bg-white/90 hover:bg-white',
          iconBg: 'bg-indigo-100 text-indigo-700 shadow-sm',
          amountColor: 'text-slate-800',
          labelColor: 'text-slate-500',
        };
      case 'rose':
        return {
          cardBorder: 'border-white/80 bg-white/90 hover:bg-white',
          iconBg: 'bg-rose-100 text-rose-600 shadow-sm',
          amountColor: 'text-slate-800',
          labelColor: 'text-slate-500',
        };
      case 'amber':
        return {
          cardBorder: 'border-white/80 bg-white/90 hover:bg-white',
          iconBg: 'bg-amber-100 text-amber-700 shadow-sm',
          amountColor: 'text-slate-800',
          labelColor: 'text-slate-500',
        };
      default:
        return {
          cardBorder: 'border-white/80 bg-white/90 hover:bg-white',
          iconBg: 'bg-teal-100 text-teal-700 shadow-sm',
          amountColor: 'text-slate-800',
          labelColor: 'text-slate-500',
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 shadow-md shadow-slate-200/40 flex flex-col justify-between ${style.cardBorder}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-extrabold uppercase tracking-wider ${style.labelColor}`}>
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className={`text-2xl sm:text-3xl font-black tracking-tight ${style.amountColor}`}>
          {formatRupiah(amount)}
        </div>

        {isNegativeAllowed && isNegative && (
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/60">
            <span>Kas terpakai (Tertutup penjualan)</span>
          </div>
        )}

        {subtitle && !isNegative && (
          <p className="text-[11px] text-slate-400 font-semibold mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
