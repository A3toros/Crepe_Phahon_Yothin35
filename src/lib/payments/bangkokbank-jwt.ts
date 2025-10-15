// Bangkok Bank JWT (JSON Web Token) implementation
// Based on Bangkok Bank API documentation for digital signature

import { createSign, createVerify } from 'crypto';

export interface JWTConfig {
  privateKey: string;
  publicKey: string;
  algorithm?: string;
}

export interface JWTPayload {
  [key: string]: any;
  iat?: number;
  exp?: number;
  iss?: string;
}

export class BangkokBankJWT {
  private config: JWTConfig;

  constructor(config: JWTConfig) {
    this.config = {
      algorithm: 'RS256',
      ...config
    };
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString();
  }

  generateJWT(payload: JWTPayload): string {
    const header = {
      alg: this.config.algorithm,
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      ...payload,
      iat: payload.iat || now,
      exp: payload.exp || now + 3600, // 1 hour default
      iss: payload.iss || 'bangkokbank-api'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(jwtPayload));
    
    const data = `${encodedHeader}.${encodedPayload}`;
    
    const signature = createSign('RSA-SHA256')
      .update(data)
      .sign(this.config.privateKey, 'base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return `${data}.${signature}`;
  }

  verifyJWT(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid JWT format' };
      }

      const [headerPart, payloadPart, signaturePart] = parts;
      
      // Verify signature
      const data = `${headerPart}.${payloadPart}`;
      const signature = signaturePart.replace(/-/g, '+').replace(/_/g, '/');
      
      const verifier = createVerify('RSA-SHA256');
      verifier.update(data);
      
      const isValid = verifier.verify(this.config.publicKey, signature, 'base64');
      
      if (!isValid) {
        return { valid: false, error: 'Invalid signature' };
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(payloadPart));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token expired' };
      }

      return { valid: true, payload };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Factory function for easy setup
export function createBangkokBankJWT(config: JWTConfig): BangkokBankJWT {
  return new BangkokBankJWT(config);
}

// Example usage with environment variables
export const bangkokBankJWT = createBangkokBankJWT({
  privateKey: process.env.BANGKOKBANK_PRIVATE_KEY || '',
  publicKey: process.env.BANGKOKBANK_PUBLIC_KEY || '',
  algorithm: 'RS256'
});
