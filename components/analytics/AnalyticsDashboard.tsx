import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { BarChart3, TrendingUp, Users, MousePointerClick } from 'lucide-react'
import { motion } from 'framer-motion'

type AnalyticsRecord = {
  link_id: string;
  clicked_at: string;
  links: {
    title: string;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<{
    totalClicks: number;
    totalVisitors: number;
    linkAnalytics: Record<string, { clicks: number; title: string }>;
  }>({
    totalClicks: 0,
    totalVisitors: 0,
    linkAnalytics: {}
  })
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get date range
      const startDate = new Date()
      switch (timeframe) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24)
          break
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case 'all':
          startDate.setFullYear(2000)
          break
      }

      // Get analytics data with link titles in a single query
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select(`
          link_id,
          clicked_at,
          links!inner (
            title
          )
        `)
        .eq('user_id', user.id)
        .gte('clicked_at', startDate.toISOString())

      if (analyticsError) throw analyticsError

      // Process data
      const linkAnalytics: Record<string, { clicks: number; title: string }> = {}
      analyticsData?.forEach((record: any) => {
        if (!linkAnalytics[record.link_id]) {
          linkAnalytics[record.link_id] = {
            clicks: 0,
            title: record.links?.title || 'Deleted Link'
          }
        }
        linkAnalytics[record.link_id].clicks++
      })

      setAnalytics({
        totalClicks: analyticsData?.length || 0,
        totalVisitors: new Set(analyticsData?.map(c => c.clicked_at.split('T')[0])).size || 0,
        linkAnalytics
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['24h', '7d', '30d', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${timeframe === t 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {t === 'all' ? 'All Time' : t}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Total Clicks</h3>
            <MousePointerClick className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analytics.totalClicks}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Unique Visitors</h3>
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analytics.totalVisitors}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Avg. Clicks/Day</h3>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {(analytics.totalClicks / (timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30)).toFixed(1)}
          </p>
        </motion.div>
      </div>

      {/* Link Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Link Performance</h3>
          <BarChart3 className="w-5 h-5 text-primary-500" />
        </div>
        <div className="space-y-4">
          {Object.entries(analytics.linkAnalytics)
            .sort(([, a], [, b]) => b.clicks - a.clicks)
            .map(([linkId, data]) => (
              <div key={linkId} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {data.clicks} clicks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.clicks / analytics.totalClicks * 100) || 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  )
} 