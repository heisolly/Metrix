// Utility Functions for Metrix Gaming Platform Frontend

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

// =================================================================
// CLASS NAME UTILITIES
// =================================================================

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create conditional class names
 */
export function conditional(
  condition: boolean,
  trueClass: string,
  falseClass: string = "",
) {
  return condition ? trueClass : falseClass;
}

// =================================================================
// STRING UTILITIES
// =================================================================

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 */
export function titleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert camelCase or PascalCase to kebab-case
 */
export function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "1-2").toLowerCase();
}

/**
 * Convert kebab-case or snake_case to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+/g, "");
}

/**
 * Extract initials from name
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Mask sensitive information
 */
export function maskString(
  str: string,
  maskChar: string = "*",
  visibleChars: number = 4,
): string {
  if (!str) return "";
  if (str.length <= visibleChars * 2) return str;

  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const middle = maskChar.repeat(str.length - visibleChars * 2);

  return start + middle + end;
}

// =================================================================
// NUMBER UTILITIES
// =================================================================

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN",
  locale: string = "en-NG",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number, precision: number = 1): string {
  const units = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(num)) / 3) | 0;

  if (tier === 0) return num.toString();

  const unit = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(precision) + unit;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate random number between min and max
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round to nearest decimal places
 */
export function roundTo(num: number, decimals: number = 2): number {
  return Number(Math.round(Number(num + "e" + decimals)) + "e-" + decimals);
}

// =================================================================
// DATE UTILITIES
// =================================================================

/**
 * Format date with various options
 */
export function formatDate(
  date: string | Date,
  formatStr: string = "MMM dd, yyyy",
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, formatStr);
  } catch {
    return "Invalid Date";
  }
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "Invalid Date";
  }
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  } catch {
    return false;
  }
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj < new Date();
  } catch {
    return false;
  }
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj > new Date();
  } catch {
    return false;
  }
}

/**
 * Get time remaining until date
 */
export function getTimeRemaining(date: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    const now = new Date().getTime();
    const target = dateObj.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
}

// =================================================================
// ARRAY UTILITIES
// =================================================================

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const value = String(item[key]);
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

// =================================================================
// OBJECT UTILITIES
// =================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const cloned = {} as { [key: string]: any };
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone((obj as { [key: string]: any })[key]);
    });
    return cloned as T;
  }
  return obj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof result[key] === "object" &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }

  return result;
}

/**
 * Pick keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
}

/**
 * Get nested object value by path
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Set nested object value by path
 */
export function set(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const lastKey = keys.pop()!;

  let current = obj;
  for (const key of keys) {
    if (
      !(key in current) ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Nigerian)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+234|234|0)[789][01]\d{8}/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters long");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  if (!/[!@#%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  return {
    isValid: feedback.length === 0,
    score,
    feedback,
  };
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}/;
  return usernameRegex.test(username);
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// =================================================================
// FILE UTILITIES
// =================================================================

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `{size.toFixed(1)} ${sizes[i]}`;
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+/, "");
}

/**
 * Check if file is image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(`.${extension}`);
}

/**
 * Generate file preview URL
 */
