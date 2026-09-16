import { Transaction, SavingsRecord, DailyClosing } from '@/types';

const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const yesterdayObj = new Date();
yesterdayObj.setDate(yesterdayObj.getDate() - 1);
const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

const dayBeforeObj = new Date();
dayBeforeObj.setDate(dayBeforeObj.getDate() - 2);
const dayBeforeStr = dayBeforeObj.toISOString().split('T')[0];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Transaksi Hari Ini
  {
    id: 'tx-101',
    type: 'penjualan',
    category: 'Penjualan Warung',
    amount: 250000,
    description: 'Penjualan warung sesi sore',
    transaction_date: `${todayStr}T17:15:00.000Z`,
  },
  {
    id: 'tx-102',
    type: 'penjualan',
    category: 'Penjualan Warung',
    amount: 450000,
    description: 'Penjualan warung sesi siang',
    transaction_date: `${todayStr}T13:30:00.000Z`,
  },
  {
    id: 'tx-103',
    type: 'pengeluaran',
    category: 'Es',
    amount: 20000,
    description: 'Beli es batu & sedotan',
    transaction_date: `${todayStr}T11:45:00.000Z`,
  },
  {
    id: 'tx-104',
    type: 'pengeluaran',
    category: 'Makan',
    amount: 30000,
    description: 'Makan siang & teh manis',
    transaction_date: `${todayStr}T12:15:00.000Z`,
  },
  {
    id: 'tx-105',
    type: 'pengeluaran',
    category: 'Belanja Stok',
    amount: 500000,
    description: 'Belanja beras, minyak goreng & mi instan di agen',
    transaction_date: `${todayStr}T08:30:00.000Z`,
  },

  // Transaksi Kemarin (15 Sep)
  {
    id: 'tx-201',
    type: 'penjualan',
    category: 'Penjualan Warung',
    amount: 1000000,
    description: 'Total penjualan harian',
    transaction_date: `${yesterdayStr}T20:00:00.000Z`,
  },
  {
    id: 'tx-202',
    type: 'pengeluaran',
    category: 'Belanja Stok',
    amount: 500000,
    description: 'Kulakan rokok & minuman kemasan',
    transaction_date: `${yesterdayStr}T09:00:00.000Z`,
  },
  {
    id: 'tx-203',
    type: 'pengeluaran',
    category: 'Uang Orang Tua',
    amount: 100000,
    description: 'Uang mingguan untuk Ibu',
    transaction_date: `${yesterdayStr}T14:00:00.000Z`,
  },
  {
    id: 'tx-204',
    type: 'pengeluaran',
    category: 'Keperluan Warung',
    amount: 150000,
    description: 'Isi ulang tabung gas 3kg (2x) & kantong plastik',
    transaction_date: `${yesterdayStr}T10:30:00.000Z`,
  },
  {
    id: 'tx-205',
    type: 'pengeluaran',
    category: 'Makan',
    amount: 35000,
    description: 'Nasi padang & es jeruk',
    transaction_date: `${yesterdayStr}T12:45:00.000Z`,
  },
  {
    id: 'tx-206',
    type: 'pengeluaran',
    category: 'Es',
    amount: 15000,
    description: 'Beli es batu kristal',
    transaction_date: `${yesterdayStr}T15:00:00.000Z`,
  },

  // Transaksi 2 Hari Lalu (14 Sep)
  {
    id: 'tx-301',
    type: 'penjualan',
    category: 'Penjualan Warung',
    amount: 850000,
    description: 'Penjualan harian',
    transaction_date: `${dayBeforeStr}T20:00:00.000Z`,
  },
  {
    id: 'tx-302',
    type: 'pengeluaran',
    category: 'Belanja Stok',
    amount: 450000,
    description: 'Belanja sabun, shampoo & bumbu dapur',
    transaction_date: `${dayBeforeStr}T09:30:00.000Z`,
  },
  {
    id: 'tx-303',
    type: 'pengeluaran',
    category: 'Keperluan Pribadi',
    amount: 50000,
    description: 'Beli pulsa HP warung',
    transaction_date: `${dayBeforeStr}T16:00:00.000Z`,
  },
];

export const INITIAL_SAVINGS_HISTORY: SavingsRecord[] = [
  {
    id: 'svg-101',
    amount: 200000,
    description: 'Sisa kas hari ini (Tutup Hari 15 Sep 2026)',
    source_type: 'tutup_hari',
    transaction_date: `${yesterdayStr}T21:00:00.000Z`,
  },
  {
    id: 'svg-102',
    amount: 150000,
    description: 'Sisa kas hari ini (Tutup Hari 14 Sep 2026)',
    source_type: 'tutup_hari',
    transaction_date: `${dayBeforeStr}T21:00:00.000Z`,
  },
  {
    id: 'svg-100',
    amount: 2100000,
    description: 'Saldo awal tabungan warung',
    source_type: 'manual',
    transaction_date: `${dayBeforeStr}T08:00:00.000Z`,
  },
];

export const INITIAL_DAILY_CLOSINGS: DailyClosing[] = [
  {
    id: 'dc-101',
    closing_date: yesterdayStr,
    total_sales: 1000000,
    total_expenses: 800000,
    remaining_cash: 200000,
    transferred_to_savings: 200000,
    is_closed: true,
  },
  {
    id: 'dc-102',
    closing_date: dayBeforeStr,
    total_sales: 850000,
    total_expenses: 700000,
    remaining_cash: 150000,
    transferred_to_savings: 150000,
    is_closed: true,
  },
];
