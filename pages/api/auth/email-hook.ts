import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dimenzuri@gmail.com',
    pass: 'hqbcxtstwpezdaea'
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { event, email, data } = req.body

  try {
    switch (event) {
      case 'SIGNUP':
        await transporter.sendMail({
          from: {
            name: 'LinkSea',
            address: 'dimenzuri@gmail.com'
          },
          to: email,
          subject: 'Welcome to LinkSea - Confirm Your Email',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #0ea5e9; text-align: center;">Welcome to LinkSea!</h1>
              <p>Thank you for signing up. Please confirm your email by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmUrl}"
                   style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Confirm Email
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
          `
        })
        break

      case 'RESET_PASSWORD':
        await transporter.sendMail({
          from: {
            name: 'LinkSea',
            address: 'dimenzuri@gmail.com'
          },
          to: email,
          subject: 'Reset Your LinkSea Password',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #0ea5e9; text-align: center;">Reset Your Password</h1>
              <p>We received a request to reset your password. Click the button below to set a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}"
                   style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          `
        })
        break

      case 'LOGIN_OTP':
        await transporter.sendMail({
          from: {
            name: 'LinkSea',
            address: 'dimenzuri@gmail.com'
          },
          to: email,
          subject: 'Your LinkSea Login Code',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #0ea5e9; text-align: center;">Your Login Code</h1>
              <p>Here's your one-time login code:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
                  ${data.otp}
                </div>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
            </div>
          `
        })
        break

      default:
        return res.status(400).json({ success: false, message: 'Invalid event type' })
    }

    res.status(200).json({ success: true, message: 'Email sent successfully' })
  } catch (error: any) {
    console.error('Error sending email:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error sending email' 
    })
  }
} 