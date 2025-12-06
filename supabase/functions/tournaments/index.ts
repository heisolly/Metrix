import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const method = req.method

    // GET /tournaments - List tournaments
    if (method === 'GET') {
      const { data: tournaments, error } = await supabaseClient
        .from('tournaments')
        .select(`
          *,
          games(*),
          users(organizer: username),
          tournament_participants(count)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ tournaments }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /tournaments - Create tournament
    if (method === 'POST') {
      const body = await req.json()
      
      // Check if user is admin or organizer
      const { data: userData } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userData || !['admin', 'organizer'].includes(userData.role)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Only admins and organizers can create tournaments' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: tournament, error } = await supabaseClient
        .from('tournaments')
        .insert({
          ...body,
          organizer_id: user.id,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ tournament }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
