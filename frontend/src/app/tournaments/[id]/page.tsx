"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Info,
  Award,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Share2,
  Bookmark,
  MoreVertical,
  Gamepad2,
} from "lucide-react";
import {
  useTournament,
  useTournamentBracket,
  useTournamentParticipants,
  useTournamentEligibility,
  useRegisterTournament,
  useIsRegistered,
} from "@/hooks/useTournaments";
import { cn, formatCurrency, formatDate, getRelativeTime } from "@/utils";
import type { Tournament } from "@/types";

// =================================================================
// TOURNAMENT DETAILS PAGE
// =================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TournamentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<
    "overview" | "brackets" | "participants" | "rules"
  >("overview");

  // Fetch tournament data
  const { data: tournament, isLoading, error } = useTournament(id);
  const { data: bracket } = useTournamentBracket(id);
  const { data: participants } = useTournamentParticipants(id);
  const { data: eligibility } = useTournamentEligibility(id);
  const isRegistered = useIsRegistered(id);

  // Registration mutation
  const registerMutation = useRegisterTournament();

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  if (isLoading) {
    return <TournamentDetailsSkeleton />;
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            The tournament you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/tournaments" className="btn btn-primary">
            Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  const canRegister =
    tournament.status === "registration_open" &&
    !isRegistered &&
    eligibility?.eligible;

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gaming-primary to-gaming-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)' }} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Tournaments
          </Link>

          {/* Tournament Header */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Tournament Image */}
            <div className="w-full lg:w-80 h-64 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Trophy className="h-24 w-24 text-white/80" />
            </div>

            {/* Tournament Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {tournament.name}
                  </h1>
                  <p className="text-xl text-white/90">{tournament.game}</p>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "tournament-status px-4 py-2 text-sm font-semibold rounded-full",
                    getStatusColor(tournament.status),
                  )}
                >
                  {tournament.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-white/90 text-lg mb-6 max-w-3xl">
                {tournament.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-gaming-accent" />
                    <span className="text-white/70 text-sm">Prize Pool</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(tournament.prizePool)}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-gaming-primary" />
                    <span className="text-white/70 text-sm">Participants</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {tournament.currentParticipants}/
                    {tournament.maxParticipants}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gaming-secondary" />
                    <span className="text-white/70 text-sm">Start Date</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {formatDate(tournament.startDate, "MMM dd, yyyy")}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-white/70 text-sm">Entry Fee</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {tournament.entryFee === 0
                      ? "Free"
                      : formatCurrency(tournament.entryFee)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {canRegister && (
                  <button
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                    className="btn btn-gaming px-8"
                  >
                    {registerMutation.isPending
                      ? "Registering..."
                      : "Register Now"}
                  </button>
                )}
                {isRegistered && (
                  <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-white">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">You're Registered!</span>
                  </div>
                )}
                <button className="btn btn-outline text-white border-white/30 hover:bg-white/10">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
                <button className="btn btn-outline text-white border-white/30 hover:bg-white/10">
                  <Bookmark className="h-5 w-5" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-light-border dark:border-dark-border">
          {["overview", "brackets", "participants", "rules"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-3 font-semibold capitalize transition-colors relative",
                activeTab === tab
                  ? "text-gaming-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:text-gaming-primary",
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gaming-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <OverviewTab tournament={tournament} />
            )}
            {activeTab === "brackets" && (
              <BracketsTab bracket={bracket} tournament={tournament} />
            )}
            {activeTab === "participants" && (
              <ParticipantsTab
                participants={participants?.data || []}
                total={participants?.total || 0}
              />
            )}
            {activeTab === "rules" && <RulesTab tournament={tournament} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tournament Details */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Tournament Details</h3>
              <div className="space-y-4">
                <DetailItem
                  icon={<Gamepad2 className="h-5 w-5" />}
                  label="Game"
                  value={tournament.game}
                />
                <DetailItem
                  icon={<Info className="h-5 w-5" />}
                  label="Format"
                  value={tournament.type.replace("_", " ")}
                />
                <DetailItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Start Date"
                  value={formatDate(tournament.startDate, "PPP")}
                />
                <DetailItem
                  icon={<Clock className="h-5 w-5" />}
                  label="Registration Deadline"
                  value={formatDate(tournament.registrationDeadline, "PPP")}
                />
                <DetailItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Region"
                  value={tournament.region || "Global"}
                />
                <DetailItem
                  icon={<Users className="h-5 w-5" />}
                  label="Max Participants"
                  value={tournament.maxParticipants.toString()}
                />
              </div>
            </div>

            {/* Prize Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-gaming-accent" />
                Prize Distribution
              </h3>
              <div className="space-y-3">
                {tournament.prizes?.map((prize, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-light-border dark:border-dark-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-600 text-white"
                                : "bg-light-bg-tertiary dark:bg-dark-bg-tertiary",
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="font-semibold">
                        {index === 0
                          ? "Winner"
                          : index === 1
                            ? "Runner-up"
                            : `{index + 1}{getOrdinalSuffix(index + 1)} Place`}
                      </span>
                    </div>
                    <span className="font-bold text-gaming-accent">
                      {formatCurrency(prize.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            {eligibility && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Eligibility
                </h3>
                {eligibility.eligible ? (
                  <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        You're eligible!
                      </p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        You meet all the requirements to participate.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-600 dark:text-red-400">
                          Not Eligible
                        </p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          You don't meet the following requirements:
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {eligibility.reasons?.map((reason, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <AlertCircle className="h-4 w-4 text-gaming-danger flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Organizer Info */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Organizer</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaming-primary to-gaming-secondary flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div>
                  <p className="font-semibold">Metrix Gaming</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Official Tournament
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <RegistrationModal
          tournament={tournament}
          onClose={() => setShowRegisterModal(false)}
          onRegister={(data) => {
            registerMutation.mutate(data, {
              onSuccess: () => {
                setShowRegisterModal(false);
              },
            });
          }}
        />
      )}
    </div>
  );
}

