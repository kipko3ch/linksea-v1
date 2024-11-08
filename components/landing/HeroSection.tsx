import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Link as LinkIcon, BarChart, Share2, Smartphone } from 'lucide-react'
import MeshBackground from '@/components/ui/MeshBackground'

export default function HeroSection() {
  const features = [
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: "One Link for Everything",
      description: "Share all your content with a single, customizable link"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Track your link performance with detailed insights"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Easy Sharing",
      description: "Share your profile across all social platforms"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices"
    }
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <MeshBackground />
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
              One Link to Share
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              All Your Content
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Create your personalized link hub and share everything that matters with a single link.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors
                       flex items-center justify-center space-x-2 text-lg font-medium group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg
                       border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500
                       transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center
                            text-primary-600 dark:text-primary-400 mb-4"
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
} 