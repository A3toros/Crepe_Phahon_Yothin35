// Bangkok Bank API integration for server-side calls
// This handles OAuth and QR generation on the backend

import { bangkokBankTestClient } from '../payments/bangkokbank-oauth';
import { createQR, checkPaymentStatus as checkBangkokBankPaymentStatus } from '../payments/bangkokbank-qr';

export interface CreateQRRequest {
  amount: number;
  currency?: string;
  reference?: string;
  description?: string;
}

export interface CreateQRResponse {
  success: boolean;
  qrCode?: string;
  qrImageUrl?: string;
  transactionId?: string;
  error?: string;
}

// Server-side API endpoint for creating QR codes
export async function createQRCode(request: CreateQRRequest): Promise<CreateQRResponse> {
  try {
    // Get fresh access token
    const tokenResponse = await bangkokBankTestClient.getAccessToken();
    if (!tokenResponse.success || !tokenResponse.access_token) {
      return {
        success: false,
        error: 'Failed to get access token'
      };
    }

    // Generate QR code
    const qrResponse = await createQR({
      accessToken: tokenResponse.access_token,
      amount: request.amount,
      currency: request.currency || 'THB',
      reference: request.reference || `INV${Date.now()}`,
      description: request.description || 'Crepe Order Payment'
    });

    if (!qrResponse.success) {
      return {
        success: false,
        error: qrResponse.error || 'Failed to create QR code'
      };
    }

    return {
      success: true,
      qrCode: qrResponse.qrCode,
      qrImageUrl: qrResponse.qrImageUrl,
      transactionId: qrResponse.transactionId
    };

  } catch (error) {
    console.error('Bangkok Bank API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check payment status
export async function checkPaymentStatus(transactionId: string): Promise<{
  success: boolean;
  status?: string;
  error?: string;
}> {
  try {
    // Get fresh access token
    const tokenResponse = await bangkokBankTestClient.getAccessToken();
    if (!tokenResponse.success || !tokenResponse.access_token) {
      return {
        success: false,
        error: 'Failed to get access token'
      };
    }

    // Check payment status
    const statusResponse = await checkBangkokBankPaymentStatus(transactionId, tokenResponse.access_token);
    return statusResponse;

  } catch (error) {
    console.error('Payment status check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
