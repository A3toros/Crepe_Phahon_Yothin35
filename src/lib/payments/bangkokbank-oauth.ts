// Bangkok Bank OAuth 2.0 Client for obtaining access tokens
// Based on Bangkok Bank API documentation

export interface BangkokBankOAuthConfig {
  consumerKey: string;
  consumerSecret: string;
  isTestMode?: boolean;
}

export interface AccessTokenResponse {
  success: boolean;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
}

export class BangkokBankOAuthClient {
  private config: BangkokBankOAuthConfig;
  private baseUrl: string;

  constructor(config: BangkokBankOAuthConfig) {
    this.config = config;
    this.baseUrl = config.isTestMode 
      ? 'https://api-sandbox.bangkokbank.com'
      : 'https://api.bangkokbank.com';
  }

  private encodeCredentials(): string {
    const credentials = `${this.config.consumerKey}:${this.config.consumerSecret}`;
    return Buffer.from(credentials).toString('base64');
  }

  async getAccessToken(): Promise<AccessTokenResponse> {
    try {
      const url = `${this.baseUrl}/oauth/accesstoken`;
      const encodedCredentials = this.encodeCredentials();

      const headers = {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'CREATE READ'
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body.toString()
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
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        scope: data.scope
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const tokenResponse = await this.getAccessToken();
    
    if (!tokenResponse.success || !tokenResponse.access_token) {
      throw new Error('Failed to get access token');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }
}

// Factory function for easy setup
export function createBangkokBankOAuthClient(config: BangkokBankOAuthConfig): BangkokBankOAuthClient {
  return new BangkokBankOAuthClient(config);
}

// Example usage with test credentials
export const bangkokBankTestClient = createBangkokBankOAuthClient({
  consumerKey: process.env.BANGKOKBANK_CONSUMER_KEY || '5SG5Q4We2LeIOGtDX3XBINDjWwdNdJEG',
  consumerSecret: process.env.BANGKOKBANK_CONSUMER_SECRET || 'DJjA1USzLPT6OUAr',
  isTestMode: true
});
