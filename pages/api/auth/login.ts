import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import nodemailer from 'nodemailer'
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

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  try {
    // First try to sign in to verify credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError || !signInData.user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    
    // Store OTP in database
    const { error: otpError } = await supabase
      .from('auth_otps')
      .insert({
        user_id: signInData.user.id,
        otp: otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
      })

    if (otpError) throw otpError

    // Send OTP email
    await transporter.sendMail({
      from: {
        name: 'LinkSea',
        address: 'dimenzuri@gmail.com'
      },
      to: email,
      subject: 'Your Login OTP',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Your Login OTP</h1>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    })

    // Sign out after sending OTP
    await supabase.auth.signOut()

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to email',
      user_id: signInData.user.id
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error processing login' 
    })
  }
} 