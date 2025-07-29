interface TokenValidationResult {
  isValid: boolean;
  type: 'public' | 'secret' | 'invalid';
  scopes?: string[];
  expires?: Date;
  rateLimits?: {
    limit: number;
    remaining: number;
    reset: Date;
  };
}

class TokenValidator {
  private validationCache = new Map<string, TokenValidationResult>();
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 minutes

  async validateToken(token: string): Promise<TokenValidationResult> {
    // Check cache first
    const cached = this.validationCache.get(token);
    if (cached) {
      return cached;
    }

    try {
      // Basic format validation
      if (!this.isValidTokenFormat(token)) {
        return { isValid: false, type: 'invalid' };
      }

      // API validation
      const result = await this.validateWithMapboxAPI(token);
      
      // Cache result
      this.validationCache.set(token, result);
      
      // Auto-clear cache
      setTimeout(() => {
        this.validationCache.delete(token);
      }, this.cacheTimeout);

      return result;
    } catch (error) {
      console.error('❌ Erreur validation token:', error);
      return { isValid: false, type: 'invalid' };
    }
  }

  private isValidTokenFormat(token: string): boolean {
    // Mapbox public tokens start with pk.
    // Mapbox secret tokens start with sk.
    const publicTokenRegex = /^pk\.[\w-]+\.[\w-]+$/;
    const secretTokenRegex = /^sk\.[\w-]+\.[\w-]+$/;
    
    return publicTokenRegex.test(token) || secretTokenRegex.test(token);
  }

  private async validateWithMapboxAPI(token: string): Promise<TokenValidationResult> {
    const response = await fetch(`https://api.mapbox.com/tokens/v2?access_token=${token}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        return { isValid: false, type: 'invalid' };
      }
      throw new Error(`Erreur validation API: ${response.status}`);
    }

    const data = await response.json();
    const rateLimitHeaders = this.extractRateLimitHeaders(response);
    
    return {
      isValid: true,
      type: token.startsWith('pk.') ? 'public' : 'secret',
      scopes: data.scopes || [],
      expires: data.expires ? new Date(data.expires) : undefined,
      rateLimits: rateLimitHeaders
    };
  }

  private extractRateLimitHeaders(response: Response) {
    const limit = response.headers.get('X-Rate-Limit-Limit');
    const remaining = response.headers.get('X-Rate-Limit-Remaining');
    const reset = response.headers.get('X-Rate-Limit-Reset');

    if (!limit || !remaining || !reset) {
      return undefined;
    }

    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: new Date(parseInt(reset, 10) * 1000)
    };
  }

  isTokenExpired(result: TokenValidationResult): boolean {
    if (!result.expires) return false;
    return new Date() > result.expires;
  }

  shouldRotateToken(result: TokenValidationResult): boolean {
    if (!result.rateLimits) return false;
    
    // Suggest rotation if less than 10% of rate limit remaining
    const usagePercentage = (result.rateLimits.limit - result.rateLimits.remaining) / result.rateLimits.limit;
    return usagePercentage > 0.9;
  }

  clearCache(): void {
    this.validationCache.clear();
  }

  getCacheStats() {
    return {
      size: this.validationCache.size,
      tokens: Array.from(this.validationCache.keys()).map(token => ({
        token: token.substring(0, 10) + '...',
        isValid: this.validationCache.get(token)?.isValid,
        type: this.validationCache.get(token)?.type
      }))
    };
  }
}

export const tokenValidator = new TokenValidator();
export type { TokenValidationResult };