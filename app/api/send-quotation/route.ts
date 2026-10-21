import { Resend } from 'resend'
import { NextRequest } from 'next/server'
import { ProductOrderSummaryEmail } from '@/components/email/QuotationTemplate'
import { QuotationResponseEmail } from '@/components/email/QuotationResponseEmail'

export async function POST(req: NextRequest) {
     const resend = new Resend(process.env.RESEND_API_KEY)
     const formData = await req.json()

     try {
          const { data, error } = await resend.batch.send([
               {
                    from: process.env.FROM_EMAIL!,
                    to: process.env.RECEIVER_EMAIL!,
                    subject: `New message from ${formData.contact.name} - ${formData.contact.subject}`,
                    react: ProductOrderSummaryEmail({
                         contact: formData.contact,
                         products: formData.products,
                    }),
               },
               {
                    from: 'support@franceajalimentaire.com',
                    to: formData.contact.email,
                    subject: `Quotation Request Received – France AJ Alimentaire And Food LTDA Food & Export`,
                    react: QuotationResponseEmail({
                         contact: formData.contact,
                         products: formData.products,
                    }),
               },
          ])

          if (error) {
               return Response.json({ error: error }, { status: 500 })
          }

          return Response.json({ data })
     } catch (error) {
          return Response.json({ error }, { status: 500 })
     }
}
