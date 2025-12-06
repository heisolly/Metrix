import { supabase } from './supabase';

// Type definitions for our database tables
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'player' | 'spectator' | 'admin' | 'organizer';
  region?: string;
  bio?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  platforms: string[];
  is_active: boolean;
  created_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  game_id: string;
  organizer_id: string;
  entry_fee: number;
  prize_pool?: number;
  max_players: number;
  current_players: number;
  format?: string;
  region?: string;
  start_time?: string;
  end_time?: string;
  status: 'draft' | 'open' | 'ongoing' | 'completed' | 'cancelled';
  rules?: string;
  bracket_data?: any;
  created_at: string;
  updated_at: string;
  games?: Game;
  users?: { organizer: string };
  tournament_participants?: { count: number }[];
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  entry_fee_paid: boolean;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_reference?: string;
  placement?: number;
  prize_won?: number;
  registered_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  round_number: number;
  match_number: number;
  player1_id?: string;
  player2_id?: string;
  spectator_id?: string;
  scheduled_time?: string;
  start_time?: string;
  end_time?: string;
  status: 'scheduled' | 'live' | 'completed' | 'disputed' | 'cancelled';
  player1_score?: number;
  player2_score?: number;
  winner_id?: string;
  match_data?: any;
  created_at: string;
  updated_at: string;
  tournaments?: Tournament & { games: Game };
  player1?: { username: string; avatar_url?: string };
  player2?: { username: string; avatar_url?: string };
  spectator?: { username: string };
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  pending_balance: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'prize' | 'fee' | 'bonus';
  amount: number;
  description?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tournament_id?: string;
  match_id?: string;
  processed_at?: string;
  created_at: string;
  tournaments?: { name: string };
  matches?: { id: string };
}

// API service functions
export const tournamentService = {
  async getTournaments(filters?: {
    game_id?: string;
    status?: string;
    region?: string;
    min_entry_fee?: number;
    max_entry_fee?: number;
  }) {
    let query = supabase
      .from('tournaments')
      .select(`
        *,
        games(*),
        users(organizer: username),
        tournament_participants(count)
      `);

    if (filters?.game_id) {
      query = query.eq('game_id', filters.game_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.min_entry_fee) {
      query = query.gte('entry_fee', filters.min_entry_fee);
    }
    if (filters?.max_entry_fee) {
      query = query.lte('entry_fee', filters.max_entry_fee);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tournament[];
  },

  async getTournament(id: string) {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        games(*),
        users(organizer: username),
        tournament_participants(
          *,
          users(username, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Tournament & { 
      games: Game;
      users: { organizer: string };
      tournament_participants: (TournamentParticipant & { users: { username: string; avatar_url?: string } })[];
    };
  },

  async joinTournament(tournamentId: string, userId: string) {
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: userId,
        entry_fee_paid: false,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTournamentStatus(tournamentId: string, status: string) {
    const { data, error } = await supabase
      .from('tournaments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', tournamentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const matchService = {
  async getMatch(id: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        tournaments(*, games(*)),
        player1:users!matches_player1_id_fkey(username, avatar_url),
        player2:users!matches_player2_id_fkey(username, avatar_url),
        spectator:users!matches_spectator_id_fkey(username)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Match;
  },

  async getMatchesForTournament(tournamentId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:users!matches_player1_id_fkey(username, avatar_url),
        player2:users!matches_player2_id_fkey(username, avatar_url),
        spectator:users!matches_spectator_id_fkey(username)
      `)
      .eq('tournament_id', tournamentId)
      .order('round_number', { ascending: true })
      .order('match_number', { ascending: true });

    if (error) throw error;
    return data as Match[];
  },

  async updateMatchStatus(matchId: string, status: string, updates?: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        ...updates
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const walletService = {
  async getWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error;
    }

    // Create wallet if it doesn't exist
    if (!data) {
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) throw createError;
      return newWallet as Wallet;
    }

    return data as Wallet;
  },

  async getTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        tournaments(name),
        matches(id)
      `)
      .eq('wallet_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Transaction[];
  },

  async createTransaction(walletId: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'wallet_id'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: walletId,
        ...transaction
      })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async updateWalletBalance(userId: string, updates: Partial<Wallet>) {
    const { data, error } = await supabase
      .from('wallets')
      .update({
        updated_at: new Date().toISOString(),
        ...updates
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Wallet;
  }
};

export const userService = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
        ...updates
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async getUsersByRole(role: User['role']) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
  }
};

// Real-time subscriptions
export const subscribeToMatch = (matchId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`match:${matchId}`)
    .on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'matches',
        filter: `id=eq.${matchId}`
      }, 
      callback
    )
    .subscribe();
};

export const subscribeToTournament = (tournamentId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`tournament:${tournamentId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'tournaments',
        filter: `id=eq.${tournamentId}`
      }, 
      callback
    )
    .subscribe();
};

export const subscribeToWallet = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`wallet:${userId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'wallets',
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe();
};