export function createFilePreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =================================================================
// BROWSER UTILITIES
// =================================================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Get device type
 */
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Get browser information
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  userAgent: string;
} {
  const userAgent = navigator.userAgent;
  let name = "Unknown";
  let version = "Unknown";

  if (userAgent.includes("Chrome")) {
    name = "Chrome";
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Firefox")) {
    name = "Firefox";
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Safari")) {
    name = "Safari";
    version = userAgent.match(/Version\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Edge")) {
    name = "Edge";
    version = userAgent.match(/Edge\/(\d+)/)?.[1] || "Unknown";
  }

  return { name, version, userAgent };
}

/**
 * Download file from URL
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate QR code data URL
 */
export function generateQRCodeDataUrl(
  text: string,
  size: number = 200,
): string {
  // This is a simple implementation. In a real app, you might want to use a QR code library
  return `https://api.qrserver.com/v1/create-qr-code/?size={size}x{size}&data=${encodeURIComponent(text)}`;
}

// =================================================================
// GAMING SPECIFIC UTILITIES
// =================================================================

/**
 * Format gaming username with platform prefix
 */
export function formatGamingUsername(
  username: string,
  platform?: string,
): string {
  if (!platform) return username;
  return `{platform}:${username}`;
}

/**
 * Calculate tournament win rate
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return roundTo((wins / total) * 100, 1);
}

/**
 * Generate tournament bracket positions
 */
export function generateBracketPositions(participantCount: number): number[][] {
  const rounds = Math.ceil(Math.log2(participantCount));
  const positions: number[][] = [];

  for (let round = 0; round < rounds; round++) {
    const roundPositions = Math.pow(2, rounds - round - 1);
    positions.push(Array.from({ length: roundPositions }, (_, i) => i));
  }

  return positions;
}

/**
 * Format match score
 */
export function formatMatchScore(
  player1Score: number,
  player2Score: number,
): string {
  return `{player1Score} - ${player2Score}`;
}

/**
 * Get skill level color
 */
export function getSkillLevelColor(level: string): string {
  const colors = {
    beginner: "text-green-500",
    intermediate: "text-yellow-500",
    advanced: "text-orange-500",
    professional: "text-red-500",
  };
  return colors[level as keyof typeof colors] || "text-gray-500";
}

/**
 * Get account tier color
 */
export function getAccountTierColor(tier: string): string {
  const colors = {
    bronze: "text-tier-bronze",
    silver: "text-tier-silver",
    gold: "text-tier-gold",
    platinum: "text-tier-platinum",
    diamond: "text-tier-diamond",
  };
  return colors[tier as keyof typeof colors] || "text-gray-500";
}

/**
 * Get tournament status color
 */
export function getTournamentStatusColor(status: string): string {
  const colors = {
    draft: "text-gray-500",
    upcoming: "text-blue-500",
    registration_open: "text-green-500",
    registration_closed: "text-yellow-500",
    in_progress: "text-purple-500",
    completed: "text-gray-500",
    cancelled: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
}

// =================================================================
// LOCAL STORAGE UTILITIES
// =================================================================

/**
 * Safe localStorage operations
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// =================================================================
// DEBOUNCE AND THROTTLE
// =================================================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// =================================================================
// ERROR HANDLING
// =================================================================

/**
 * Safe async function execution
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallback?: T,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    return {
      data: fallback || null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Retry async function with exponential backoff
 */
export async function retryAsync<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Export all utilities as default object
export default {
  // Class utilities
  cn,
  conditional,

  // String utilities
  capitalize,
  titleCase,
  kebabCase,
  camelCase,
  truncate,
  randomString,
  slugify,
  getInitials,
  maskString,

  // Number utilities
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculatePercentage,
  clamp,
  randomNumber,
  roundTo,

  // Date utilities
  formatDate,
  getRelativeTime,
  isToday,
  isPast,
  isFuture,
  getTimeRemaining,

  // Array utilities
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  chunk,
  shuffle,
  randomItem,
  randomItems,

  // Object utilities
  deepClone,
  deepMerge,
  pick,
  omit,
  isEmpty,
  get,
  set,

  // Validation utilities
  isValidEmail,
  isValidPhoneNumber,
  validatePassword,
  isValidUsername,
  isValidUrl,

  // File utilities
  formatFileSize,
  getFileExtension,
  getFileNameWithoutExtension,
  isImageFile,
  createFilePreviewUrl,

  // Browser utilities
  copyToClipboard,
  getDeviceType,
  isTouchDevice,
  getBrowserInfo,
  downloadFile,
  generateQRCodeDataUrl,

  // Gaming utilities
  formatGamingUsername,
  calculateWinRate,
  generateBracketPositions,
  formatMatchScore,
  getSkillLevelColor,
  getAccountTierColor,
  getTournamentStatusColor,

  // Storage utilities
  storage,

  // Function utilities
  debounce,
  throttle,
  safeAsync,
  retryAsync,
};
