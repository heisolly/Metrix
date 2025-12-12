// AlatPay Configuration
export const ALATPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY || 'f957181adde8484b973b7efa933f6ef6';
export const ALATPAY_SECRET_KEY = process.env.NEXT_PUBLIC_ALATPAY_SECRET_KEY || '7407371012444541b57febecc0de585e';
export const ALATPAY_BUSINESS_ID = process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID || 'b019677e-cc27-436a-9bda-08dde19160cb';

export const alatpayConfig = {
  publicKey: ALATPAY_PUBLIC_KEY,
  secretKey: ALATPAY_SECRET_KEY,
  businessId: ALATPAY_BUSINESS_ID,
  currency: 'NGN',
};

// Convert USD to NGN (Nigerian Naira)
const USD_TO_NGN_RATE = 1650; // Update this rate as needed

export function convertUSDToNGN(usd: number): number {
  return Math.round(usd * USD_TO_NGN_RATE); // AlatPay expects amount in Naira
}

export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

