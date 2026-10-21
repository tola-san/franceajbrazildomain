import { NextRequest } from 'next/server'
import { render } from '@react-email/components'
import { ProductOrderSummaryEmail } from '@/components/email/QuotationTemplate'
import { QuotationResponseEmail } from '@/components/email/QuotationResponseEmail'
import { getFromAddress, getTransporter } from '@/lib/mailer'

// Nodemailer (SMTP) version of /api/send-quotation. The Resend version is untouched.
export async function POST(req: NextRequest) {
     const formData = await req.json()

     try {
          const transporter = getTransporter()
          const from = getFromAddress()

          const internalEmail = ProductOrderSummaryEmail({
               contact: formData.contact,
               products: formData.products,
          })
          const customerEmail = QuotationResponseEmail({
               contact: formData.contact,
               products: formData.products,
          })

          const [internalHtml, internalText, customerHtml, customerText] = await Promise.all([
               render(internalEmail),
               render(internalEmail, { plainText: true }),
               render(customerEmail),
               render(customerEmail, { plainText: true }),
          ])

          // nodemailer has no batch API — send both messages over the same connection.
          const results = await Promise.all([
               transporter.sendMail({
                    from,
                    to: process.env.RECEIVER_EMAIL!!,
                    replyTo: formData.contact.email,
                    subject: `New message from ${formData.contact.name} - ${formData.contact.subject}`,
                    html: internalHtml,
                    text: internalText,
               }),
               transporter.sendMail({
                    from: process.env.SUPPORT_EMAIL || from,
                    to: formData.contact.email,
                    subject: `Quotation Request Received – France AJ Alimentaire And Food LTDA Food & Export`,
                    html: customerHtml,
                    text: customerText,
               }),
          ])

          return Response.json({ data: results.map((info) => ({ id: info.messageId, accepted: info.accepted })) })
     } catch (error) {
          return Response.json({ error: (error as Error)?.message || 'Failed to send quotation' }, { status: 500 })
     }
}
