-- Schema SQL untuk Supabase PostgreSQL Application WarungKu

-- 1. Table: transactions (Pencatatan Penjualan & Pengeluaran)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('penjualan', 'pengeluaran', 'tabungan')),
  category VARCHAR(50) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: savings (Pencatatan Riwayat Tabungan)
CREATE TABLE IF NOT EXISTS savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(15, 2) NOT NULL,
  description TEXT NOT NULL,
  source_type VARCHAR(20) DEFAULT 'tutup_hari' CHECK (source_type IN ('tutup_hari', 'manual')),
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: daily_closings (Pencatatan Sesi Tutup Hari)
CREATE TABLE IF NOT EXISTS daily_closings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  closing_date DATE UNIQUE NOT NULL,
  total_sales NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_expenses NUMERIC(15, 2) NOT NULL DEFAULT 0,
  remaining_cash NUMERIC(15, 2) NOT NULL DEFAULT 0,
  transferred_to_savings NUMERIC(15, 2) NOT NULL DEFAULT 0,
  is_closed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_closings ENABLE ROW LEVEL SECURITY;

-- Allow public access for simple deployment
CREATE POLICY "Allow public read access for transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access for transactions" ON transactions FOR DELETE USING (true);

CREATE POLICY "Allow public read access for savings" ON savings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for savings" ON savings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for daily_closings" ON daily_closings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for daily_closings" ON daily_closings FOR INSERT WITH CHECK (true);
