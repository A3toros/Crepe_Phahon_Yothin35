# Crepe Shop Database Schema

This directory contains the SQL files for setting up the Crepe Shop database in Supabase.

## 📁 Files Overview

### `schema.sql`
Complete database schema with all tables, indexes, triggers, and RLS policies.

### `seed.sql`
Sample data for development and testing.

### `migrations/001_initial_schema.sql`
Migration file for setting up the database step by step.

## 🚀 Setup Instructions

### 1. **Supabase Dashboard Setup**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL files in this order:

### 2. **Run Schema Migration**
```sql
-- Copy and paste the contents of migrations/001_initial_schema.sql
-- This sets up all tables, indexes, and policies
```

### 3. **Add Sample Data (Optional)**
```sql
-- Copy and paste the contents of seed.sql
-- This adds sample data for testing
```

## 🗄️ Database Structure

### **Core Tables**

#### `users` (extends auth.users)
- User profiles with roles (customer, admin, manager, staff)
- Automatically created when user signs up
- Stores display name, phone, role, etc.

#### `orders`
- Customer orders with items, totals, status
- Links to users and payment transactions
- Stores QR codes and payment references

#### `order_items`
- Detailed breakdown of each order item
- Tracks toppings, sauces, whipped cream separately
- Calculates individual and total prices

#### `payment_transactions`
- Payment processing records
- Links to orders and payment providers
- Stores QR codes, webhook data, transaction status

#### `analytics_events`
- Event tracking for analytics
- User actions, order events, payment events
- Used for reporting and insights

### **Key Features**

#### **Row Level Security (RLS)**
- Users can only see their own data
- Admins can see all data
- Automatic user profile creation

#### **Automatic Triggers**
- `updated_at` timestamps
- User profile creation on signup
- Analytics event logging

#### **Analytics Functions**
- `log_analytics_event()` - Log events
- `get_order_analytics()` - Get order statistics
- Dashboard views for reporting

## 🔐 Security

### **User Permissions**
- **Customers**: Can view/edit own profile and orders
- **Admins/Managers**: Can view all data
- **Staff**: Can view orders and payments

### **Data Protection**
- RLS policies prevent unauthorized access
- User data is isolated by user ID
- Admin access is role-based

## 📊 Analytics & Reporting

### **Available Views**
- `order_summary` - Order details with user info
- `analytics_dashboard` - Daily analytics summary

### **Event Tracking**
- User registrations
- Order creation and completion
- Payment processing
- Page views and interactions

## 🛠️ Development

### **Local Development**
1. Set up Supabase project
2. Run migration SQL
3. Configure environment variables
4. Test with sample data

### **Production Deployment**
1. Run migration in production Supabase
2. Set up proper RLS policies
3. Configure email authentication
4. Set up payment webhooks

## 🔧 Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📝 Usage Examples

### **Create Order**
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    items: orderItems,
    total_amount: total,
    status: 'pending'
  });
```

### **Log Analytics Event**
```typescript
const { data } = await supabase.rpc('log_analytics_event', {
  event_type: 'order_created',
  event_data: { total: 47 },
  order_id: orderId
});
```

### **Get Order Analytics**
```typescript
const { data } = await supabase.rpc('get_order_analytics', {
  start_date: '2024-01-01',
  end_date: '2024-12-31'
});
```

## 🚨 Important Notes

1. **User Creation**: Users are automatically created when they sign up via Supabase Auth
2. **RLS Policies**: All tables have Row Level Security enabled
3. **Admin Setup**: Create admin users manually in the database
4. **Email Confirmation**: Configure in Supabase Auth settings
5. **Payment Webhooks**: Set up webhook endpoints for payment processing

## 🔄 Migration Strategy

1. **Development**: Use `schema.sql` for initial setup
2. **Staging**: Use `migrations/` for incremental changes
3. **Production**: Use migration files for safe deployments

## 📞 Support

For issues with the database schema:
1. Check Supabase logs
2. Verify RLS policies
3. Test with sample data
4. Check user permissions
