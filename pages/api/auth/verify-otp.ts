import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { user_id, otp } = req.body

  if (!user_id || !otp) {
    return res.status(400).json({ success: false, message: 'User ID and OTP are required' })
  }

  try {
    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('auth_otps')
      .select('*')
      .eq('user_id', user_id)
      .eq('otp', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (otpError || !otpData) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' })
    }

    // Mark OTP as used
    await supabase
      .from('auth_otps')
      .update({ used: true })
      .eq('id', otpData.id)

    // Create new session
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: otpData.email,
      password: otpData.password
    })

    if (signInError) throw signInError

    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      session: data.session
    })
  } catch (error: any) {
    console.error('OTP verification error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error verifying OTP' 
    })
  }
} 