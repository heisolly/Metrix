// Tournament Service for Metrix Gaming Platform Frontend - Supabase Impl

import { supabase } from "@/lib/supabase";
import type {
  Tournament,
  TournamentType,
  TournamentStatus,
  TournamentRegistration,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

// =================================================================
// TYPES AND INTERFACES
// =================================================================

export interface TournamentFilters {
  game?: string;
  format?: TournamentType;
  status?: TournamentStatus;
  minPrizePool?: number;
  maxPrizePool?: number;
  minEntryFee?: number;
  maxEntryFee?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TournamentListParams extends TournamentFilters {
  page?: number;
  limit?: number;
  sortBy?: "startDate" | "prizePool" | "participants" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface TournamentRegistrationData {
  tournamentId: string;
  teamName?: string;
  teamMembers?: string[];
  gamingId: string;
  notes?: string;
}

export interface TournamentEligibility {
  eligible: boolean;
  reasons?: string[];
}

export interface BracketData {
  rounds: any[];
  currentRound: number;
  totalRounds: number;
}

// =================================================================
// TOURNAMENT SERVICE
// =================================================================

class TournamentService {
  /**
   * Get paginated list of tournaments
   */
  async getTournaments(
    params?: TournamentListParams,
  ): Promise<ApiResponse<PaginatedResponse<Tournament>>> {
    try {
      let query = supabase
        .from("tournaments")
        .select("*", { count: "exact" });

      // Apply filters
      if (params?.game) query = query.eq("game", params.game);
      if (params?.format) query = query.eq("format", params.format);
      if (params?.status) query = query.eq("status", params.status);
      
      // Prize Pool Range
      if (params?.minPrizePool) query = query.gte("prize_pool", params.minPrizePool);
      if (params?.maxPrizePool) query = query.lte("prize_pool", params.maxPrizePool);
      
      // Entry Fee Range
      if (params?.minEntryFee) query = query.gte("entry_fee", params.minEntryFee);
      if (params?.maxEntryFee) query = query.lte("entry_fee", params.maxEntryFee);
      
      // Date Range
      if (params?.startDate) query = query.gte("start_date", params.startDate);
      if (params?.endDate) query = query.lte("end_date", params.endDate);
      
      // Search
      if (params?.search) {
        query = query.ilike("name", `%${params.search}%`);
      }

      // Sorting
      const sortBy = params?.sortBy === "startDate" ? "start_date" : 
                     params?.sortBy === "prizePool" ? "prize_pool" : 
                     params?.sortBy === "createdAt" ? "created_at" : 
                     "created_at";
      
      query = query.order(sortBy, { ascending: params?.sortOrder === "asc" });

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / limit);

      const paginatedResponse: PaginatedResponse<Tournament> = {
        data: data as any[],
        meta: {
          page: page,
          limit: limit,
          total: totalItems,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        page: page,
        limit: limit,
        total: totalItems,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return {
        data: paginatedResponse,
        status: "success",
        statusCode: 200,
      };
    } catch (error: any) {
      console.error("Error fetching tournaments:", error);
      return {
        error: {
          name: "FetchError",
          message: error.message || "Failed to fetch tournaments",
          statusCode: 500,
          status: "error",
          code: "INTERNAL_SERVER_ERROR",
        },
        status: "error",
        statusCode: 500,
      };
    }
  }

  /**
   * Get single tournament by ID
   */
  async getTournament(id: string): Promise<ApiResponse<Tournament>> {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        data: data as any,
        status: "success",
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        error: {
          name: "FetchError",
          message: error.message,
          statusCode: 404,
          status: "error",
          code: "NOT_FOUND",
        },
        status: "error",
        statusCode: 404,
      };
    }
  }

  /**
   * Get featured tournaments
   */
  async getFeaturedTournaments(
    limit: number = 5,
  ): Promise<ApiResponse<Tournament[]>> {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .in("status", ["upcoming", "registration_open"])
        .order("prize_pool", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        data: data as any[],
        status: "success",
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        error: {
          name: "FetchError",
          message: error.message,
          statusCode: 500,
          status: "error",
          code: "INTERNAL_SERVER_ERROR",
        },
        status: "error",
        statusCode: 500,
      };
    }
  }

  /**
   * Get upcoming tournaments
   */
  async getUpcomingTournaments(
    limit: number = 10,
  ): Promise<ApiResponse<Tournament[]>> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .gte("start_date", now)
        .order("start_date", { ascending: true })
        .limit(limit);

      if (error) throw error;

      return {
        data: data as any[],
        status: "success",
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        error: {
          name: "FetchError",
          message: error.message,
          statusCode: 500,
          status: "error",
          code: "INTERNAL_SERVER_ERROR",
        },
        status: "error",
        statusCode: 500,
      };
    }
  }

  /**
   * Get tournament participants
   * This would need a 'participants' or 'tournament_registrations' table
   */
  async getTournamentParticipants(
    tournamentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<TournamentRegistration>>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("tournament_participants") // Verify table name in real implementation
        .select("*, profile:player_id(username, avatar_url, country)", { count: "exact" })
        .eq("tournament_id", tournamentId)
        .range(from, to);
      
      if (error) {
         console.warn("Could not fetch participants", error);
         return {
            data: {
              data: [],
              meta: { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
              page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false
            },
            status: "success",
            statusCode: 200
         }
      }
      
      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / limit);

      const paginatedResponse: PaginatedResponse<TournamentRegistration> = {
        data: data as any[],
        meta: {
            page, limit, total: totalItems, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1
        },
        page, limit, total: totalItems, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1
      };

      return {
        data: paginatedResponse,
        status: "success",
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        error: { name: "Error", message: error.message, statusCode: 500, status: "error", code: "SERVER_ERROR" },
        status: "error",
        statusCode: 500,
      };
    }
  }

  /**
   * Get games list
   * Mocked for now or fetched from distinct games
   */
  async getGames(): Promise<ApiResponse<any[]>> {
    // Mock list of popular games
    const games = [
      { id: "cod", name: "Call of Duty", icon: "Gamepad2" },
      { id: "fortnite", name: "Fortnite", icon: "Crosshair" },
      { id: "fifa", name: "FIFA", icon: "Trophy" },
      { id: "valorant", name: "Valorant", icon: "Zap" },
      { id: "pubg", name: "PUBG Mobile", icon: "Smartphone" },
    ];
    
    return Promise.resolve({
      data: games,
      status: "success",
      statusCode: 200,
    });
  }
  
  // Implements other methods as no-ops or basic fetches for now to satisfy interface
  
  async getTournamentBracket(id: string): Promise<ApiResponse<BracketData>> {
      return { data: { rounds: [], currentRound: 0, totalRounds: 0 }, status: "success", statusCode: 200 };
  }

  async checkEligibility(id: string): Promise<ApiResponse<TournamentEligibility>> {
      return { data: { eligible: true }, status: "success", statusCode: 200 };
  }

  async registerForTournament(data: TournamentRegistrationData): Promise<ApiResponse<TournamentRegistration>> {
      // Implementation for writing to registration table
       try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Not authenticated");

        const { data: result, error } = await supabase
          .from("tournament_participants")
          .insert({
              tournament_id: data.tournamentId,
              player_id: user.user.id,
              status: 'pending',
              // other fields
          })
          .select()
          .single();
          
        if (error) throw error;
        
        return { data: result as any, status: "success", statusCode: 201 };
      } catch(e: any) {
         return { error: { name: "RegError", message: e.message, statusCode: 500, status: "error", code: "ERR" }, status: "error", statusCode: 500 };
      }
  }
  
  async cancelRegistration(tId: string, rId: string): Promise<ApiResponse<void>> {
      return { data: undefined, status: "success", statusCode: 200 };
  }

  async getUserRegistrations(status?: string): Promise<ApiResponse<TournamentRegistration[]>> {
      return { data: [], status: "success", statusCode: 200 };
  }
  
  async getUserTournaments(page=1, limit=10): Promise<ApiResponse<PaginatedResponse<Tournament>>> {
      const paginatedResponse: PaginatedResponse<Tournament> = {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
        page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false
      };
      
      return { 
          data: paginatedResponse, 
          status: "success", 
          statusCode: 200 
      };
  }

  async getTournamentMatches(id: string): Promise<ApiResponse<any[]>> {
    const { data } = await supabase.from('matches').select('*').eq('tournament_id', id);
    return { data: data || [], status: "success", statusCode: 200 };
  }
  
    async getTournamentRules(tournamentId: string): Promise<ApiResponse<any>> {
    return { data: {}, status: "success", statusCode: 200 };
  }

  async getTournamentStandings(
    tournamentId: string,
  ): Promise<ApiResponse<any[]>> {
    return { data: [], status: "success", statusCode: 200 };
  }

  async searchTournaments(
    query: string,
    limit: number = 10,
  ): Promise<ApiResponse<Tournament[]>> {
      const res = await this.getTournaments({ search: query, limit });
      return {
          ...res,
          data: res.data?.data || [] // Accessing .data.data which is the items array
      };
  }

  async getTournamentStats(tournamentId: string): Promise<ApiResponse<any>> {
    return { data: {}, status: "success", statusCode: 200 };
  }

  async getFormats(): Promise<ApiResponse<string[]>> {
    return { data: ["Single Elimination", "Double Elimination", "Round Robin"], status: "success", statusCode: 200 };
  }
}

export const tournamentService = new TournamentService();

export const {
  getTournaments,
  getTournament,
  getFeaturedTournaments,
  getUpcomingTournaments,
  getTournamentParticipants,
  getTournamentBracket,
  checkEligibility,
  registerForTournament,
  cancelRegistration,
  getUserRegistrations,
  getUserTournaments,
  getTournamentMatches,
  getTournamentRules,
  getTournamentStandings,
  searchTournaments,
  getTournamentStats,
  getGames,
  getFormats,
} = tournamentService;
