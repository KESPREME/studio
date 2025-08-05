
"use server";

import twilio from 'twilio';

// This is a server action, so it's safe to use environment variables here.
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const adminPhone = process.env.ADMIN_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SID;

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

if (!accountSid || !authToken || !twilioPhone || !adminPhone) {
  console.warn("Twilio messaging environment variables are not fully configured. SMS notifications will be disabled.");
}

if (!verifyServiceSid) {
    console.warn("Twilio Verify Service SID is not configured. OTP functionality will be disabled.");
}


export async function sendNewReportSms(report: { description: string; urgency: string; }) {
  if (!client || !twilioPhone || !adminPhone) {
    console.log('Twilio client not initialized or phone numbers missing. Skipping admin SMS.');
    return;
  }
  
  try {
    const message = await client.messages.create({
      body: `New Hazard Report (${report.urgency}): ${report.description}`,
      from: twilioPhone,
      to: adminPhone,
    });
    console.log('Admin alert SMS sent:', message.sid);
  } catch (error) {
    console.error('Failed to send admin SMS:', error);
    // We don't re-throw here because report creation should not fail if SMS does.
  }
}

export async function sendMassAlertSms(report: { description: string; urgency: string; }, toNumbers: string[]) {
   if (!client || !twilioPhone) {
    console.log('Twilio client not initialized or sending number missing. Skipping mass alert.');
    return;
  }
  
  const uniqueNumbers = [...new Set(toNumbers)];
  console.log(`Sending mass alert to ${uniqueNumbers.length} unique numbers.`);

  const promises = uniqueNumbers.map(number => {
    return client.messages.create({
      body: `**High Urgency Alert**\nA new hazard has been reported in your area: ${report.description}. Please be cautious.`,
      from: twilioPhone,
      to: number,
    }).then(message => {
      console.log(`Mass alert SMS sent to ${number}: ${message.sid}`);
    }).catch(error => {
      console.error(`Failed to send mass alert SMS to ${number}:`, error);
    });
  });

  try {
    await Promise.all(promises);
    console.log('Finished sending all mass alert SMS messages.');
  } catch (error) {
    console.error('An error occurred during mass alert SMS sending:', error);
  }
}

export async function sendVerificationOtp(phone: string) {
    if (!client || !verifyServiceSid) {
        throw new Error("Twilio Verify is not configured on the server.");
    }
    return client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: phone, channel: 'sms' });
}

export async function checkVerificationOtp(phone: string, code: string) {
    if (!client || !verifyServiceSid) {
        throw new Error("Twilio Verify is not configured on the server.");
    }
    return client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: phone, code: code });
}


