import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/ThemeContext'
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  Link as LinkIcon, 
  BarChart, 
  Share2, 
  Smartphone,
  Palette,
  Shield,
  Puzzle,
  MessageCircle,
  Zap,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

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

  const enhancedFeatures = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Customizable Design",
      description: "Express your unique style with custom colors, fonts, and layouts"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure and Reliable",
      description: "Industry-standard security for your peace of mind"
    },
    {
      icon: <Puzzle className="w-6 h-6" />,
      title: "Seamless Integration",
      description: "Connect with all your favorite platforms effortlessly"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Engage Your Audience",
      description: "Interactive elements for better engagement"
    }
  ]

  const benefits = [
    "Professional online presence",
    "Streamlined content sharing",
    "Detailed analytics insights",
    "Mobile-first design",
    "Custom branding options",
    "Secure and reliable platform"
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="small" />
            <div className="flex items-center space-x-4">
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Sign In
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 dark:from-primary-900/20 dark:to-purple-900/20" />
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                One Link to Share
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                All Your Content
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Create your personalized link hub and share everything that matters with a single link.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all
                         transform hover:scale-105 shadow-lg hover:shadow-primary-500/25
                         flex items-center justify-center space-x-2 text-lg font-medium group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-105
                         shadow-lg border border-gray-200 dark:border-gray-700 text-lg font-medium"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg
                         border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500
                         transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center
                              text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform"
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
        </motion.div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enhanced Features for Maximum Impact
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to create a powerful online presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enhancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl
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
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose LinkSea?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-primary-500" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-preview.png"
                  alt="LinkSea Dashboard Preview"
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-900 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to simplify your sharing?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands who trust LinkSea for a streamlined, professional online presence.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl
                     hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg
                     text-lg font-medium group"
          >
            <span>Get Started Free</span>
            <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Logo size="small" />
              <p className="text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} LinkSea. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/terms" 
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Terms
              </Link>
              <Link 
                href="/privacy" 
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 