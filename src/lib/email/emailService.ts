import { supabase } from '@src/lib/supabase/client';
import { getEmailConfig, MockEmailService } from './emailConfig';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  fromName?: string;
}

export class EmailService {
  private static instance: EmailService;
  private defaultFrom = 'noreply@crepephahonyothin35.netlify.app';
  private defaultFromName = 'Crepe Phahon Yothin35';

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email confirmation
  async sendEmailConfirmation(email: string, confirmationUrl: string): Promise<boolean> {
    try {
      const config = getEmailConfig();
      
      // Use mock service in development
      if (config.useMock) {
        return await MockEmailService.sendEmailConfirmation(email, confirmationUrl);
      }

      const template = this.getEmailConfirmationTemplate(confirmationUrl);
      
      const emailData: EmailData = {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        from: config.from,
        fromName: config.fromName
      };

      // Call Netlify Function endpoint
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Email sending error:', text);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(email: string, orderData: any): Promise<boolean> {
    try {
      const config = getEmailConfig();
      
      // Use mock service in development
      if (config.useMock) {
        return await MockEmailService.sendOrderConfirmation(email, orderData);
      }

      const template = this.getOrderConfirmationTemplate(orderData);
      
      const emailData: EmailData = {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        from: config.from,
        fromName: config.fromName
      };

      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Order email sending error:', text);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Order email service error:', error);
      return false;
    }
  }

  // Get email confirmation template
  private getEmailConfirmationTemplate(confirmationUrl: string): EmailTemplate {
    const subject = 'Welcome to Crepe Phahon Yothin35 - Confirm Your Email';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - Crepe Phahon Yothin35</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .tagline {
            color: #7f8c8d;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
            text-align: center;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .alternative {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .alternative-title {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .alternative-text {
            color: #666;
            font-size: 14px;
            word-break: break-all;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #7f8c8d;
            font-size: 14px;
        }
        .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🥞 Crepe Phahon Yothin35</div>
            <div class="tagline">Authentic Thai Crepes • Fresh Ingredients • Made with Love</div>
        </div>

        <div class="content">
            <h1 class="title">Welcome to Crepe Phahon Yothin35!</h1>
            
            <p class="message">
                Thank you for joining our community! We're excited to have you as part of the Crepe Phahon Yothin35 family. 
                To complete your registration and start ordering our delicious crepes, please confirm your email address.
            </p>

            <div class="button-container">
                <a href="${confirmationUrl}" class="button">
                    ✉️ Confirm Your Email Address
                </a>
            </div>

            <div class="security-note">
                <strong>🔒 Security Note:</strong> This confirmation link will expire in 24 hours for your security. 
                If you didn't create an account with us, please ignore this email.
            </div>

            <div class="alternative">
                <div class="alternative-title">Having trouble with the button?</div>
                <div class="alternative-text">
                    Copy and paste this link into your browser:<br>
                    <a href="${confirmationUrl}">${confirmationUrl}</a>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>
                <strong>Crepe Phahon Yothin35</strong><br>
                Authentic Thai Crepes • Fresh Daily • Made with Love<br>
                🌐 Website: crepephahonyothin35.netlify.app
            </p>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                This email was sent to confirm your account. If you have any questions, please contact us.<br>
                © 2024 Crepe Phahon Yothin35. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Welcome to Crepe Phahon Yothin35!

Thank you for joining our community! We're excited to have you as part of the Crepe Phahon Yothin35 family.

To complete your registration and start ordering our delicious crepes, please confirm your email address by clicking the link below:

${confirmationUrl}

This confirmation link will expire in 24 hours for your security.

If you didn't create an account with us, please ignore this email.

---
Crepe Phahon Yothin35
Authentic Thai Crepes • Fresh Daily • Made with Love
🌐 Website: crepephahonyothin35.netlify.app

This email was sent to confirm your account. If you have any questions, please contact us.
© 2024 Crepe Phahon Yothin35. All rights reserved.`;

    return { subject, html, text };
  }

  // Get order confirmation template
  private getOrderConfirmationTemplate(orderData: any): EmailTemplate {
    const subject = `Order Confirmation #${orderData.id} - Crepe Phahon Yothin35`;
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Crepe Phahon Yothin35</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .order-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .total {
            font-weight: bold;
            font-size: 18px;
            color: #2c3e50;
            text-align: right;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🥞 Crepe Phahon Yothin35</div>
            <div class="tagline">Authentic Thai Crepes • Fresh Ingredients • Made with Love</div>
        </div>

        <div class="content">
            <h1 class="title">Order Confirmation</h1>
            
            <p class="message">
                Thank you for your order! We've received your order and will prepare it with care.
            </p>

            <div class="order-details">
                <h3>Order #${orderData.id}</h3>
                <p><strong>Status:</strong> ${orderData.status}</p>
                <p><strong>Total:</strong> ${orderData.total} THB</p>
                <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
            </div>
        </div>

        <div class="footer">
            <p>
                <strong>Crepe Phahon Yothin35</strong><br>
                Authentic Thai Crepes • Fresh Daily • Made with Love<br>
                🌐 Website: crepephahonyothin35.netlify.app
            </p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Order Confirmation - Crepe Phahon Yothin35

Thank you for your order! We've received your order and will prepare it with care.

Order #${orderData.id}
Status: ${orderData.status}
Total: ${orderData.total} THB
Order Date: ${new Date(orderData.created_at).toLocaleDateString()}

---
Crepe Phahon Yothin35
Authentic Thai Crepes • Fresh Daily • Made with Love
🌐 Website: crepephahonyothin35.netlify.app`;

    return { subject, html, text };
  }
}

export const emailService = EmailService.getInstance();
