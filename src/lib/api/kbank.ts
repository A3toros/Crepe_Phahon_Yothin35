// K-Bank API integration for server-side calls
// This handles OAuth and QR generation on the backend

import { kbankOAuth } from '../payments/kbank-oauth';
import { createQR } from '../payments/kbank-qr';

export interface CreateQRRequest {
  amount: number;
  currency?: string;
  reference?: string;
  qrType?: number;
}

export interface CreateQRResponse {
  success: boolean;
  qrCode?: string;
  qrImageUrl?: string;
  partnerTxnUid?: string;
  error?: string;
}

// Server-side API endpoint for creating QR codes
export async function createQRCode(request: CreateQRRequest): Promise<CreateQRResponse> {
  try {
    // Get fresh access token
    const accessToken = await kbankOAuth.getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Failed to get access token'
      };
    }

    // Generate QR code
    const qrResponse = await createQR({
      accessToken: accessToken,
      amount: request.amount,
      currency: request.currency || 'THB',
      reference: request.reference || 'INV001',
      qrType: request.qrType || 3
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
      partnerTxnUid: qrResponse.partnerTxnUid
    };

  } catch (error) {
    console.error('K-Bank API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check payment status
export async function checkPaymentStatus(partnerTxnUid: string): Promise<{
  success: boolean;
  status?: string;
  error?: string;
}> {
  try {
    // Get fresh access token
    const accessToken = await kbankOAuth.getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        error: 'Failed to get access token'
      };
    }

    // Check payment status (implement based on K-Bank API docs)
    // This is a placeholder - you'll need to implement the actual status check
    return {
      success: true,
      status: 'pending' // or 'completed', 'failed', etc.
    };

  } catch (error) {
    console.error('Payment status check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
