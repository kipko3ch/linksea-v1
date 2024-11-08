import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eHB6d3pxanJzcHlndnlpd3F3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDkwNzcxOCwiZXhwIjoyMDQ2NDgzNzE4fQ.rJ1s68nxUIfBrJYrbDVYTvWPhS9oEZ9AWSl9JRhC5MQ',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  // Parse the request body
  let user_id: string
  try {
    if (typeof req.body === 'string') {
      const parsed = JSON.parse(req.body)
      user_id = parsed.user_id
    } else {
      user_id = req.body.user_id
    }
  } catch (error) {
    console.error('Error parsing request body:', error)
    return res.status(400).json({ success: false, message: 'Invalid request body' })
  }

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required' })
  }

  try {
    console.log('Deleting user:', user_id)

    // Delete user's data first
    const { error: linksError } = await supabase
      .from('links')
      .delete()
      .eq('user_id', user_id)

    if (linksError) {
      console.error('Error deleting links:', linksError)
      throw linksError
    }

    // Delete user's analytics
    const { error: analyticsError } = await supabase
      .from('analytics')
      .delete()
      .eq('user_id', user_id)

    if (analyticsError) {
      console.error('Error deleting analytics:', analyticsError)
      throw analyticsError
    }

    // Delete user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user_id)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw profileError
    }

    // Finally delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      throw deleteError
    }

    console.log('User deleted successfully:', user_id)
    return res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error in delete user flow:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Error deleting user',
      error: error
    })
  }
} 