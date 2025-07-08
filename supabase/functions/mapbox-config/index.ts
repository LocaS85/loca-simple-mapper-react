import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupérer le token Mapbox depuis les secrets Supabase
    const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
    
    if (!mapboxToken) {
      throw new Error('MAPBOX_ACCESS_TOKEN not configured in Supabase secrets')
    }

    if (!mapboxToken.startsWith('pk.')) {
      throw new Error('Invalid Mapbox token format')
    }

    return new Response(
      JSON.stringify({ 
        token: mapboxToken,
        status: 'success' 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Mapbox config error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error' 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      },
    )
  }
})