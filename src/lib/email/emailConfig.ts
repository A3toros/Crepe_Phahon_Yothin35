// Email configuration for different environments
export const emailConfig = {
  development: {
    from: 'noreply@localhost:8888',
    fromName: 'Crepe Phahon Yothin35 (Dev)',
    // Always use real email service
    useMock: false,
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
    console.warn('[MockEmailService] disabled');
    
    return false;
  }

  static async sendOrderConfirmation(email: string, orderData: any): Promise<boolean> {
    console.warn('[MockEmailService] disabled');
    return false;
  }
}
