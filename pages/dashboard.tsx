import { useEffect, useState, Suspense, lazy } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import ShareProfile from '@/components/share/ShareProfile'
import { 
  Link as LinkIcon, 
  User as UserIcon, 
  Share, 
  LogOut, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  BarChart,
  ChevronRight,
  Layout,
  ExternalLink,
  Home
} from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import Logo from '@/components/ui/Logo'
import DashboardOverview from '@/components/dashboard/DashboardOverview'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Lazy load components
const LinkManager = lazy(() => import('@/components/links/LinkManager'))
const ProfileSetup = lazy(() => import('@/components/profile/ProfileSetup'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
)

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState<{
    username: string;
    avatar_url: string | null;
    bio: string | null;
  }>({ username: '', avatar_url: null, bio: null })

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (!session) {
          window.location.replace('/auth')
          return
        }

        setUser(session.user)
        
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url, bio')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Create profile if it doesn't exist
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                username: session.user.email?.split('@')[0],
                updated_at: new Date().toISOString()
              })
              .select()
              .single()

            if (createError) throw createError
            
            if (newProfile) {
              setProfileData({
                username: newProfile.username,
                avatar_url: null,
                bio: null
              })
              setUsername(newProfile.username)
            }
          } else {
            throw profileError
          }
        } else if (profile) {
          setProfileData(profile)
          setUsername(profile.username)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        window.location.replace('/auth')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.replace('/auth')
      } else if (session) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <Home className="w-5 h-5" />,
      description: 'Dashboard overview and stats'
    },
    { 
      id: 'links', 
      label: 'My Links', 
      icon: <LinkIcon className="w-5 h-5" />,
      description: 'Manage your links'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart className="w-5 h-5" />,
      description: 'View performance metrics'
    },
    { 
      id: 'share', 
      label: 'Share', 
      icon: <Share className="w-5 h-5" />,
      description: 'Share your profile'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="w-5 h-5" />,
      description: 'Manage your account'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header - Only show on mobile */}
      <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <Logo size="small" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
        {/* Sidebar */}
        <nav className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo and Theme Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Logo size="small" />
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {profileData.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  alt={profileData.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                  {profileData.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  @{profileData.username}
                </p>
                <a
                  href={`/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<LoadingSpinner size="large" />}>
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'links' && <LinkManager />}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'settings' && <ProfileSetup />}
              {activeTab === 'share' && username && <ShareProfile username={username} />}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 p-4 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Mobile Profile Section */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-4">
                  {profileData.avatar_url ? (
                    <img
                      src={profileData.avatar_url}
                      alt={profileData.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                      {profileData.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      @{profileData.username}
                    </p>
                    <a
                      href={`/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
                      ${activeTab === item.id 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.icon}
                    <div className="flex-1 text-left">
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile Sign Out Button */}
              <div className="mt-6">
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 