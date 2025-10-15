# Email System Documentation

## 📧 Overview

This email system provides a comprehensive solution for sending transactional emails in the Crepe Phahon Yothin35 application.

## 🏗️ Architecture

```
Frontend (React) → Email Service → Netlify Edge Function → Brevo API → Email Delivery
```

## 📁 File Structure

```
src/lib/email/
├── emailService.ts          # Main email service class
├── config.ts               # Email configuration
├── useEmail.tsx            # React hook for email functionality
└── README.md               # This documentation

netlify/edge-functions/
└── send-email.ts           # Netlify Edge Function for sending emails
```

## 🔧 Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
# Brevo API Key (for sending emails)
BREVO_API_KEY=your_brevo_api_key

# Email Configuration
EMAIL_FROM=noreply@crepephahonyothin35.netlify.app
EMAIL_FROM_NAME=Crepe Phahon Yothin35
```

### 2. Netlify Edge Function

The `send-email.ts` function handles email sending via Brevo API.

### 3. Email Service

The `EmailService` class provides methods for:
- Sending email confirmations
- Sending order confirmations
- Sending password reset emails

## 🚀 Usage

### Basic Usage

```typescript
import { useEmail } from '@src/lib/hooks/useEmail';

function MyComponent() {
  const { sendEmailConfirmation, loading, error } = useEmail();

  const handleSendEmail = async () => {
    const success = await sendEmailConfirmation(
      'user@example.com',
      'https://example.com/confirm?token=abc123'
    );
    
    if (success) {
      console.log('Email sent successfully');
    }
  };

  return (
    <button onClick={handleSendEmail} disabled={loading}>
      {loading ? 'Sending...' : 'Send Email'}
    </button>
  );
}
```

### Email Service Usage

```typescript
import { emailService } from '@src/lib/email/emailService';

// Send confirmation email
const success = await emailService.sendEmailConfirmation(
  'user@example.com',
  'https://example.com/confirm?token=abc123'
);

// Send order confirmation
const orderSuccess = await emailService.sendOrderConfirmation(
  'user@example.com',
  { id: '123', total: 150, status: 'confirmed' }
);
```

## 📧 Email Templates

### Confirmation Email
- **Subject**: "Welcome to Crepe Phahon Yothin35 - Confirm Your Email"
- **Features**: Professional HTML design, security notes, alternative text link
- **Expiry**: 24 hours

### Order Confirmation
- **Subject**: "Order Confirmation #123 - Crepe Phahon Yothin35"
- **Features**: Order details, total amount, status information
- **Expiry**: No expiry (permanent record)

## 🎨 Template Features

### HTML Templates
- ✅ Responsive design
- ✅ Professional branding
- ✅ Clear call-to-action buttons
- ✅ Security information
- ✅ Alternative text links
- ✅ Company information

### Plain Text Templates
- ✅ Clean, readable format
- ✅ All essential information
- ✅ Direct links
- ✅ Professional formatting

## 🔒 Security

- **Email validation**: Proper email format validation
- **Rate limiting**: Built-in rate limiting for email sending
- **Expiry times**: Configurable expiry times for different email types
- **Error handling**: Comprehensive error handling and logging

## 🧪 Testing

### Test Email Sending

```typescript
// Test confirmation email
const testEmail = async () => {
  const success = await emailService.sendEmailConfirmation(
    'test@example.com',
    'https://example.com/confirm?token=test123'
  );
  console.log('Email sent:', success);
};
```

### Test Order Confirmation

```typescript
// Test order confirmation
const testOrderEmail = async () => {
  const success = await emailService.sendOrderConfirmation(
    'test@example.com',
    {
      id: 'TEST-123',
      total: 150,
      status: 'confirmed',
      created_at: new Date().toISOString()
    }
  );
  console.log('Order email sent:', success);
};
```

## 🚀 Deployment

### Netlify Functions

1. Deploy the edge function to Netlify
2. Set environment variables in Netlify dashboard
3. Test email sending functionality

### Environment Variables

Set these in your Netlify dashboard:
- `RESEND_API_KEY`: Your Resend API key
- `EMAIL_FROM`: Sender email address
- `EMAIL_FROM_NAME`: Sender name

## 📊 Monitoring

### Logs
- Email sending attempts are logged
- Errors are captured and logged
- Success/failure rates can be monitored

### Metrics
- Email delivery rates
- Open rates (if tracking is enabled)
- Error rates and types

## 🔧 Configuration

### Email Service Configuration

```typescript
// src/lib/email/config.ts
export const emailConfig = {
  service: {
    name: 'Crepe Phahon Yothin35',
    domain: 'crepephahonyothin35.netlify.app',
    fromEmail: 'noreply@crepephahonyothin35.netlify.app',
    fromName: 'Crepe Phahon Yothin35',
  },
  // ... other configuration
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**: Check Resend API key and configuration
2. **Template not rendering**: Verify HTML template syntax
3. **CORS issues**: Check Netlify function configuration
4. **Rate limiting**: Implement proper rate limiting

### Debug Mode

Enable debug logging by setting `DEBUG_EMAIL=true` in environment variables.

## 📈 Future Enhancements

- [ ] Email tracking and analytics
- [ ] A/B testing for email templates
- [ ] Advanced email scheduling
- [ ] Email template editor
- [ ] Bulk email sending
- [ ] Email automation workflows
