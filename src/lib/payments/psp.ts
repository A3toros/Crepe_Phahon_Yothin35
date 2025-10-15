// Placeholder PSP client; replace with real provider integration
export async function createQr(apiBase: string, apiKey: string, payload: { amount: number; ref: string; }) {
  const res = await fetch(apiBase + '/qr/create', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ qr_text: string; expires_at: string; }>;
}


