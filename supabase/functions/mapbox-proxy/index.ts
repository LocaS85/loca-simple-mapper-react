import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting cache
const rateLimitCache = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per endpoint

// Request logging for audit
const logRequest = (endpoint: string, method: string, clientIP?: string) => {
  console.log(`[${new Date().toISOString()}] ${method} ${endpoint} - IP: ${clientIP || 'unknown'}`);
};

// Rate limiting check
const checkRateLimit = (clientIP: string, endpoint: string): boolean => {
  const key = `${clientIP}-${endpoint}`;
  const now = Date.now();
  const window = rateLimitCache.get(key);
  
  if (!window || now - window.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitCache.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (window.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  window.count++;
  return true;
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    
    if (!mapboxToken) {
      throw new Error('MAPBOX_ACCESS_TOKEN not configured');
    }

    if (!mapboxToken.startsWith('pk.')) {
      throw new Error('Invalid Mapbox token format');
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    if (!endpoint) {
      throw new Error('Endpoint parameter required');
    }

    // Log the request
    logRequest(endpoint, req.method, clientIP);

    // Check rate limiting
    if (!checkRateLimit(clientIP, endpoint)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    // Validate endpoint starts with api.mapbox.com
    if (!endpoint.startsWith('https://api.mapbox.com/')) {
      throw new Error('Invalid endpoint. Only Mapbox API endpoints are allowed.');
    }

    // Add access token to the URL
    const targetUrl = new URL(endpoint);
    targetUrl.searchParams.set('access_token', mapboxToken);

    // Forward the request to Mapbox API
    const mapboxResponse = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        'User-Agent': 'LocaSimple/1.0',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    // Get response data
    const responseData = await mapboxResponse.text();
    let parsedData;
    
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = { raw: responseData };
    }

    // Log successful response
    console.log(`✅ Mapbox API response: ${mapboxResponse.status} - ${endpoint}`);

    return new Response(
      JSON.stringify(parsedData),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: mapboxResponse.status,
      }
    );

  } catch (error) {
    console.error('❌ Mapbox proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error' 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      }
    );
  }
});