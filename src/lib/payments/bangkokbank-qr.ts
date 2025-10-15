// Bangkok Bank QR Payment integration using OAuth 2.0
// Based on Bangkok Bank API documentation

export interface CreateQRRequest {
  accessToken: string;
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

export async function createQR(request: CreateQRRequest): Promise<CreateQRResponse> {
  try {
    const url = 'https://api-sandbox.bangkokbank.com/v1/qrpayment/request';
    
    const payload = {
      amount: request.amount.toString(),
      currency: request.currency || 'THB',
      reference: request.reference || `INV${Date.now()}`,
      description: request.description || 'Crepe Order Payment',
      timestamp: new Date().toISOString()
    };

    const headers = {
      'Authorization': `Bearer ${request.accessToken}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`
      };
    }

    // Extract QR code from response (adjust based on actual API response format)
    return {
      success: true,
      qrCode: data.qrCode || data.qr_code || data.qrText,
      qrImageUrl: data.qrImageUrl || data.qr_image_url,
      transactionId: data.transactionId || data.transaction_id
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check payment status
export async function checkPaymentStatus(transactionId: string, accessToken: string): Promise<{
  success: boolean;
  status?: string;
  error?: string;
}> {
  try {
    const url = `https://api-sandbox.bangkokbank.com/v1/qrpayment/status/${transactionId}`;
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`
      };
    }

    return {
      success: true,
      status: data.status || 'pending'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
