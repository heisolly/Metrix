// React Query Hooks for Tournament Data Management

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tournamentService, type TournamentListParams } from "@/services/tournament.service";
import type { Tournament, TournamentRegistration } from "@/types";
import toast from "react-hot-toast";

// =================================================================
// QUERY KEYS
// =================================================================

export const tournamentKeys = {
  all: ["tournaments"] as const,
  lists: () => [...tournamentKeys.all, "list"] as const,
  list: (params?: TournamentListParams) =>
    [...tournamentKeys.lists(), params] as const,
  details: () => [...tournamentKeys.all, "detail"] as const,
  detail: (id: string) => [...tournamentKeys.details(), id] as const,
  featured: () => [...tournamentKeys.all, "featured"] as const,
  upcoming: () => [...tournamentKeys.all, "upcoming"] as const,
  bracket: (id: string) => [...tournamentKeys.all, "bracket", id] as const,
  participants: (id: string) =>
    [...tournamentKeys.all, "participants", id] as const,
  eligibility: (id: string) =>
    [...tournamentKeys.all, "eligibility", id] as const,
  registrations: () => [...tournamentKeys.all, "registrations"] as const,
  userTournaments: () => [...tournamentKeys.all, "user"] as const,
  matches: (id: string) => [...tournamentKeys.all, "matches", id] as const,
  standings: (id: string) => [...tournamentKeys.all, "standings", id] as const,
  stats: (id: string) => [...tournamentKeys.all, "stats", id] as const,
  games: () => ["games"] as const,
  formats: () => ["formats"] as const,
};

// =================================================================
// TOURNAMENT LIST HOOKS
// =================================================================

/**
 * Get paginated list of tournaments with filters
 */
export function useTournaments(params?: TournamentListParams) {
  return useQuery({
    queryKey: tournamentKeys.list(params),
    queryFn: async () => {
      const response = await tournamentService.getTournaments(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Get featured tournaments
 */
export function useFeaturedTournaments(limit: number = 5) {
  return useQuery({
    queryKey: [...tournamentKeys.featured(), limit],
    queryFn: async () => {
      const response = await tournamentService.getFeaturedTournaments(limit);
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get upcoming tournaments
 */
export function useUpcomingTournaments(limit: number = 10) {
  return useQuery({
    queryKey: [...tournamentKeys.upcoming(), limit],
    queryFn: async () => {
      const response = await tournamentService.getUpcomingTournaments(limit);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// =================================================================
// TOURNAMENT DETAIL HOOKS
// =================================================================

/**
 * Get single tournament details
 */
export function useTournament(id: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: tournamentKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournament(id);
      return response.data;
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get tournament bracket
 */
export function useTournamentBracket(
  tournamentId: string | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: tournamentKeys.bracket(tournamentId || ""),
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournamentBracket(tournamentId);
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get tournament participants
 */
export function useTournamentParticipants(
  tournamentId: string | undefined,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...tournamentKeys.participants(tournamentId || ""), page, limit],
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournamentParticipants(
        tournamentId,
        page,
        limit,
      );
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

/**
 * Get tournament standings
 */
export function useTournamentStandings(
  tournamentId: string | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: tournamentKeys.standings(tournamentId || ""),
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournamentStandings(tournamentId);
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get tournament matches
 */
export function useTournamentMatches(
  tournamentId: string | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: tournamentKeys.matches(tournamentId || ""),
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournamentMatches(tournamentId);
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get tournament stats
 */
export function useTournamentStats(
  tournamentId: string | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: tournamentKeys.stats(tournamentId || ""),
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.getTournamentStats(tournamentId);
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// =================================================================
// REGISTRATION HOOKS
// =================================================================

/**
 * Check tournament eligibility
 */
export function useTournamentEligibility(
  tournamentId: string | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: tournamentKeys.eligibility(tournamentId || ""),
    queryFn: async () => {
      if (!tournamentId) throw new Error("Tournament ID is required");
      const response = await tournamentService.checkEligibility(tournamentId);
      return response.data;
    },
    enabled: !!tournamentId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user's tournament registrations
 */
export function useUserRegistrations(
  status?: "pending" | "confirmed" | "cancelled",
) {
  return useQuery({
    queryKey: [...tournamentKeys.registrations(), status],
    queryFn: async () => {
      const response = await tournamentService.getUserRegistrations(status);
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

/**
 * Get user's tournament history
 */
export function useUserTournaments(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...tournamentKeys.userTournaments(), page, limit],
    queryFn: async () => {
      const response = await tournamentService.getUserTournaments(page, limit);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// =================================================================
// MUTATION HOOKS
// =================================================================

/**
 * Register for tournament mutation
 */
export function useRegisterTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: string;
      teamName?: string;
      teamMembers?: string[];
      gamingId: string;
      notes?: string;
    }) => {
      const response = await tournamentService.registerForTournament(data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.registrations(),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.participants(variables.tournamentId),
      });

      toast.success("Successfully registered for tournament!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to register for tournament";
      toast.error(errorMessage);
    },
  });
}

/**
 * Cancel tournament registration mutation
 */
export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      registrationId,
    }: {
      tournamentId: string;
      registrationId: string;
    }) => {
      const response = await tournamentService.cancelRegistration(
        tournamentId,
        registrationId,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.registrations(),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.participants(variables.tournamentId),
      });

      toast.success("Registration cancelled successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to cancel registration";
      toast.error(errorMessage);
    },
  });
}

// =================================================================
// UTILITY HOOKS
// =================================================================

/**
 * Get available games
 */
export function useGames() {
  return useQuery({
    queryKey: tournamentKeys.games(),
    queryFn: async () => {
      const response = await tournamentService.getGames();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (games don't change often)
  });
}

/**
 * Get tournament formats
 */
export function useFormats() {
  return useQuery({
    queryKey: tournamentKeys.formats(),
    queryFn: async () => {
      const response = await tournamentService.getFormats();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// =================================================================
// PREFETCH UTILITIES
// =================================================================

/**
 * Prefetch tournament details
 */
export function usePrefetchTournament() {
  const queryClient = useQueryClient();

  return (tournamentId: string) => {
    queryClient.prefetchQuery({
      queryKey: tournamentKeys.detail(tournamentId),
      queryFn: async () => {
        const response = await tournamentService.getTournament(tournamentId);
        return response.data;
      },
    });
  };
}

/**
 * Prefetch tournament bracket
 */
export function usePrefetchBracket() {
  const queryClient = useQueryClient();

  return (tournamentId: string) => {
    queryClient.prefetchQuery({
      queryKey: tournamentKeys.bracket(tournamentId),
      queryFn: async () => {
        const response = await tournamentService.getTournamentBracket(tournamentId);
        return response.data;
      },
    });
  };
}

// =================================================================
// HELPER HOOKS
// =================================================================

/**
 * Check if user is registered for a tournament
 */
export function useIsRegistered(tournamentId: string | undefined) {
  const { data: registrations } = useUserRegistrations();

  if (!tournamentId || !registrations) return false;

  return registrations.some(
    (reg) => reg.tournamentId === tournamentId && reg.status !== "cancelled",
  );
}

/**
 * Get registration status for a tournament
 */
export function useRegistrationStatus(tournamentId: string | undefined) {
  const { data: registrations } = useUserRegistrations();

  if (!tournamentId || !registrations) return null;

  return (
    registrations.find(
      (reg) => reg.tournamentId === tournamentId && reg.status !== "cancelled",
    )?.status || null
  );
}
