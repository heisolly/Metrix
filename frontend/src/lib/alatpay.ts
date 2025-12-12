/**
 * AlatPay Payment Integration
 * Official Web Plugin Integration for Next.js
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
  onError?: (error: any) => void;
}

/**
 * Initialize AlatPay Payment
 * Uses AlatPay Web Plugin
 */
export function initializeAlatPay(config: AlatPayConfig) {
  // Ensure AlatPay script is loaded
  if (typeof window === 'undefined') {
    console.error('❌ AlatPay can only be initialized in browser');
    config.onError?.({ message: 'AlatPay can only be initialized in browser' });
    return;
  }

  // Check if AlatPay is loaded
  if (!(window as any).AlatPay) {
    console.error('❌ AlatPay script not loaded. Please add the script to your page.');
    console.log('💡 Tip: Check if https://alatpay.ng/alatpay-inline.js is loaded');
    console.log('💡 Tip: Check browser console for script loading errors');
    config.onError?.({ message: 'AlatPay script not loaded. Please refresh the page and try again.' });
    return;
  }

  console.log('✅ AlatPay script loaded successfully');
  console.log('🔑 Using API Key:', ALATPAY_PUBLIC_KEY);
  console.log('🏢 Using Business ID:', ALATPAY_BUSINESS_ID);
  console.log('💰 Amount:', config.amount, 'NGN');

  try {
    const handler = (window as any).AlatPay.setup({
      apiKey: ALATPAY_PUBLIC_KEY,
      businessId: ALATPAY_BUSINESS_ID,
      amount: config.amount,
      currency: 'NGN',
      email: config.email,
      firstName: config.firstName,
      lastName: config.lastName,
      phone: config.phone || '',
      metadata: config.metadata || {},
      onSuccess: (response: any) => {
        console.log('✅ AlatPay Payment Successful:', response);
        config.onSuccess(response);
      },
      onClose: () => {
        console.log('ℹ️ AlatPay popup closed');
        config.onClose?.();
      },
      onError: (error: any) => {
        console.error('❌ AlatPay Payment Error:', error);
        config.onError?.(error);
      }
    });

    console.log('🚀 Opening AlatPay payment modal...');
    // Open payment modal
    handler.openIframe();
  } catch (error) {
    console.error('❌ Error initializing AlatPay:', error);
    console.log('💡 Error details:', JSON.stringify(error, null, 2));
    config.onError?.(error);
  }
}

/**
 * Load AlatPay Script
 * Call this once in your app layout
 */
export function loadAlatPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if already loaded
    if ((window as any).AlatPay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://alatpay.ng/alatpay-inline.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ AlatPay script loaded');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Failed to load AlatPay script');
      reject(new Error('Failed to load AlatPay script'));
    };

    document.body.appendChild(script);
  });
}

// Currency conversion helper
const USD_TO_NGN_RATE = 1650;

export function convertUSDToNGN(usd: number): number {
  return Math.round(usd * USD_TO_NGN_RATE);
}

export function convertNGNToUSD(ngn: number): number {
  return Math.round(ngn / USD_TO_NGN_RATE);
}
