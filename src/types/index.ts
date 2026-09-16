export type TransactionType = 'penjualan' | 'pengeluaran' | 'tabungan';

export type ExpenseCategory =
  | 'Belanja Stok'
  | 'Makan'
  | 'Es'
  | 'Uang Orang Tua'
  | 'Keperluan Warung'
  | 'Keperluan Pribadi'
  | 'Lainnya';

export type SalesCategory = 'Penjualan Warung';

export type TransactionCategory = ExpenseCategory | SalesCategory | 'Transfer Tabungan';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  transaction_date: string; // ISO string or format YYYY-MM-DD HH:mm
  created_at?: string;
}

export interface SavingsRecord {
  id: string;
  amount: number;
  description: string;
  source_type: 'tutup_hari' | 'manual';
  transaction_date: string;
  created_at?: string;
}

export interface DailyClosing {
  id: string;
  closing_date: string; // YYYY-MM-DD
  total_sales: number;
  total_expenses: number;
  remaining_cash: number;
  transferred_to_savings: number;
  is_closed: boolean;
  created_at?: string;
}

export interface DashboardMetrics {
  kasWarung: number;
  totalTabungan: number;
  penjualanHariIni: number;
  pengeluaranHariIni: number;
  sisaHariIni: number;
  pengeluaranBulanIni: number;
  penjualanBulanIni: number;
  hariIniSudahTutup: boolean;
}

export type ReportPeriod = 'hari_ini' | 'kemarin' | '7_hari' | 'bulan_ini' | 'custom';
