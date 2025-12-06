import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
    const matchId = url.pathname.split('/').pop()
    const method = req.method

    // GET /matches/:id - Get match details
    if (method === 'GET' && matchId) {
      const { data: match, error } = await supabaseClient
        .from('matches')
        .select(`
          *,
          tournaments(*, games(*)),
          player1:users!matches_player1_id_fkey(username, avatar_url),
          player2:users!matches_player2_id_fkey(username, avatar_url),
          spectator:users!matches_spectator_id_fkey(username)
        `)
        .eq('id', matchId)
        .single()

      if (error) throw error

      // Check if user has permission to view this match
      const hasPermission = 
        match.player1_id === user.id || 
        match.player2_id === user.id || 
        match.spectator_id === user.id ||
        match.tournaments.organizer_id === user.id

      if (!hasPermission) {
        const { data: userData } = await supabaseClient
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (!userData || !['admin', 'spectator'].includes(userData.role)) {
          return new Response(
            JSON.stringify({ error: 'Forbidden' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      return new Response(
        JSON.stringify({ match }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /matches/:id/results - Submit match results (spectators only)
    if (method === 'POST' && matchId && url.pathname.endsWith('/results')) {
      const body = await req.json()
      
      // Check if user is a spectator
      const { data: userData } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userData || userData.role !== 'spectator') {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Only spectators can submit results' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if spectator is assigned to this match
      const { data: match } = await supabaseClient
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .eq('spectator_id', user.id)
        .single()

      if (!match) {
        return new Response(
          JSON.stringify({ error: 'Match not found or not assigned to you' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate payment
      let totalPayment = body.base_payment || 3500
      
      // Add speed bonus if submitted within 10 minutes
      if (body.speed_bonus) {
        totalPayment += totalPayment * 0.2
      }

      // Insert match result
      const { data: result, error } = await supabaseClient
        .from('match_results')
        .insert({
          match_id: matchId,
          spectator_id: user.id,
          player1_score: body.player1_score,
          player2_score: body.player2_score,
          player1_kills: body.player1_kills,
          player2_kills: body.player2_kills,
          player1_deaths: body.player1_deaths,
          player2_deaths: body.player2_deaths,
          duration_minutes: body.duration_minutes,
          notes: body.notes,
          screenshots: body.screenshots,
          video_url: body.video_url,
          confidence_level: body.confidence_level,
          base_payment: body.base_payment || 3500,
          speed_bonus: body.speed_bonus ? (body.base_payment || 3500) * 0.2 : 0,
          total_payment: totalPayment
        })
        .select()
        .single()

      if (error) throw error

      // Update match status
      await supabaseClient
        .from('matches')
        .update({ 
          status: 'completed',
          player1_score: body.player1_score,
          player2_score: body.player2_score,
          winner_id: body.winner_id,
          end_time: new Date().toISOString()
        })
        .eq('id', matchId)

      return new Response(
        JSON.stringify({ result }),
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
