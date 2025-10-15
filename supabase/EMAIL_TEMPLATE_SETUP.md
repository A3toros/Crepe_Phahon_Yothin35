# Email Template Setup Guide

## 🎨 Professional Email Templates

I've created professional email templates for your Supabase authentication emails.

## 📁 Template Files

- `supabase/email-templates/confirm-signup.html` - Beautiful HTML email template
- `supabase/email-templates/confirm-signup.txt` - Plain text version

## 🔧 How to Implement in Supabase

### Step 1: Go to Supabase Dashboard
1. Navigate to your Supabase project
2. Go to **Authentication** > **Email Templates**

### Step 2: Update Confirm Signup Template
1. Click on **"Confirm signup"** template
2. Replace the default template with the content from `confirm-signup.html`
3. Make sure the redirect URL is set to: `{{ .SiteURL }}/#access_token={{ .TokenHash }}&type=signup`

### Step 3: Configure Settings
1. Go to **Authentication** > **Settings**
2. Set **Email confirmation expiry** to `86400` (24 hours)
3. Set **JWT expiry** to `3600` (1 hour)
4. Set **Refresh token expiry** to `2592000` (30 days)

### Step 4: URL Configuration
1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL** to: `http://localhost:8888`
3. Add **Redirect URLs**: `http://localhost:8888/**`

## 🎯 Template Features

### HTML Template Includes:
- ✅ Professional branding with logo
- ✅ Clear call-to-action button
- ✅ Security note about link expiration
- ✅ Alternative text link for accessibility
- ✅ Social media links
- ✅ Company information
- ✅ Responsive design
- ✅ Professional styling

### Plain Text Template Includes:
- ✅ Clean, readable format
- ✅ All essential information
- ✅ Direct confirmation link
- ✅ Security information

## 🚀 Benefits

1. **Professional Appearance**: Branded emails that look trustworthy
2. **Better User Experience**: Clear instructions and beautiful design
3. **Higher Conversion**: Users are more likely to click professional emails
4. **Security**: Clear expiration notices and security information
5. **Accessibility**: Both HTML and plain text versions

## 🔧 Customization

You can customize the templates by:
- Replacing `[Your Address]`, `[Your Phone]`, `[Your Website]` with your actual information
- Updating the logo and branding colors
- Adding your social media links
- Modifying the messaging to match your brand voice

## 📧 Testing

After implementing:
1. Test the signup flow
2. Check that emails are properly formatted
3. Verify the confirmation link works
4. Test on different email clients (Gmail, Outlook, etc.)
