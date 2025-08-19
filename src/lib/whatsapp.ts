import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendWhatsappMessage(
  phone: string,
  data: { [key: number]: string },
  templateId: string
) {
  await client.messages.create({
    contentSid: templateId,
    contentVariables: JSON.stringify(data),
    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    to: `whatsapp:${phone}`,
  });
}
