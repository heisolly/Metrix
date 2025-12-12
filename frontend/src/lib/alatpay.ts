/**
 * AlatPay Payment Integration
 * Using AlatPay Web Plugin
 * Documentation: https://alatpay.ng/docs/web-plugin
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

/**
 * Initialize AlatPay Payment using Web Plugin
 * This uses the Alatpay.setup() method from their web plugin
 */
export function initializeAlatPayment(config: AlatPayConfig) {
  if (typeof window === 'undefined') {
    console.error('❌ AlatPay can only be initialized in browser');
    return;
  }

  // Check if Alatpay is loaded (note: lowercase 'p' in Alatpay)
  const AlatpaySDK = (window as any).Alatpay;
  
  if (!AlatpaySDK || !AlatpaySDK.setup) {
    console.error('❌ AlatPay SDK not loaded');
    console.log('💡 Make sure the AlatPay script is loaded');
    alert('Payment system not ready. Please refresh the page and try again.');
    return;
  }

  console.log('✅ AlatPay SDK loaded');
  console.log('🔑 Using Subscription Key (Public Key):', ALATPAY_PUBLIC_KEY);
  console.log('🏢 Using Business ID:', ALATPAY_BUSINESS_ID);
  console.log('💰 Amount:', config.amount, 'NGN');

  try {
    // Configure AlatPay
    const alatpayConfig = AlatpaySDK.setup({
      subscriptionKey: ALATPAY_PUBLIC_KEY, // This is the Public Key
      businessId: ALATPAY_BUSINESS_ID,
      email: config.email,
      amount: config.amount,
      currency: 'NGN',
      firstName: config.firstName,
      lastName: config.lastName,
      phone: config.phone || '',
      metadata: JSON.stringify(config.metadata || {}),
      onTransaction: function(response: any) {
        console.log('✅ AlatPay Transaction Response:', response);
        config.onSuccess(response);
      },
      onClose: function() {
        console.log('ℹ️ AlatPay dialog closed');
        config.onClose?.();
      }
    });

    console.log('🚀 Opening AlatPay payment dialog...');
    // Open the payment dialog
    alatpayConfig.openDialog();
  } catch (error) {
    console.error('❌ Error initializing AlatPay:', error);
    alert('Failed to initialize payment. Please try again.');
  }
}

/**
 * Load AlatPay Script
 */
export function loadAlatPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if already loaded
    if ((window as any).Alatpay) {
      console.log('✅ AlatPay already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://alatpay.ng/alatpay.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ AlatPay script loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Failed to load AlatPay script');
      reject(new Error('Failed to load AlatPay script'));
    };

    document.head.appendChild(script);
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
