import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import Head from 'next/head'

export default function Terms() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Head>
        <title>Terms of Service - LinkSea</title>
        <meta name="description" content="LinkSea Terms of Service - Read our terms and conditions." />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo size="small" />
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose dark:prose-invert prose-primary max-w-none"
          >
            <h1>Terms of Service</h1>
            <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Terms</h2>
            <p>
              By accessing LinkSea, you agree to be bound by these terms of service and agree that you are responsible for compliance with any applicable local laws.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on LinkSea for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
              The materials on LinkSea are provided on an 'as is' basis. LinkSea makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            {/* Add more sections as needed */}
          </motion.div>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <Logo size="small" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  © {new Date().getFullYear()} LinkSea
                </p>
              </div>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 