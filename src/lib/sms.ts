import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const adminPhone = process.env.ADMIN_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhone || !adminPhone) {
  console.warn("Twilio environment variables are not fully configured. SMS notifications will be disabled.");
}

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export async function sendNewReportSms(report: { description: string; urgency: string; }) {
  if (!client || !twilioPhone || !adminPhone) {
    console.log('Twilio client not initialized or phone numbers missing. Skipping SMS.');
    return;
  }
  
  try {
    const message = await client.messages.create({
      body: `New Hazard Report (${report.urgency}): ${report.description}`,
      from: twilioPhone,
      to: adminPhone,
    });
    console.log('SMS sent:', message.sid);
  } catch (error) {
    console.error('Failed to send SMS:', error);
    // We throw the error so the caller can decide how to handle it.
    throw error;
  }
}
