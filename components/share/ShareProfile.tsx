import { useState, useEffect } from 'react'
import QRCode from 'qrcode.react'
import { supabase } from '@/lib/supabaseClient'
import { 
  Copy, 
  Facebook, 
  MessageCircle, 
  QrCode, 
  Check, 
  ExternalLink,
  LinkedinIcon,
  Mail,
  Share2,
  Send,
  Instagram,
  Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const XIcon = () => (
  <svg 
    className="w-4 h-4" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-label="X (formerly Twitter)"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

type ShareProfileProps = {
  username: string
}

export default function ShareProfile({ username }: ShareProfileProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const profileUrl = `${window.location.origin}/${username}`

  useEffect(() => {
    fetchProfileData()
  }, [username])

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url')
        .eq('username', username)
        .single()

      if (error) throw error
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
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

  const handleShare = async (platform: 'x' | 'facebook' | 'whatsapp' | 'linkedin' | 'email' | 'instagram' | 'telegram') => {
    const text = profileData?.bio 
      ? `Check out my LinkSea profile: ${profileData.bio}`
      : 'Check out my LinkSea profile!'
    
    const urls = {
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${profileUrl}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      email: `mailto:?subject=Check out my LinkSea profile&body=${encodeURIComponent(`${text}\n\n${profileUrl}`)}`,
      instagram: `instagram://share?text=${encodeURIComponent(`${text}\n\n${profileUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`
    }
    window.open(urls[platform], '_blank')
  }

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#profile-qr-code canvas') as HTMLCanvasElement
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${username}-linksea-qr.png`
      link.href = url
      link.click()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary-500" />
            Share Your Profile
          </h2>

          {/* Copy Link Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-300"
              />
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => handleShare('x')}
              className="p-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center"
              aria-label="Share on X"
            >
              <XIcon />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-3 bg-[#1877F2] text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-3 bg-[#25D366] text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="p-3 bg-[#0088cc] text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
              aria-label="Share on Telegram"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* QR Code */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
            </button>

            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex flex-col items-center space-y-4"
                >
                  <div id="profile-qr-code" className="p-4 bg-white rounded-xl shadow-lg">
                    <QRCode
                      value={profileUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                      renderAs="canvas"
                      fgColor="#0ea5e9"
                      bgColor="#ffffff"
                      imageSettings={{
                        src: "/logo.png",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                      }}
                    />
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download QR Code</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 