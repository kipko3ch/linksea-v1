'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/ThemeContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Logo from '@/components/ui/Logo'
import { Sun, Moon, Github } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

    } catch (error: any) {
      console.error('Auth error:', error)
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

    } catch (error: any) {
      console.error('Auth error:', error)
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-40 dark:opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-purple-500/30 dark:from-primary-900/30 dark:to-purple-900/30" />
        <div className="absolute inset-0" style={{ backgroundImage: 'url("/grid.svg")', backgroundSize: '30px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <Logo size="large" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 text-transparent bg-clip-text mb-3">
                  Welcome to LinkSea
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Your professional link management platform
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                         text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                      Continue with Google
                    </>
                  )}
                </button>

                <button
                  onClick={handleGithubSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                         text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </>
                  )}
                </button>
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 text-center mt-4"
                >
                  {message}
                </motion.p>
              )}
            </div>

            <div className="px-8 py-4 bg-gray-50/50 dark:bg-gray-700/50 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <Link 
                  href="/terms" 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link 
                  href="/privacy" 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 