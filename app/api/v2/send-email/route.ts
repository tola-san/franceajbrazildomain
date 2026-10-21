import { NextRequest } from 'next/server'
import { render } from '@react-email/components'
import { ContactFormEmail } from '@/components/email/emailTemplate'
import { getFromAddress, getTransporter } from '@/lib/mailer'

// Nodemailer (SMTP) version of /api/send-email. The Resend version is untouched.
export async function POST(req: NextRequest) {
     const formData = await req.json()

     try {
          const transporter = getTransporter()
          const html = await render(ContactFormEmail(formData))
          const text = await render(ContactFormEmail(formData), { plainText: true })

          const info = await transporter.sendMail({
               from: getFromAddress(),
               to: process.env.RECEIVER_EMAIL!!,
               replyTo: formData.email,
               subject: `New message from ${formData.name} - ${formData.subject}`,
               html,
               text,
          })

          return Response.json({ id: info.messageId, accepted: info.accepted })
     } catch (error) {
          return Response.json({ error: (error as Error)?.message || 'Failed to send email' }, { status: 500 })
     }
}
