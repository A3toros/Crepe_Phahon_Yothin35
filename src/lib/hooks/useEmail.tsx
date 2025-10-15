import { useState, useCallback } from 'react';
import { emailService } from '@src/lib/email/emailService';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  fromName?: string;
}

export function useEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = useCallback(async (options: EmailOptions): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await emailService.sendEmailConfirmation(
        options.to,
        options.html // Using html as confirmation URL for now
      );

      if (!success) {
        setError('Failed to send email');
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Email sending failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendEmailConfirmation = useCallback(async (
    email: string, 
    confirmationUrl: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await emailService.sendEmailConfirmation(email, confirmationUrl);
      
      if (!success) {
        setError('Failed to send confirmation email');
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Confirmation email sending failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendOrderConfirmation = useCallback(async (
    email: string,
    orderData: any
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await emailService.sendOrderConfirmation(email, orderData);
      
      if (!success) {
        setError('Failed to send order confirmation email');
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Order confirmation email sending failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendEmail,
    sendEmailConfirmation,
    sendOrderConfirmation,
    clearError: () => setError(null)
  };
}
