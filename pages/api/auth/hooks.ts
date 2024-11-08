import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dimenzuri@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const payload = req.body
  const event = payload.type

  try {
    switch (event) {
      case 'signup':
        const { email, confirmation_token } = payload.record
        
        // Send confirmation email
        await transporter.sendMail({
          from: {
            name: 'LinkSea',
            address: 'dimenzuri@gmail.com'
          },
          to: email,
          subject: 'Confirm Your LinkSea Account',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Welcome to LinkSea!</h1>
              <p>Click the button below to confirm your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm?token=${confirmation_token}"
                   style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Confirm Email
                </a>
              </div>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
          `
        })
        break

      case 'recovery':
        // Handle password recovery
        const { email: recoveryEmail, token } = payload.record
        
        await transporter.sendMail({
          from: {
            name: 'LinkSea',
            address: 'dimenzuri@gmail.com'
          },
          to: recoveryEmail,
          subject: 'Reset Your LinkSea Password',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Reset Your Password</h1>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}"
                   style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          `
        })
        break

      default:
        console.log('Unhandled event type:', event)
    }

    res.status(200).json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Error processing webhook' })
  }
} 