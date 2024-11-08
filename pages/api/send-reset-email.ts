import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabaseClient'
import crypto from 'crypto'

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
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    // Check if user exists in auth.users
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    const { error: tokenError } = await supabase
      .from('password_resets')
      .upsert({
        user_id: session?.user.id,
        token: resetToken,
        expires_at: resetExpiry.toISOString()
      })

    if (tokenError) throw tokenError

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`
    
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
            <a href="${resetUrl}" 
               style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            © ${new Date().getFullYear()} LinkSea. All rights reserved.
          </p>
        </div>
      `
    })

    res.status(200).json({ 
      success: true, 
      message: 'Password reset instructions have been sent to your email.' 
    })
  } catch (error) {
    console.error('Error in reset password flow:', error)
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request.' 
    })
  }
} 