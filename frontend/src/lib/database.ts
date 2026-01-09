import { supabase } from "./supabase";

// ============================================
// PROFILE FUNCTIONS
// ============================================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  region?: string;
  preferred_games?: string[];
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// TOURNAMENT FUNCTIONS
// ============================================

export async function getTournaments(filters?: {
  status?: string;
  game?: string;
  limit?: number;
}) {
  let query = supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.game) {
    query = query.eq('game', filters.game);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getTournament(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single();

  if (error) throw error;
  return data;
}

export async function joinTournament(tournamentId: string, userId: string) {
  const { data, error} = await supabase
    .from('tournament_participants')
    .insert({
      tournament_id: tournamentId,
      user_id: userId,
      status: 'registered'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTournaments(userId: string, status?: string) {
  let query = supabase
    .from('tournament_participants')
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// ============================================
// MATCH FUNCTIONS
// ============================================

export async function getUserMatches(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      tournament:tournaments(name, game)
    `)
    .or(`player1_id.eq.{userId},player2_id.eq.${userId}`)
    .order('scheduled_time', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getNextMatch(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      tournament:tournaments(name, game, prize_pool)
    `)
    .or(`player1_id.eq.{userId},player2_id.eq.${userId}`)
    .eq('status', 'scheduled')
    .gte('scheduled_time', new Date().toISOString())
    .order('scheduled_time', { ascending: true })
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function updateMatchResult(matchId: string, updates: {
  status?: string;
  winner_id?: string;
  player1_score?: number;
  player2_score?: number;
  result_verified?: boolean;
}) {
  const { data, error } = await supabase
    .from('matches')
    .update(updates)
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// TRANSACTION FUNCTIONS
// ============================================

export async function getUserTransactions(userId: string, limit?: number) {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createTransaction(transaction: {
  user_id: string;
  type: string;
  amount: number;
  description: string;
  tournament_id?: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;

  // Update user balance
  if (transaction.type === 'prize') {
    await updateUserBalance(transaction.user_id, transaction.amount, 'add', 'pending');
  } else if (transaction.type === 'entry') {
    await updateUserBalance(transaction.user_id, Math.abs(transaction.amount), 'subtract', 'available');
  }

  return data;
}

async function updateUserBalance(
  userId: string,
  amount: number,
  operation: 'add' | 'subtract',
  balanceType: 'available' | 'pending'
) {
  const field = balanceType === 'available' ? 'available_balance' : 'pending_balance';
  
  const { data: profile } = await supabase
    .from('profiles')
    .select(field)
    .eq('id', userId)
    .single();

  if (!profile) return;

  const currentBalance = (profile as any)[field] || 0;
  const newBalance = operation === 'add' 
    ? currentBalance + amount 
    : currentBalance - amount;

  await supabase
    .from('profiles')
    .update({ [field]: Math.max(0, newBalance) })
    .eq('id', userId);
}

// ============================================
// WITHDRAWAL FUNCTIONS
// ============================================

export async function createWithdrawalRequest(request: {
  user_id: string;
  amount: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  routing_number?: string;
}) {
  // Check if user has sufficient balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('available_balance')
    .eq('id', request.user_id)
    .single();

  if (!profile || profile.available_balance < request.amount) {
    throw new Error('Insufficient balance');
  }

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert(request)
    .select()
    .single();

  if (error) throw error;

  // Deduct from available balance
  await updateUserBalance(request.user_id, request.amount, 'subtract', 'available');

  return data;
}

export async function getUserWithdrawalRequests(userId: string) {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('user_id', userId)
    .order('request_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserSettings(userId: string, settings: {
  notifications_tournaments?: boolean;
  notifications_matches?: boolean;
  notifications_messages?: boolean;
  notifications_marketing?: boolean;
  theme?: string;
  language?: string;
}) {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

export async function getUserNotifications(userId: string, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

export async function getLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data || [];
}
