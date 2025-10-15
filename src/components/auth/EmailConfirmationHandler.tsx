import { useEffect } from 'react';
import { supabase } from '@src/lib/supabase/client';
import { useNotificationContext } from '@src/lib/hooks/useNotificationProvider';

export function EmailConfirmationHandler() {
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check if we're on the confirmation callback
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (error) {
        // Handle confirmation errors
        console.log('Confirmation error:', { error, errorDescription });
        
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
          showNotification({
            type: 'error',
            title: 'Link Expired',
            message: 'Your confirmation link has expired. Please request a new confirmation email.',
            duration: 10000
          });
        } else {
          showNotification({
            type: 'error',
            title: 'Confirmation Failed',
            message: errorDescription || 'There was an error confirming your email. Please try again.',
            duration: 8000
          });
        }
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Handle successful confirmation with tokens in URL
      if (accessToken && refreshToken) {
        try {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            showNotification({
              type: 'error',
              title: 'Confirmation Failed',
              message: 'There was an error setting up your session. Please try signing in again.',
              duration: 8000
            });
            return;
          }

          if (data.session) {
            showNotification({
              type: 'success',
              title: 'Email Confirmed!',
              message: 'Your email has been successfully confirmed. You are now signed in.',
              duration: 5000
            });
          }
        } catch (e) {
          console.error('Confirmation error:', e);
          showNotification({
            type: 'error',
            title: 'Confirmation Failed',
            message: 'There was an error confirming your email. Please try again.',
            duration: 8000
          });
        }
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check for existing session
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }

      if (data.session) {
        showNotification({
          type: 'success',
          title: 'Email Confirmed!',
          message: 'Your email has been successfully confirmed. You are now signed in.',
          duration: 5000
        });
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleEmailConfirmation();
  }, [showNotification]);

  return null; // This component doesn't render anything
}
