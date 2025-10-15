// K-Bank QR Payment integration using OAuth 2.0
// Based on the actual K-Bank API we've been testing

export interface CreateQRRequest {
  accessToken: string;
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

export async function createQR(request: CreateQRRequest): Promise<CreateQRResponse> {
  try {
    const url = 'https://openapi-sandbox.kasikornbank.com/v1/qrpayment/request';
    
    const payload = {
      partnerTxnUid: `PARTNERTEST-${Date.now()}`,
      partnerId: process.env.KBANK_PARTNER_ID || 'PTR1051673',
      partnerSecret: process.env.KBANK_PARTNER_SECRET || 'd4bded59200547bc85903574a293831b',
      requestDt: new Date().toISOString(), // Current timestamp in ISO8601 format
      merchantId: process.env.KBANK_MERCHANT_ID || 'KB102057149704',
      qrType: request.qrType || 3,
      amount: request.amount.toString(), // Ensure string format
      currencyCode: request.currency || 'THB',
      reference1: request.reference || 'INV001',
      reference2: 'HELLOWORLD',
      reference3: request.reference || 'INV001',
      reference4: request.reference || 'INV001'
    };

    const headers = {
      'Authorization': `Bearer ${request.accessToken}`,
      'Content-Type': 'application/json',
      'x-test-mode': 'true',
      'env-id': 'QR002'
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
        error: data.errorDesc || data.message || `HTTP ${response.status}`
      };
    }

    // Extract QR code from response (adjust based on actual API response format)
    return {
      success: true,
      qrCode: data.qrCode || data.qr_code || data.qrText,
      qrImageUrl: data.qrImageUrl || data.qr_image_url,
      partnerTxnUid: payload.partnerTxnUid
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
