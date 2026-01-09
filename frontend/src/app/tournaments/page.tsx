"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  Users,
  Trophy,
  Calendar,
} from "lucide-react";
import { useTournaments, useGames } from "@/hooks/useTournaments";
import type { TournamentListParams } from "@/services/tournament.service";
import type { TournamentType, TournamentStatus, Tournament } from "@/types";
import { cn, formatCurrency, formatDate } from "@/utils";

// =================================================================
// TOURNAMENTS PAGE
// =================================================================

export default function TournamentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filters, setFilters] = useState<TournamentListParams>({
    page: 1,
    limit: 12,
    sortBy: "startDate",
    sortOrder: "asc",
  });

  // Fetch tournaments
  const { data: tournamentsData, isLoading, error } = useTournaments(filters);
  const { data: games } = useGames();

  // Handle filter changes
  const updateFilter = (key: keyof TournamentListParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilter("search", query);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: "startDate",
      sortOrder: "asc",
    });
    setSearchQuery("");
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.game) count++;
    if (filters.format) count++;
    if (filters.status) count++;
    if (filters.minPrizePool || filters.maxPrizePool) count++;
    if (filters.minEntryFee || filters.maxEntryFee) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Header */}
      <div className="bg-gradient-to-r from-gaming-primary to-gaming-secondary">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tournaments
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Compete in exciting gaming tournaments and win prizes
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="sticky top-4 space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="badge badge-primary">
                        {activeFiltersCount}
                      </span>
                    )}
                  </h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gaming-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Game Filter */}
                <div className="card">
                  <h3 className="font-semibold mb-3">Game</h3>
                  <select
                    value={filters.game || ""}
                    onChange={(e) =>
                      updateFilter("game", e.target.value || undefined)
                    }
                    className="input w-full"
                  >
                    <option value="">All Games</option>
                    {games?.map((game: any) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="card">
                  <h3 className="font-semibold mb-3">Status</h3>
                  <div className="space-y-2">
                    {[
                      "registration_open",
                      "upcoming",
                      "in_progress",
                      "completed",
                    ].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={filters.status === status}
                          onChange={(e) =>
                            updateFilter(
                              "status",
                              e.target.value as TournamentStatus,
                            )
                          }
                          className="rounded text-gaming-primary focus:ring-gaming-primary"
                        />
                        <span className="capitalize">
                          {status.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={!filters.status}
                        onChange={() => updateFilter("status", undefined)}
                        className="rounded text-gaming-primary focus:ring-gaming-primary"
                      />
                      <span>All Statuses</span>
                    </label>
                  </div>
                </div>

                {/* Format Filter */}
                <div className="card">
                  <h3 className="font-semibold mb-3">Format</h3>
                  <select
                    value={filters.format || ""}
                    onChange={(e) =>
                      updateFilter("format", e.target.value || undefined)
                    }
                    className="input w-full"
                  >
                    <option value="">All Formats</option>
                    <option value="single_elimination">
                      Single Elimination
                    </option>
                    <option value="double_elimination">
                      Double Elimination
                    </option>
                    <option value="round_robin">Round Robin</option>
                    <option value="swiss">Swiss</option>
                  </select>
                </div>

                {/* Prize Pool Filter */}
                <div className="card">
                  <h3 className="font-semibold mb-3">Prize Pool</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrizePool || ""}
                        onChange={(e) =>
                          updateFilter(
                            "minPrizePool",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={filters.maxPrizePool || ""}
                        onChange={(e) =>
                          updateFilter(
                            "maxPrizePool",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Entry Fee Filter */}
                <div className="card">
                  <h3 className="font-semibold mb-3">Entry Fee</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Min Fee
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minEntryFee || ""}
                        onChange={(e) =>
                          updateFilter(
                            "minEntryFee",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Max Fee
                      </label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={filters.maxEntryFee || ""}
                        onChange={(e) =>
                          updateFilter(
                            "maxEntryFee",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="input w-full pl-10"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline lg:hidden"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {tournamentsData?.total || 0} tournaments found
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={`{filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-");
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: sortBy as any,
                        sortOrder: sortOrder as "asc" | "desc",
                      }));
                    }}
                    className="input"
                  >
                    <option value="startDate-asc">Date: Soonest</option>
                    <option value="startDate-desc">Date: Latest</option>
                    <option value="prizePool-desc">Prize: Highest</option>
                    <option value="prizePool-asc">Prize: Lowest</option>
                    <option value="participants-desc">Most Popular</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex gap-2 border border-light-border dark:border-dark-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded transition-colors",
                        viewMode === "grid"
                          ? "bg-gaming-primary text-white"
                          : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary",
                      )}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 rounded transition-colors",
                        viewMode === "list"
                          ? "bg-gaming-primary text-white"
                          : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary",
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament List */}
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg mb-4" />
                    <div className="space-y-3">
                      <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded" />
                      <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load tournaments</p>
              </div>
            ) : !tournamentsData?.data?.length ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No tournaments found
                </h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Try adjusting your filters or check back later
                </p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1",
                  )}
                >
                  {tournamentsData.data.map((tournament: Tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {tournamentsData.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        updateFilter("page", (filters.page || 1) - 1)
                      }
                      disabled={filters.page === 1}
                      className="btn btn-outline"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4">
                      Page {filters.page} of {tournamentsData.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        updateFilter("page", (filters.page || 1) + 1)
                      }
                      disabled={filters.page === tournamentsData.totalPages}
                      className="btn btn-outline"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// TOURNAMENT CARD COMPONENT
// =================================================================

interface TournamentCardProps {
  tournament: Tournament;
  viewMode: "grid" | "list";
}

function TournamentCard({ tournament, viewMode }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      registration_open: "bg-green-500",
      upcoming: "bg-blue-500",
      in_progress: "bg-purple-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  if (viewMode === "list") {
    return (
      <motion.a
        href={`/tournaments/${tournament.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card card-hover flex flex-col md:flex-row gap-4"
      >
        <div className="md:w-48 h-32 bg-gradient-to-br from-gaming-primary to-gaming-secondary rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold">{tournament.name}</h3>
            <span
              className={cn(
                "tournament-status",
                getStatusColor(tournament.status),
                "text-white",
              )}
            >
              {tournament.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
            {tournament.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gaming-accent" />
              <span className="font-semibold">
                {formatCurrency(tournament.prizePool)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gaming-primary" />
              <span>
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gaming-secondary" />
              <span>{formatDate(tournament.startDate, "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={`/tournaments/${tournament.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card card-hover overflow-hidden"
    >
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-br from-gaming-primary to-gaming-secondary">
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              "tournament-status",
              getStatusColor(tournament.status),
              "text-white",
            )}
          >
            {tournament.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          {tournament.name}
        </h3>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
          {tournament.description}
        </p>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gaming-accent">
              <Trophy className="h-4 w-4" />
              Prize Pool
            </span>
            <span className="font-bold">
              {formatCurrency(tournament.prizePool)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gaming-primary">
              <Users className="h-4 w-4" />
              Participants
            </span>
            <span>
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gaming-secondary">
              <Calendar className="h-4 w-4" />
              Start Date
            </span>
            <span>{formatDate(tournament.startDate, "MMM dd")}</span>
          </div>

          {tournament.entryFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Entry Fee
              </span>
              <span className="font-semibold">
                {formatCurrency(tournament.entryFee)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-gaming-primary transition-all"
              style={{
                width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
