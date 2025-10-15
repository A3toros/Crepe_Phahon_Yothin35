-- Migration: Initial Database Schema
-- This migration sets up the complete database schema for the Crepe Shop application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'qr_issued', 'paid', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'THB',
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  qr_code TEXT,
  payment_reference TEXT,
  payment_provider TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'THB',
  status TEXT NOT NULL,
  qr_code TEXT,
  payment_url TEXT,
  webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for optimal performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON public.users(last_login_at);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
-- Removed updated_at index since we removed updated_at column
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_currency ON public.orders(currency);
CREATE INDEX IF NOT EXISTS idx_orders_payment_provider ON public.orders(payment_provider);
-- Removed qr_expires_at index since we removed qr_expires_at column

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status_created_at ON public.orders(payment_status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_created_at ON public.orders(user_id, created_at);

-- Order items table indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item_type ON public.order_items(item_type);
CREATE INDEX IF NOT EXISTS idx_order_items_item_name ON public.order_items(item_name);
CREATE INDEX IF NOT EXISTS idx_order_items_created_at ON public.order_items(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_total_price ON public.order_items(total_price);

-- Payment transactions table indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider ON public.payment_transactions(provider);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions(created_at);
-- Removed updated_at index since we removed updated_at column
CREATE INDEX IF NOT EXISTS idx_payment_transactions_amount ON public.payment_transactions(amount);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_currency ON public.payment_transactions(currency);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);
-- Removed qr_expires_at index since we removed qr_expires_at column

-- Composite indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_status ON public.payment_transactions(order_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_status ON public.payment_transactions(provider, status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status_created_at ON public.payment_transactions(status, created_at);

-- Analytics events table indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_order_id ON public.analytics_events(order_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created_at ON public.analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created_at ON public.analytics_events(user_id, created_at);

-- JSONB indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_orders_items_gin ON public.orders USING GIN (items);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_webhook_data_gin ON public.payment_transactions USING GIN (webhook_data);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data_gin ON public.analytics_events USING GIN (event_data);

-- Partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_orders_pending ON public.orders(created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_orders_paid ON public.orders(created_at) WHERE status = 'paid';
CREATE INDEX IF NOT EXISTS idx_orders_expired ON public.orders(created_at) WHERE status = 'expired';
CREATE INDEX IF NOT EXISTS idx_payment_transactions_pending ON public.payment_transactions(created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_payment_transactions_completed ON public.payment_transactions(created_at) WHERE status = 'completed';
-- Removed problematic partial index with NOW() function

-- Text search indexes (requires pg_trgm extension)
-- Note: Enable pg_trgm extension in Supabase dashboard if needed
-- CREATE INDEX IF NOT EXISTS idx_users_display_name_trgm ON public.users USING GIN (display_name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_users_full_name_trgm ON public.users USING GIN (full_name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_order_items_item_name_trgm ON public.order_items USING GIN (item_name gin_trgm_ops);

-- No updated_at triggers needed since we removed updated_at columns

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own payments" ON public.payment_transactions;
CREATE POLICY "Users can view own payments" ON public.payment_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = payment_transactions.order_id AND user_id = auth.uid())
);

-- Admin policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payment_transactions;
CREATE POLICY "Admins can view all payments" ON public.payment_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Admins can view all analytics" ON public.analytics_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log analytics events
CREATE OR REPLACE FUNCTION public.log_analytics_event(
  event_type TEXT,
  event_data JSONB DEFAULT NULL,
  order_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.analytics_events (event_type, user_id, order_id, event_data)
  VALUES (event_type, auth.uid(), order_id, event_data)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get order analytics
CREATE OR REPLACE FUNCTION public.get_order_analytics(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
  total_orders BIGINT,
  total_revenue DECIMAL(10,2),
  pending_orders BIGINT,
  completed_orders BIGINT,
  avg_order_value DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_orders,
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
    COUNT(*) FILTER (WHERE status = 'paid') as completed_orders,
    COALESCE(AVG(total_amount), 0) as avg_order_value
  FROM public.orders
  WHERE created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
