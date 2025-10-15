// Client-side API wrappers (will be replaced with real endpoints or Supabase functions)

export type CreateOrderRequest = {
  userId?: string;
  items: Array<{ type: string; name: string }>;
  total: number;
  status: string;
};

export type CreateOrderResponse = {
  order: {
    id: string;
  };
  qrText: string; // placeholder QR text to encode
  expiresAt: string; // ISO
};

export async function createOrder(req: CreateOrderRequest): Promise<CreateOrderResponse> {
  // TODO: Replace with real K-Bank integration
  // For now, using placeholder QR generation
  const id = crypto.randomUUID();
  const payload = `PROMPTPAY|ORDER:${id}|AMOUNT:${req.total}`;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  return { order: { id }, qrText: payload, expiresAt };
}

// K-Bank integration example (server-side usage)
export async function createOrderWithKBank(req: CreateOrderRequest): Promise<CreateOrderResponse> {
  // This would be called from a server endpoint
  // const { createKBankOAuthClient, createKBankQRService } = await import('./payments/kbank-oauth');
  // const oauthClient = createKBankOAuthClient({
  //   consumerId: process.env.KBANK_CONSUMER_ID!,
  //   consumerSecret: process.env.KBANK_CONSUMER_SECRET!,
  //   isTestMode: process.env.NODE_ENV !== 'production'
  // });
  // const qrService = createKBankQRService(oauthClient);
  // const qrResponse = await qrService.createQRPayment({
  //   amount: req.totalBaht,
  //   reference: `ORDER-${Date.now()}`,
  //   description: `Crepe Order - ${req.toppings.join(', ')}`
  // });
  // return {
  //   orderId: qrResponse.payment_id,
  //   qrText: qrResponse.qr_text,
  //   expiresAt: qrResponse.expires_at
  // };
  
  // Placeholder for now
  return createOrder(req);
}


