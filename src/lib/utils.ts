import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format mata uang Rupiah Indonesia
 * Contoh: 150000 -> "Rp 150.000"
 * Contoh: -350000 -> "-Rp 350.000"
 */
export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absAmount);

  // formatted normally starts with "Rp" or "Rp "
  const cleanFormat = formatted.replace(/^Rp\s?/, 'Rp ');

  return isNegative ? `-${cleanFormat}` : cleanFormat;
}

/**
 * Format tanggal ISO ke format Indonesia pendek (contoh: 16 Sep 2026)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format waktu ke HH:mm (contoh: 14:30)
 */
export function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Mendapatkan string tanggal hari ini YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Memeriksa apakah tanggal ISO berada pada hari ini
 */
export function isSameDay(dateStr1: string, dateStr2: string): boolean {
  if (!dateStr1 || !dateStr2) return false;
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(dateStr: string): boolean {
  return isSameDay(dateStr, new Date().toISOString());
}

/**
 * Parse input string angka dengan pemisah ribuan
 */
export function parseNominal(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Format input string menjadi format angka dengan titik
 */
export function formatInputNumber(value: number | string): string {
  if (!value && value !== 0) return '';
  const num = typeof value === 'string' ? parseNominal(value) : value;
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('id-ID').format(num);
}
