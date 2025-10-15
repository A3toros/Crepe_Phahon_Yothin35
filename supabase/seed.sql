-- Seed data for Crepe Shop Database
-- This file contains sample data for development and testing

-- Insert sample users (these should match actual auth.users IDs)
-- Note: You'll need to create these users in Supabase Auth first, then update the IDs here

-- Sample admin user (replace with actual UUID from auth.users)
-- INSERT INTO public.users (id, email, display_name, full_name, role) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'admin@crepeshop.com', 'Admin User', 'Admin User', 'admin');

-- Sample customer user (replace with actual UUID from auth.users)
-- INSERT INTO public.users (id, email, display_name, full_name, role) VALUES
-- ('22222222-2222-2222-2222-222222222222', 'customer@example.com', 'John Doe', 'John Doe', 'customer');

-- Sample orders (these will be created when users place orders)
-- INSERT INTO public.orders (id, user_id, items, total_amount, status, payment_status) VALUES
-- (
--   '33333333-3333-3333-3333-333333333333',
--   '22222222-2222-2222-2222-222222222222',
--   '[
--     {
--       "type": "crepe",
--       "toppings": ["Blueberry", "Strawberry"],
--       "sauces": ["Chocolate", "Honey"],
--       "whipped_cream": true,
--       "total": 47
--     }
--   ]'::jsonb,
--   47.00,
--   'paid',
--   'completed'
-- );

-- Sample order items
-- INSERT INTO public.order_items (order_id, item_type, item_name, quantity, unit_price, total_price) VALUES
-- ('33333333-3333-3333-3333-333333333333', 'crepe', 'Basic Crepe', 1, 20.00, 20.00),
-- ('33333333-3333-3333-3333-333333333333', 'topping', 'Blueberry', 1, 7.00, 7.00),
-- ('33333333-3333-3333-3333-333333333333', 'topping', 'Strawberry', 1, 7.00, 7.00),
-- ('33333333-3333-3333-3333-333333333333', 'sauce', 'Chocolate', 1, 0.00, 0.00),
-- ('33333333-3333-3333-3333-333333333333', 'sauce', 'Honey', 1, 0.00, 0.00),
-- ('33333333-3333-3333-3333-333333333333', 'whipped_cream', 'Whipped Cream', 1, 20.00, 20.00);

-- Sample payment transaction
-- INSERT INTO public.payment_transactions (order_id, transaction_id, provider, amount, currency, status) VALUES
-- (
--   '33333333-3333-3333-3333-333333333333',
--   'TXN123456789',
--   'kbank',
--   47.00,
--   'THB',
--   'completed'
-- );

-- Sample analytics events
-- INSERT INTO public.analytics_events (event_type, user_id, order_id, event_data) VALUES
-- ('user_registered', '22222222-2222-2222-2222-222222222222', NULL, '{"source": "web"}'::jsonb),
-- ('order_created', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '{"total": 47}'::jsonb),
-- ('payment_completed', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '{"amount": 47, "provider": "kbank"}'::jsonb);

-- Create some test data for development
-- This will only run if the tables are empty

-- Insert test analytics events for the last 30 days
DO $$
DECLARE
    i INTEGER;
    event_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate random analytics events for the last 30 days
    FOR i IN 1..100 LOOP
        event_date := NOW() - (random() * INTERVAL '30 days');
        
        INSERT INTO public.analytics_events (event_type, event_data, created_at) VALUES
        (
            CASE (random() * 4)::INTEGER
                WHEN 0 THEN 'user_registered'
                WHEN 1 THEN 'order_created'
                WHEN 2 THEN 'payment_completed'
                WHEN 3 THEN 'order_cancelled'
                ELSE 'page_view'
            END,
            jsonb_build_object(
                'source', CASE (random() * 3)::INTEGER
                    WHEN 0 THEN 'web'
                    WHEN 1 THEN 'mobile'
                    ELSE 'api'
                END,
                'device', CASE (random() * 2)::INTEGER
                    WHEN 0 THEN 'desktop'
                    ELSE 'mobile'
                END
            ),
            event_date
        );
    END LOOP;
END $$;

-- Create a view for easy order reporting
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.display_name,
    u.email,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at,
    COUNT(oi.id) as item_count,
    STRING_AGG(oi.item_name, ', ') as items
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id, u.display_name, u.email, o.total_amount, o.status, o.payment_status, o.created_at;

-- Create a view for analytics dashboard
CREATE OR REPLACE VIEW public.analytics_dashboard AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE event_type = 'user_registered') as new_users,
    COUNT(*) FILTER (WHERE event_type = 'order_created') as orders_created,
    COUNT(*) FILTER (WHERE event_type = 'payment_completed') as payments_completed,
    COUNT(*) as total_events
FROM public.analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
