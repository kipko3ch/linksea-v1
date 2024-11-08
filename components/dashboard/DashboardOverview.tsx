import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Link as LinkIcon, 
  ExternalLink,
  Clock,
  Calendar,
  ArrowUpRight,
  Eye,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import { getIconByValue } from '@/lib/iconOptions'

type OverviewStats = {
  totalLinks: number
  totalClicks: number
  recentVisitors: number
  username?: string
  topLinks: Array<{
    id: string
    title: string
    clicks: number
    url: string
    icon?: string
  }>
  recentLinks: Array<{
    id: string
    title: string
    created_at: string
    url: string
    icon?: string
  }>
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats>({
    totalLinks: 0,
    totalClicks: 0,
    recentVisitors: 0,
    topLinks: [],
    recentLinks: []
  })
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  const [copied, setCopied] = useState(false)
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${stats.username}` : ''

  useEffect(() => {
    fetchStats()
    subscribeToUpdates()
  }, [timeframe])

  const subscribeToUpdates = () => {
    const analyticsSubscription = supabase
      .channel('analytics_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analytics'
      }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(analyticsSubscription)
    }
  }

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all links with clicks
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, title, url, clicks, icon, created_at')
        .eq('user_id', user.id)
        .order('clicks', { ascending: false })

      if (linksError) throw linksError

      // Get recent analytics
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('clicked_at', thirtyDaysAgo.toISOString())

      if (analyticsError) throw analyticsError

      // Process stats
      const topLinks = links?.slice(0, 5).map(link => ({
        id: link.id,
        title: link.title,
        clicks: link.clicks || 0,
        url: link.url,
        icon: link.icon
      })) || []

      const recentLinks = [...(links || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(link => ({
          id: link.id,
          title: link.title,
          created_at: link.created_at,
          url: link.url,
          icon: link.icon
        }))

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      setStats({
        totalLinks: links?.length || 0,
        totalClicks: links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0,
        recentVisitors: new Set(analytics?.map(a => a.clicked_at.split('T')[0])).size || 0,
        username: profile?.username,
        topLinks,
        recentLinks
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Share Section - New Addition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Share Your Profile</h2>
              <p className="text-primary-100">Share your LinkSea profile with your audience</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-initial">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="w-full md:w-80 px-4 py-2 pr-24 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>View Profile</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400">Total Links</h3>
            <LinkIcon className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalLinks}
          </p>
        </motion.div>

        {/* Total Clicks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400">Total Clicks</h3>
            <BarChart3 className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalClicks}
          </p>
        </motion.div>

        {/* Recent Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400">Recent Visitors</h3>
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.recentVisitors}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last 30 days
          </p>
        </motion.div>

        {/* Top Performing Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400">Top Link</h3>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          {stats.topLinks.length > 0 ? (
            <div>
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {stats.topLinks[0].title}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold text-primary-500">
                  {stats.topLinks[0].clicks}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  clicks
                </span>
              </div>
              <a
                href={stats.topLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 mt-2"
              >
                Visit Link
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No links yet
            </p>
          )}
        </motion.div>
      </div>

      {/* Top Links and Recent Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Top Performing Links
            </h3>
          </div>
          <div className="space-y-4">
            {stats.topLinks.map((link, index) => {
              const iconOption = link.icon ? getIconByValue(link.icon) : null
              const IconComponent = iconOption?.icon

              return (
                <div key={link.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="w-4 h-4" style={{ color: iconOption.color }} />
                      )}
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {link.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {link.url}
                      </p>
                      <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{link.clicks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recently Added Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Recently Added Links
            </h3>
          </div>
          <div className="space-y-4">
            {stats.recentLinks.map((link) => {
              const iconOption = link.icon ? getIconByValue(link.icon) : null
              const IconComponent = iconOption?.icon
              const date = new Date(link.created_at)

              return (
                <div key={link.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                    {IconComponent ? (
                      <IconComponent className="w-4 h-4" style={{ color: iconOption.color }} />
                    ) : (
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {link.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {link.url}
                      </p>
                      <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 