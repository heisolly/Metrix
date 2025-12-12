/**
 * Paystack Payment Integration
 * Reliable payment gateway for Nigeria
 */

// Paystack Test Keys (Replace with your own)
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_key_here";

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (multiply by 100)
  metadata?: Record<string, any>;
  onSuccess: (reference: any) => void;
  onClose?: () => void;
}

/**
 * Convert Naira to Kobo
 * Paystack expects amount in kobo (smallest currency unit)
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Convert Kobo to Naira
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
