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
    const method = req.method

    // GET /wallet - Get wallet balance
    if (method === 'GET') {
      const { data: wallet, error } = await supabaseClient
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }

      // Create wallet if it doesn't exist
      if (!wallet) {
        const { data: newWallet, error: createError } = await supabaseClient
          .from('wallets')
          .insert({ user_id: user.id })
          .select()
          .single()

        if (createError) throw createError
        return new Response(
          JSON.stringify({ wallet: newWallet }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ wallet }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /wallet/transactions - Get transaction history
    if (method === 'GET' && url.pathname.endsWith('/transactions')) {
      const { data: transactions, error } = await supabaseClient
        .from('transactions')
        .select(`
          *,
          tournaments(name),
          matches(id)
        `)
        .eq('wallet_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(
        JSON.stringify({ transactions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /wallet/withdraw - Request withdrawal
    if (method === 'POST' && url.pathname.endsWith('/withdraw')) {
      const body = await req.json()
      const { amount, bank_account } = body

      if (!amount || !bank_account) {
        return new Response(
          JSON.stringify({ error: 'Amount and bank account are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get current wallet balance
      const { data: wallet, error: walletError } = await supabaseClient
        .from('wallets')
        .select('balance, pending_balance')
        .eq('user_id', user.id)
        .single()

      if (walletError || !wallet) {
        return new Response(
          JSON.stringify({ error: 'Wallet not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if sufficient balance
      if (amount > wallet.balance) {
        return new Response(
          JSON.stringify({ error: 'Insufficient balance' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create withdrawal transaction
      const { data: transaction, error: txError } = await supabaseClient
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          type: 'withdrawal',
          amount: -amount,
          description: `Withdrawal to bank account ending in ${bank_account.slice(-4)}`,
          reference: `WD-${Date.now()}`,
          status: 'pending'
        })
        .select()
        .single()

      if (txError) throw txError

      // Update wallet balance
      await supabaseClient
        .from('wallets')
        .update({
          balance: wallet.balance - amount,
          pending_balance: wallet.pending_balance + amount
        })
        .eq('id', wallet.id)

      return new Response(
        JSON.stringify({ 
          transaction,
          message: 'Withdrawal request submitted successfully'
        }),
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
