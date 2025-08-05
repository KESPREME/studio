// app/api/auth/otp/verify/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkVerificationOtp } from '@/lib/sms';

const verifyOtpSchema = z.object({
  phone: z.string().min(10, { message: "Phone number is required." }),
  code: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = verifyOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const { phone, code } = validation.data;
    const verificationCheck = await checkVerificationOtp(phone, code);

    if (verificationCheck.status === 'approved') {
        return NextResponse.json({ message: 'OTP verified successfully.' });
    } else {
        throw new Error(`OTP could not be verified. Status: ${verificationCheck.status}`);
    }

  } catch (error: any) {
    console.error('[OTP VERIFY ERROR]', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
