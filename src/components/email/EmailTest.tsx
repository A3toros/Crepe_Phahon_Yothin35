import { useState } from 'react';
import { emailService } from '@src/lib/email/emailService';
import { Button } from '@src/components/ui/Button';

export function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConfirmationEmail = async () => {
    setLoading(true);
    setResult('Testing confirmation email...');
    
    try {
      const success = await emailService.sendEmailConfirmation(
        'test@example.com',
        'https://crepephahonyothin35.netlify.app/#confirm?token=test123'
      );
      
      setResult(success ? '✅ Confirmation email test PASSED' : '❌ Confirmation email test FAILED');
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testOrderConfirmation = async () => {
    setLoading(true);
    setResult('Testing order confirmation...');
    
    try {
      const success = await emailService.sendOrderConfirmation('test@example.com', {
        id: 'TEST-123',
        total: 150,
        status: 'confirmed',
        created_at: new Date().toISOString()
      });
      
      setResult(success ? '✅ Order confirmation test PASSED' : '❌ Order confirmation test FAILED');
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">🧪 Email System Test</h2>
      
      <div className="space-y-4">
        <Button 
          onClick={testConfirmationEmail} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Confirmation Email'}
        </Button>
        
        <Button 
          onClick={testOrderConfirmation} 
          disabled={loading}
          variant="secondary"
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Order Confirmation'}
        </Button>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm">{result}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        <p><strong>Development Mode:</strong> Uses mock email service</p>
        <p><strong>Production Mode:</strong> Sends real emails via Brevo</p>
      </div>
    </div>
  );
}
