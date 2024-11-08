import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Camera, 
  Save, 
  AlertCircle,
  EyeOff,
  Check
} from 'lucide-react'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

type Profile = {
  username: string
  bio: string
  avatar_url: string | null
  is_disabled?: boolean
}

export default function ProfileSetup() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [profile, setProfile] = useState<Profile>({
    username: '',
    bio: '',
    avatar_url: '',
    is_disabled: false
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url, is_disabled')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Upload file
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      setMessage({ text: 'Profile picture updated successfully!', type: 'success' })
    } catch (error: any) {
      console.error('Error updating avatar:', error)
      setMessage({ text: error.message || 'Error uploading avatar', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ text: 'Profile updated successfully!', type: 'success' })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setMessage({ text: error.message || 'Error updating profile', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const toggleAccountVisibility = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({
          is_disabled: !profile.is_disabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => ({ ...prev, is_disabled: !prev.is_disabled }))
      setMessage({ 
        text: profile.is_disabled ? 'Account enabled!' : 'Account disabled!', 
        type: 'success' 
      })
    } catch (error: any) {
      console.error('Error toggling account visibility:', error)
      setMessage({ text: error.message || 'Error updating account status', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="flex-1 space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary-500" />
          Profile Information
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {profile.avatar_url ? (
                <div className="h-32 w-32 rounded-full overflow-hidden">
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-3 cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={saving}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the camera icon to update
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg
                         text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg
                         text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                         transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={toggleAccountVisibility}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                  ${profile.is_disabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
              >
                {profile.is_disabled ? (
                  <>
                    <Check className="w-4 h-4" />
                    Enable Account
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Disable Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
              message.type === 'error' 
                ? 'bg-red-600 text-white' 
                : 'bg-green-600 text-white'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 