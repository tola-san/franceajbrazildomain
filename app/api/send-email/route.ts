
import { Resend } from 'resend'
import { NextRequest } from 'next/server'
import { ContactFormEmail } from '@/components/email/emailTemplate'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const formData = await req.json()
  try {
    const { data, error } = await resend.emails.send({
         from: process.env.FROM_EMAIL!,
         to: process.env.RECEIVER_EMAIL!,
         subject: `New message from ${formData.name} - ${formData.subject}`,
         react: ContactFormEmail(formData),
    })

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
   return Response.json({ error }, { status: 500 });
  }
}
