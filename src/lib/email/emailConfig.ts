// Email configuration for different environments
export const emailConfig = {
  development: {
    from: 'noreply@localhost:8888',
    fromName: 'Crepe Phahon Yothin35 (Dev)',
    // Use a test email service or mock for development
    useMock: true,
    endpoint: '/.netlify/functions/send-email',
  },
  production: {
    from: 'noreply@crepephahonyothin35.netlify.app',
    fromName: 'Crepe Phahon Yothin35',
    useMock: false,
    endpoint: '/.netlify/functions/send-email',
  }
};

// Get current environment configuration
export function getEmailConfig() {
  const isDevelopment = (import.meta as any).env?.DEV || window.location.hostname === 'localhost';
  return isDevelopment ? emailConfig.development : emailConfig.production;
}

// Mock email service for development
export class MockEmailService {
  static async sendEmailConfirmation(email: string, url: string): Promise<boolean> {
    console.log('📧 [MOCK] Email Confirmation Sent:');
    console.log('   To:', email);
    console.log('   URL:', url);
    console.log('   Subject: Welcome to Crepe Phahon Yothin35 - Confirm Your Email');
    console.log('   From: Crepe Phahon Yothin35 (Dev) <noreply@localhost:8888>');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }

  static async sendOrderConfirmation(email: string, orderData: any): Promise<boolean> {
    console.log('📧 [MOCK] Order Confirmation Sent:');
    console.log('   To:', email);
    console.log('   Order ID:', orderData.id);
    console.log('   Total:', orderData.total);
    console.log('   From: Crepe Phahon Yothin35 (Dev) <noreply@localhost:8888>');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }
}