// =================================================================
// OVERVIEW TAB
// =================================================================

function OverviewTab({ tournament }: { tournament: Tournament }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">About This Tournament</h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
          {tournament.description}
        </p>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Tournament Schedule</h2>
        <div className="space-y-4">
          <TimelineItem
            icon={<Calendar className="h-5 w-5" />}
            title="Registration Opens"
            time={formatDate(tournament.registrationStart, "PPP 'at' p")}
            isPast={new Date(tournament.registrationStart) < new Date()}
          />
          <TimelineItem
            icon={<Calendar className="h-5 w-5" />}
            title="Registration Closes"
            time={formatDate(tournament.registrationDeadline, "PPP 'at' p")}
            isPast={new Date(tournament.registrationDeadline) < new Date()}
          />
          <TimelineItem
            icon={<Play className="h-5 w-5" />}
            title="Tournament Starts"
            time={formatDate(tournament.startDate, "PPP 'at' p")}
            isPast={new Date(tournament.startDate) < new Date()}
          />
          <TimelineItem
            icon={<Trophy className="h-5 w-5" />}
            title="Tournament Ends"
            time={formatDate(tournament.endDate, "PPP 'at' p")}
            isPast={new Date(tournament.endDate) < new Date()}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Game Mode
            </p>
            <p className="font-semibold">{tournament.gameMode}</p>
          </div>
          <div className="p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Platform
            </p>
            <p className="font-semibold">
              {tournament.platform || "Cross-platform"}
            </p>
          </div>
          <div className="p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Region
            </p>
            <p className="font-semibold">{tournament.region || "Global"}</p>
          </div>
          <div className="p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Check-in Required
            </p>
            <p className="font-semibold">
              {tournament.settings?.requireCheckIn ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// BRACKETS TAB
// =================================================================

function BracketsTab({
  bracket,
  tournament,
}: {
  bracket: any;
  tournament: Tournament;
}) {
  if (!bracket) {
    return (
      <div className="card text-center py-12">
        <Trophy className="h-16 w-16 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
        <h3 className="text-xl font-bold mb-2">Brackets Not Available Yet</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          The tournament brackets will be generated after registration closes.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Tournament Bracket</h2>
      <div className="space-y-8">
        {bracket.rounds?.map((round: any, roundIndex: number) => (
          <div key={roundIndex}>
            <h3 className="text-lg font-bold mb-4">
              {round.name || `Round ${round.roundNumber}`}
            </h3>
            <div className="space-y-3">
              {round.matches?.map((match: any, matchIndex: number) => (
                <BracketMatch key={matchIndex} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketMatch({ match }: { match: any }) {
  return (
    <Link 
      href={`/dashboard/matches/${match.id}`}
      className="block border border-light-border dark:border-dark-border rounded-lg p-4 hover:border-gaming-primary transition-colors cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Match {match.matchId}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              match.status === "completed"
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : match.status === "in_progress"
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 animate-pulse"
                  : "bg-gray-500/20 text-gray-600 dark:text-gray-400",
            )}
          >
            {match.status.replace("_", " ")}
          </span>
          {match.status === "in_progress" && (
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              🔴 LIVE
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            match.winner === match.player1?.id
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-light-bg-tertiary dark:bg-dark-bg-tertiary",
          )}
        >
          <span className="font-semibold">
            {match.player1?.username || "TBD"}
          </span>
          {match.score && (
            <span className="font-bold">{match.score.split("-")[0]}</span>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            match.winner === match.player2?.id
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-light-bg-tertiary dark:bg-dark-bg-tertiary",
          )}
        >
          <span className="font-semibold">
            {match.player2?.username || "TBD"}
          </span>
          {match.score && (
            <span className="font-bold">{match.score.split("-")[1]}</span>
          )}
        </div>
      </div>
      {match.scheduledAt && (
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
          Scheduled: {formatDate(match.scheduledAt, "PPP 'at' p")}
        </p>
      )}
      <div className="mt-3 text-xs text-gaming-primary opacity-0 group-hover:opacity-100 transition-opacity text-center">
        Click to view live match details →
      </div>
    </Link>
  );
}

// =================================================================
// PARTICIPANTS TAB
// =================================================================

function ParticipantsTab({
  participants,
  total,
}: {
  participants: any[];
  total: number;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Participants ({total})</h2>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            No participants yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant: any, index: number) => (
            <div
              key={participant.id}
              className="flex items-center gap-4 p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
            >
              <div className="w-8 text-center font-bold text-light-text-secondary dark:text-dark-text-secondary">
                #{index + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaming-primary to-gaming-secondary flex items-center justify-center text-white font-bold text-lg">
                {participant.user?.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{participant.user?.username}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Registered {getRelativeTime(participant.registeredAt)}
                </p>
              </div>
              {participant.checkedIn && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Checked In</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =================================================================
// RULES TAB
// =================================================================

function RulesTab({ tournament }: { tournament: Tournament }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Tournament Rules</h2>
        <div className="prose dark:prose-invert max-w-none">
          <div className="space-y-4 text-light-text-secondary dark:text-dark-text-secondary">
            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                1. General Rules
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>All participants must register before the deadline</li>
                <li>Check-in is required 30 minutes before match time</li>
                <li>No-shows will result in automatic disqualification</li>
                <li>
                  Cheating or unsportsmanlike conduct will lead to immediate ban
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                2. Match Rules
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Matches must be completed within the scheduled time</li>
                <li>Screenshots or video proof required for all results</li>
                <li>Spectators must verify match results</li>
                <li>Disputes must be raised within 24 hours</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                3. Prize Distribution
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Prizes will be distributed within 7 days of tournament
                  completion
                </li>
                <li>Winners must verify their payment details</li>
                <li>Tax responsibilities lie with the prize recipients</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                4. Code of Conduct
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Treat all participants with respect</li>
                <li>No harassment, hate speech, or toxic behavior</li>
                <li>Follow platform and game terms of service</li>
                <li>Admin decisions are final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gaming-primary/10 border border-gaming-primary/30">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-gaming-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gaming-primary mb-2">
              Important Note
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              By registering for this tournament, you agree to abide by all
              rules and regulations. Violation of any rules may result in
              disqualification and potential ban from future tournaments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// HELPER COMPONENTS
// =================================================================

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gaming-primary">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
          {label}
        </p>
        <p className="font-semibold capitalize">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  time,
  isPast,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
  isPast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isPast
            ? "bg-green-500/20 text-green-600 dark:text-green-400"
            : "bg-gaming-primary/20 text-gaming-primary",
        )}
      >
        {icon}
      </div>
      <div className="flex-1 pb-4 border-b border-light-border dark:border-dark-border last:border-0">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {time}
        </p>
      </div>
    </div>
  );
}

function TournamentDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="bg-gradient-to-r from-gaming-primary to-gaming-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-white/20 rounded" />
            <div className="flex gap-6">
              <div className="w-80 h-64 bg-white/20 rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-white/20 rounded w-2/3" />
                <div className="h-6 bg-white/20 rounded w-1/2" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/20 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistrationModal({
  tournament,
  onClose,
  onRegister,
}: {
  tournament: Tournament;
  onClose: () => void;
  onRegister: (data: any) => void;
}) {
  const [gamingId, setGamingId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      tournamentId: tournament.id,
      gamingId,
      teamName: teamName || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-bold">Register for Tournament</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            {tournament.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-semibold mb-2">
              Gaming ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={gamingId}
              onChange={(e) => setGamingId(e.target.value)}
              placeholder="Enter your in-game username"
              className="input w-full"
              required
            />
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Your username for {tournament.game}
            </p>
          </div>

          {tournament.type.includes("team") && (
            <div>
              <label className="block font-semibold mb-2">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="input w-full"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              className="textarea w-full"
              rows={4}
            />
          </div>

          <div className="bg-gaming-primary/10 border border-gaming-primary/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Registration Fee</h3>
            <p className="text-2xl font-bold text-gaming-primary">
              {tournament.entryFee === 0
                ? "Free"
                : formatCurrency(tournament.entryFee)}
            </p>
            {tournament.entryFee > 0 && (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                This amount will be deducted from your wallet balance
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary flex-1">
              Confirm Registration
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-500",
    upcoming: "bg-blue-500",
    registration_open: "bg-green-500",
    registration_closed: "bg-yellow-500",
    in_progress: "bg-purple-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
