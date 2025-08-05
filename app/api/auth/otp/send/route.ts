// app/api/auth/otp/send/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendVerificationOtp } from '@/lib/sms';

const sendOtpSchema = z.object({
  phone: z.string().min(10, { message: "Phone number is required." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = sendOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const { phone } = validation.data;
    const verification = await sendVerificationOtp(phone);

    if (verification.status === 'pending') {
        return NextResponse.json({ message: 'OTP sent successfully.' });
    } else {
        throw new Error('Failed to send OTP. Please check the phone number.');
    }
  } catch (error: any) {
    console.error('[OTP SEND ERROR]', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
