/**
 * AlatPay Payment Integration
 * Using react-alatpay SDK for popup payments
 */

export const ALATPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY || "f957181adde8484b973b7efa933f6ef6";
export const ALATPAY_SECRET_KEY = process.env.NEXT_PUBLIC_ALATPAY_SECRET_KEY || "7407371012444541b57febecc0de585e";
export const ALATPAY_BUSINESS_ID = process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID || "b019677e-cc27-436a-9bda-08dde19160cb";

export interface AlatPayConfig {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: any) => void;
  onClose?: () => void;
}

// Currency conversion helper
const USD_TO_NGN_RATE = 1650;

export function convertUSDToNGN(usd: number): number {
  return Math.round(usd * USD_TO_NGN_RATE);
}

export function convertNGNToUSD(ngn: number): number {
  return Math.round(ngn / USD_TO_NGN_RATE);
}
