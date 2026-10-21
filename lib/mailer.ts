import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

/**
 * Nodemailer (SMTP) transport — the alternative to the Resend transport used by
 * the routes under /api/send-email and /api/send-quotation.
 *
 * Required env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 * Optional:
 *   SMTP_SECURE ("true" forces TLS on connect; defaults to port === 465)
 *   SMTP_FROM   (falls back to FROM_EMAIL)
 */
let transporter: Transporter | null = null

export function getTransporter(): Transporter {
     if (transporter) return transporter

     const host = process.env.SMTP_HOST
     const port = Number(process.env.SMTP_PORT || 587)
     const user = process.env.SMTP_USER
     const pass = process.env.SMTP_PASSWORD

     if (!host || !user || !pass) {
          throw new Error('Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD.')
     }

     transporter = nodemailer.createTransport({
          host,
          port,
          secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
          auth: { user, pass },
     })

     return transporter
}

export function getFromAddress(): string {
     const from = process.env.SMTP_FROM || process.env.FROM_EMAIL

     if (!from) {
          throw new Error('Missing sender address. Set SMTP_FROM or FROM_EMAIL.')
     }

     return from
}

