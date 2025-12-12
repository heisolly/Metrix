// Core Types for Metrix Gaming Platform Frontend

// =================================================================
// USER TYPES
// =================================================================
export enum UserRole {
  PLAYER = "player",
  SPECTATOR = "spectator",
  ADMIN = "admin",
}

export enum UserStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BANNED = "banned",
}

export enum AccountTier {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
  DIAMOND = "diamond",
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  accountTier: AccountTier;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  gamingUsername?: string;
  gamePreferences?: GamePreferences;
  socialLinks?: SocialLinks;
  totalTournamentsPlayed: number;
  totalTournamentsWon: number;
  totalEarnings: number;
  winRate: number;
  skillRating: number;
  spectatorRating: number;
  totalMatchesSpectated: number;
  spectatorEarnings: number;
  walletBalance: number;
  pendingBalance: number;
  bankAccountNumber?: string;
  bankCode?: string;
  bankAccountName?: string;
  notificationPreferences?: NotificationPreferences;
  privacySettings?: PrivacySettings;
  createdAt: string;
  updatedAt: string;
}

export interface GamePreferences {
  favoriteGames: string[];
  skillLevel: "beginner" | "intermediate" | "advanced" | "professional";
  preferredGameModes: string[];
}

export interface SocialLinks {
  discord?: string;
  twitch?: string;
  youtube?: string;
  twitter?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  tournaments: boolean;
  matches: boolean;
  payments: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private";
  showEarnings: boolean;
  showStats: boolean;
}

// =================================================================
// AUTHENTICATION TYPES
// =================================================================
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phoneNumber?: string;
  country?: string;
  agreeToTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// =================================================================
// TOURNAMENT TYPES
// =================================================================
export enum TournamentStatus {
  DRAFT = "draft",
  UPCOMING = "upcoming",
  REGISTRATION_OPEN = "registration_open",
  REGISTRATION_CLOSED = "registration_closed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TournamentType {
  SINGLE_ELIMINATION = "single_elimination",
  DOUBLE_ELIMINATION = "double_elimination",
  ROUND_ROBIN = "round_robin",
  SWISS = "swiss",
  BATTLE_ROYALE = "battle_royale",
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  gameMode: string;
  type: TournamentType;
  status: TournamentStatus;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  prizeDistribution: PrizeDistribution[];
  prizes?: PrizeDistribution[];
  rules: string[];
  requirements: string[];
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationDeadline: string;
  region?: string;
  platform?: string;
  organizerId: string;
  organizer: User;
  participants: TournamentParticipant[];
  matches: Match[];
  brackets?: TournamentBracket;
  settings: TournamentSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  user: User;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  seed?: number;
  eliminated: boolean;
  eliminatedAt?: string;
  finalRank?: number;
  prizeWon?: number;
}

export interface PrizeDistribution {
  position: number;
  percentage: number;
  amount: number;
}

export interface TournamentSettings {
  allowSpectators: boolean;
  requireCheckIn: boolean;
  checkInDeadline?: string;
  autoAdvancement: boolean;
  thirdPlaceMatch: boolean;
  customFields?: Record<string, any>;
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  userId: string;
  user?: User;
  teamName?: string;
  teamMembers?: string[];
  gamingId: string;
  status: "pending" | "confirmed" | "cancelled";
  registeredAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  notes?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  seed?: number;
}

export interface TournamentBracket {
  rounds: BracketRound[];
  grandFinal?: Match;
  thirdPlaceMatch?: Match;
}

export interface BracketRound {
  roundNumber: number;
  name: string;
  matches: Match[];
}

// =================================================================
// MATCH TYPES
// =================================================================
export enum MatchStatus {
  SCHEDULED = "scheduled",
  READY = "ready",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  DISPUTED = "disputed",
}

