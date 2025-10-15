// HMAC verification helper for webhook signatures
export async function verifyHmac(rawBody: string, secret: string, receivedHex: string): Promise<boolean> {
  try {
    const hmac = await crypto.subtle.sign(
      { name: 'HMAC', hash: 'SHA-256' },
      await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
      new TextEncoder().encode(rawBody)
    );
    const computedHex = Array.from(new Uint8Array(hmac)).map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHex === receivedHex;
  } catch {
    return false;
  }
}


