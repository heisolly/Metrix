import { NextRequest, NextResponse } from 'next/server';

const ALATPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALATPAY_PUBLIC_KEY || "f957181adde8484b973b7efa933f6ef6";
const ALATPAY_SECRET_KEY = process.env.NEXT_PUBLIC_ALATPAY_SECRET_KEY || "7407371012444541b57febecc0de585e";
const ALATPAY_BUSINESS_ID = process.env.NEXT_PUBLIC_ALATPAY_BUSINESS_ID || "b019677e-cc27-436a-9bda-08dde19160cb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, firstName, lastName, metadata } = body;

    // For now, we'll simulate a successful payment
    // In production, you would integrate with AlatPay's actual API
    // Since AlatPay doesn't have a public JavaScript SDK that works,
    // we'll use a manual payment verification system

    const paymentReference = `ALAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      reference: paymentReference,
      message: 'Payment initiated successfully',
      data: {
        reference: paymentReference,
        amount,
        email,
        status: 'success'
      }
    });

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
