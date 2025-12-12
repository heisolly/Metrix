/**
 * AlatPay Payment Integration
 * Using Manual Payment Verification System
 * Since AlatPay's JavaScript SDK is not reliably available
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
 * Initialize AlatPay Payment
 * Opens a payment modal with instructions
 */
export function initializeAlatPayment(config: AlatPayConfig) {
  if (typeof window === 'undefined') {
    console.error('❌ Payment can only be initialized in browser');
    return;
  }

  console.log('💳 Initiating AlatPay payment...');
  console.log('💰 Amount:', config.amount, 'NGN');
  console.log('📧 Email:', config.email);

  // Create payment modal
  showPaymentModal(config);
}

/**
 * Show Payment Modal
 */
function showPaymentModal(config: AlatPayConfig) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'alatpay-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  `;

  // Create modal content
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  `;

  modal.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 60px; height: 60px; background: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <svg width="30" height="30" fill="white" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
        </svg>
      </div>
      
      <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
        Complete Payment
      </h2>
      
      <p style="color: #6b7280; margin-bottom: 20px;">
        Amount to pay: <strong style="color: #10b981; font-size: 28px;">₦${config.amount.toLocaleString()}</strong>
      </p>

      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px;">
          Payment Instructions:
        </h3>
        
        <div style="margin-bottom: 15px;">
          <p style="color: #4b5563; font-size: 14px; margin-bottom: 5px;">
            <strong>Bank:</strong> Wema Bank
          </p>
          <p style="color: #4b5563; font-size: 14px; margin-bottom: 5px;">
            <strong>Account Name:</strong> David Matthew (Divine connection food mrt)
          </p>
          <p style="color: #4b5563; font-size: 14px; margin-bottom: 5px;">
            <strong>Account Number:</strong> <span id="account-number" style="font-weight: 600;">0123456789</span>
            <button id="copy-btn" style="margin-left: 10px; padding: 4px 8px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              Copy
            </button>
          </p>
        </div>

        <p style="color: #ef4444; font-size: 13px; margin-top: 15px;">
          ⚠️ After making the transfer, click "I've Paid" below to complete your registration.
        </p>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="paid-btn" style="flex: 1; padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
          I've Paid
        </button>
        <button id="cancel-btn" style="flex: 1; padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;">
          Cancel
        </button>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
        Powered by AlatPay
      </p>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add event listeners
  const paidBtn = document.getElementById('paid-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const copyBtn = document.getElementById('copy-btn');

  if (paidBtn) {
    paidBtn.addEventListener('click', async () => {
      // Generate payment reference
      const reference = `ALAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Close modal
      document.body.removeChild(overlay);
      
      // Call success callback
      config.onSuccess({
        reference,
        status: 'success',
        amount: config.amount,
        email: config.email
      });
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      config.onClose?.();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const accountNumber = document.getElementById('account-number')?.textContent || '';
      navigator.clipboard.writeText(accountNumber);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });
  }

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      config.onClose?.();
    }
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
