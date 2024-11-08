import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import Logo from '@/components/ui/Logo'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ResetPassword() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [initializing, setInitializing] = useState(true)
  const [validToken, setValidToken] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check for recovery token in URL
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        
        if (!token) {
          // Check for hash params (Supabase sometimes uses hash instead of query)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const hashToken = hashParams.get('access_token')
          
          if (!hashToken) {
            router.push('/auth/forgot-password')
            return
          }
        }

        // Verify session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          throw new Error('Invalid or expired reset token')
        }

        setValidToken(true)
      } catch (error) {
        console.error('Error validating token:', error)
        setMessage('Invalid or expired reset link. Please request a new one.')
        setTimeout(() => {
          router.push('/auth/forgot-password')
        }, 3000)
      } finally {
        setInitializing(false)
      }
    }

    validateToken()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage('Password updated successfully! Redirecting to login...')
      
      // Sign out the user
      await supabase.auth.signOut()
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/auth')
      }, 2000)
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-blue-500/20 to-purple-600/20 dark:from-cyan-700/20 dark:via-blue-800/20 dark:to-purple-900/20 opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="large" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 text-transparent bg-clip-text mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${
                  message.includes('successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700 text-center">
            <button
              onClick={() => router.push('/auth')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 