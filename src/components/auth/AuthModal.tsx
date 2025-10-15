import { useState } from 'react';
import { supabase } from '@src/lib/supabase/client';
import { Popup, usePopup } from '@src/components/ui/Popup';
import { Button } from '@src/components/ui/Button';
import { useNotificationContext } from '@src/lib/hooks/useNotificationProvider';
import { useEmail } from '@src/lib/hooks/useEmail';

export function useAuthModal() {
  return usePopup(false);
}

export function AuthModal({ ctrl }: { ctrl: ReturnType<typeof useAuthModal> }) {
  const [mode, setMode] = useState<'signIn'|'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [showResend, setShowResend] = useState(false);
  const { showNotification } = useNotificationContext();
  const { sendEmailConfirmation, loading: emailLoading } = useEmail();

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true); setError(undefined);
    try {
      if (mode === 'signUp') {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { 
            data: { display_name: displayName },
            emailRedirectTo: `${window.location.origin}/`
          } 
        });
        if (error) throw error;
        
        console.log('Signup response:', { data, error });
        
        // Show notification for email confirmation and keep popup open
        if (data.user && !data.session) {
          // Send custom confirmation email
          const confirmationUrl = `${window.location.origin}/#access_token=${data.user.id}&type=signup`;
          const emailSent = await sendEmailConfirmation(email, confirmationUrl);
          
          if (emailSent) {
            showNotification({
              type: 'success',
              title: 'Confirmation Email Sent',
              message: 'Please check your email and click the confirmation link to complete your registration.',
              duration: 8000
            });
          } else {
            showNotification({
              type: 'error',
              title: 'Email Failed',
              message: 'Failed to send confirmation email. Please try again.',
              duration: 8000
            });
          }
          setShowResend(true);
          // Don't close the popup - let user see the notification
        } else {
          ctrl.hide();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        ctrl.hide();
      }
    } catch (e: any) {
      const message: string = e?.message || 'Authentication failed';
      if (typeof e === 'object' && e && ('status' in e) && (e as any).status === 429) {
        setError('Too many requests. Please wait a minute and try again.');
      } else if (/rate limit/i.test(message)) {
        setError('Too many requests. Please wait a minute and try again.');
      } else {
        setError(message);
      }
    } finally { setLoading(false); }
  }

  async function resendConfirmation() {
    if (!email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      showNotification({
        type: 'success',
        title: 'Confirmation Email Sent',
        message: 'A new confirmation email has been sent to your email address.',
        duration: 5000
      });
    } catch (e: any) {
      showNotification({
        type: 'error',
        title: 'Failed to Resend',
        message: e?.message || 'Failed to resend confirmation email. Please try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popup ctrl={ctrl} title={mode === 'signIn' ? 'Sign in' : 'Sign up'}>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="flex gap-2">
          <Button variant={mode==='signIn'?'primary':'secondary'} onClick={()=>setMode('signIn')}>Sign in</Button>
          <Button variant={mode==='signUp'?'primary':'secondary'} onClick={()=>setMode('signUp')}>Sign up</Button>
        </div>
        {mode==='signUp' && (
          <input className="w-full border rounded px-3 py-2" placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} autoComplete="name" />
        )}
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='signIn' ? 'current-password' : 'new-password'} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        {showResend && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the email?</p>
            <Button variant="secondary" onClick={resendConfirmation} disabled={loading}>
              {loading ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading}>{loading ? '...' : (mode==='signIn'?'Sign in':'Sign up')}</Button>
          <button type="button" className="rounded bg-primary px-4 py-2 text-white" onClick={()=>ctrl.hide()}>Cancel</button>
        </div>
      </form>
    </Popup>
  );
}
