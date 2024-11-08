import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Head from 'next/head'
import { getIconByValue } from '@/lib/iconOptions'
import { ExternalLink } from 'lucide-react'
import { ThemeProvider, useTheme } from '@/lib/ThemeContext'
import { useRouter } from 'next/router'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { motion } from 'framer-motion'

type ProfileData = {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
  links: Array<{
    id: string
    title: string
    url: string
    description?: string
    icon?: string
    position: number
  }>
}

function SharePage() {
  const router = useRouter()
  const { username } = router.query
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof username === 'string') {
      fetchProfile(username)
    }
  }, [username])

  const fetchProfile = async (username: string) => {
    try {
      setLoading(true)
      setError(null)

      // First get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, is_disabled')
        .eq('username', username)
        .single()

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError)
        setError('Profile not found')
        return
      }

      if (profileData.is_disabled) {
        setError('This account is currently disabled')
        return
      }

      // Then get the links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profileData.id)
        .order('position')

      if (linksError) {
        console.error('Links fetch error:', linksError)
        setError('Error fetching links')
        return
      }

      // Combine the data
      setProfile({
        ...profileData,
        links: linksData || []
      })

      // Preload avatar if exists
      if (profileData.avatar_url) {
        const img = new Image()
        img.src = profileData.avatar_url
      }

    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Profile not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The link you followed may be broken, or the page may have been removed.
          </p>
        </div>
      </div>
    )
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      if (!profile) return

      // Record analytics
      await supabase
        .from('analytics')
        .insert({
          link_id: linkId,
          user_id: profile.id,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        })

      // Open the URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error recording click:', error)
      // Still open the URL even if analytics fails
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      <Head>
        {/* Add preload for avatar */}
        {profile?.avatar_url && (
          <link rel="preload" as="image" href={profile.avatar_url} />
        )}
        <title>{profile.username} | LinkSea</title>
        <meta name="description" content={profile.bio || `Check out ${profile.username}'s links on LinkSea`} />
        <meta property="og:title" content={`${profile.username} | LinkSea`} />
        <meta property="og:description" content={profile.bio || `Check out ${profile.username}'s links on LinkSea`} />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Profile Header with optimized image loading */}
          <div className="text-center">
            {profile?.avatar_url && (
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="rounded-full object-cover w-full h-full"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png' // Add a default avatar image
                    }}
                  />
                  {/* Loading placeholder */}
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" 
                       style={{ display: 'none' }} />
                </div>
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">@{profile?.username}</h1>
            {profile?.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">{profile.bio}</p>
            )}
          </div>

          {/* Links with loading states */}
          <div className="space-y-4">
            {profile?.links.map((link) => {
              const iconOption = link.icon ? getIconByValue(link.icon) : null
              const IconComponent = iconOption?.icon

              return (
                <motion.button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="w-full p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg
                           border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500
                           transform transition-all duration-200 hover:scale-[1.02]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {IconComponent ? (
                        <IconComponent className="w-6 h-6" style={{ color: iconOption.color }} />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Empty state when no links */}
          {profile?.links.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No links added yet.</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Create your own LinkSea page →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

// Wrap the page with ThemeProvider
export default function SharePageWithTheme() {
  return (
    <ThemeProvider>
      <SharePage />
    </ThemeProvider>
  )
} 