export interface Match {
  id: string;
  tournamentId: string;
  tournament: Tournament;
  roundNumber: number;
  matchNumber: number;
  player1Id?: string;
  player2Id?: string;
  player1: User;
  player2: User;
  winnerId?: string;
  winner?: User;
  status: MatchStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  scores: MatchScore[];
  spectators: MatchSpectator[];
  results: MatchResult[];
  disputes: MatchDispute[];
  chatMessages: MatchChatMessage[];
  settings: MatchSettings;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MatchScore {
  playerId: string;
  score: number;
  details?: Record<string, any>;
}

export interface MatchSpectator {
  id: string;
  matchId: string;
  userId: string;
  user: User;
  assignedAt: string;
  reportSubmitted: boolean;
  reportSubmittedAt?: string;
  earnings?: number;
  rating?: number;
}

export interface MatchResult {
  id: string;
  matchId: string;
  submittedById: string;
  submittedBy: User;
  winnerId: string;
  scores: MatchScore[];
  evidence?: string[];
  verified: boolean;
  verifiedById?: string;
  verifiedAt?: string;
  submittedAt: string;
}

export interface MatchDispute {
  id: string;
  matchId: string;
  reporterId: string;
  reporter: User;
  reason: string;
  description: string;
  evidence?: string[];
  status: "pending" | "investigating" | "resolved" | "dismissed";
  resolution?: string;
  resolvedById?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface MatchChatMessage {
  id: string;
  matchId: string;
  userId: string;
  user: User;
  message: string;
  type: "message" | "system" | "announcement";
  createdAt: string;
}

export interface MatchSettings {
  bestOf: number;
  mapPool?: string[];
  serverInfo?: ServerInfo;
  customRules?: string[];
}

export interface ServerInfo {
  name: string;
  ip: string;
  port?: number;
  password?: string;
  gameMode: string;
}

// =================================================================
// PAYMENT TYPES
// =================================================================
export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export enum PaymentType {
  TOURNAMENT_ENTRY = "tournament_entry",
  WITHDRAWAL = "withdrawal",
  PRIZE_PAYOUT = "prize_payout",
  REFUND = "refund",
  DEPOSIT = "deposit",
}

export interface Payment {
  id: string;
  userId: string;
  user: User;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  fees?: number;
  netAmount: number;
  reference: string;
  externalReference?: string;
  description: string;
  metadata?: Record<string, any>;
  tournamentId?: string;
  tournament?: Tournament;
  paymentMethod?: PaymentMethod;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  type: "bank_transfer" | "card" | "wallet";
  details: Record<string, any>;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountNumber: string;
  bankCode: string;
  bankAccountName: string;
  narration?: string;
}

// =================================================================
// API RESPONSE TYPES
// =================================================================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  pagination?: PaginationMeta;
}

export interface ApiError {
  name: string;
  message: string;
  statusCode: number;
  status: string;
  code: string;
  timestamp: string;
  path?: string;
  method?: string;
  details?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// =================================================================
// FORM TYPES
// =================================================================
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "date"
    | "file";
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: FormOption[];
  defaultValue?: any;
  disabled?: boolean;
  description?: string;
}

export interface FormOption {
  label: string;
  value: any;
  disabled?: boolean;
}

// =================================================================
// NOTIFICATION TYPES
// =================================================================
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId?: string;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface Toast {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// =================================================================
// DASHBOARD TYPES
// =================================================================
export interface DashboardStats {
  totalTournaments: number;
  activeTournaments: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  popularGames: GameStats[];
  recentActivity: Activity[];
  upcomingMatches: Match[];
}

export interface GameStats {
  game: string;
  tournaments: number;
  players: number;
  revenue: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId?: string;
  user?: User;
  tournamentId?: string;
  tournament?: Tournament;
  createdAt: string;
}

export interface PlayerStats {
  totalTournaments: number;
  tournamentsWon: number;
  winRate: number;
  totalEarnings: number;
  currentRank: number;
  recentMatches: Match[];
  upcomingTournaments: Tournament[];
  favoriteGames: string[];
}

export interface SpectatorStats {
  totalMatchesSpectated: number;
  totalEarnings: number;
  averageRating: number;
  recentAssignments: MatchSpectator[];
  upcomingMatches: Match[];
}

// =================================================================
// THEME & UI TYPES
// =================================================================
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  toasts: Toast[];
}

// =================================================================
// WEBSOCKET TYPES
// =================================================================
export interface SocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface MatchUpdateEvent {
  matchId: string;
  update: Partial<Match>;
  type:
    | "status_change"
    | "score_update"
    | "chat_message"
    | "spectator_assignment";
}

export interface TournamentUpdateEvent {
  tournamentId: string;
  update: Partial<Tournament>;
  type: "status_change" | "participant_joined" | "bracket_updated";
}

// =================================================================
// UTILITY TYPES
// =================================================================
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Create/Update types
export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserData = Partial<
  Omit<User, "id" | "email" | "createdAt" | "updatedAt">
>;
export type CreateTournamentData = Omit<
  Tournament,
  "id" | "participants" | "matches" | "createdAt" | "updatedAt"
>;
export type UpdateTournamentData = Partial<
  Omit<Tournament, "id" | "createdAt" | "updatedAt">
>;

// Filter types
export interface TournamentFilters {
  status?: TournamentStatus[];
  game?: string[];
  type?: TournamentType[];
  entryFeeMin?: number;
  entryFeeMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}

export interface UserFilters {
  role?: UserRole[];
  status?: UserStatus[];
  accountTier?: AccountTier[];
  country?: string[];
  isEmailVerified?: boolean;
  search?: string;
}

// =================================================================
// CONSTANTS
// =================================================================
export const SUPPORTED_GAMES = [
  "Counter-Strike 2",
  "FIFA 24",
  "Call of Duty",
  "Valorant",
  "League of Legends",
  "Dota 2",
  "Apex Legends",
  "Fortnite",
  "Rocket League",
  "Overwatch 2",
] as const;

export const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Uganda",
  "Tanzania",
] as const;

export const BANK_CODES = [
  { code: "044", name: "Access Bank" },
  { code: "014", name: "Afribank" },
  { code: "023", name: "Citibank" },
  { code: "050", name: "Ecobank" },
  { code: "011", name: "First Bank" },
  { code: "214", name: "First City Monument Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "033", name: "United Bank for Africa" },
  { code: "032", name: "Union Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
] as const;

export type SupportedGame = (typeof SUPPORTED_GAMES)[number];
export type Country = (typeof COUNTRIES)[number];
