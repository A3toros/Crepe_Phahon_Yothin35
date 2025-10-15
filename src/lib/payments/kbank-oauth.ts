// K-Bank OAuth 2.0 Client for Thai QR payments
// Based on K-Bank OpenAPI sandbox documentation

export interface KBankOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface KBankOAuthConfig {
  consumerId: string;
  consumerSecret: string;
  baseUrl: string;
  isTestMode?: boolean;
}

export class KBankOAuthClient {
  private config: KBankOAuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: KBankOAuthConfig) {
    this.config = config;
  }

  private getBasicAuth(): string {
    const credentials = `${this.config.consumerId}:${this.config.consumerSecret}`;
    return btoa(credentials);
  }

  private isTokenValid(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiry;
  }

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken!;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${this.getBasicAuth()}`,
    };

    if (this.config.isTestMode) {
      headers['x-test-mode'] = 'true';
      headers['env-id'] = 'OAUTH2';
    }

    const body = new URLSearchParams({
      grant_type: 'client_credentials'
    });

    try {
      const response = await fetch(`${this.config.baseUrl}/v2/oauth/token`, {
        method: 'POST',
        headers,
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error(`OAuth request failed: ${response.status} ${response.statusText}`);
      }

      const data: KBankOAuthResponse = await response.json();
      
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      throw new Error(`Failed to get K-Bank access token: ${error}`);
    }
  }

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAccessToken();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    return fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
  }
}

// Factory function for easy configuration
export function createKBankOAuthClient(config: {
  consumerId: string;
  consumerSecret: string;
  isTestMode?: boolean;
}): KBankOAuthClient {
  return new KBankOAuthClient({
    ...config,
    baseUrl: config.isTestMode 
      ? 'https://openapi-sandbox.kasikornbank.com'
      : 'https://openapi.kasikornbank.com'
  });
}

// Example usage with test credentials from the exercise
// Note: These credentials may be expired - replace with your actual K-Bank API credentials
export const kbankTestClient = createKBankOAuthClient({
  consumerId: process.env.KBANK_CONSUMER_ID || 'IqcNvcCWZJdAWjMa29djcIC41Ge1hJ1e',
  consumerSecret: process.env.KBANK_CONSUMER_SECRET || 'ZSP6hqfSesbpXSYx',
  isTestMode: true
});

// Export the main OAuth function for backward compatibility
export const kbankOAuth = kbankTestClient;
