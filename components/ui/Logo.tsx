import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/lib/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

type LogoProps = {
  className?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'white'
}

export default function Logo({ className = '', size = 'medium', variant }: LogoProps) {
  const { theme } = useTheme()
  
  const sizes = {
    small: { width: 80, height: 80 },
    medium: { width: 100, height: 100 },
    large: { width: 120, height: 120 }
  }

  // Determine which logo to show based on theme or forced variant
  const isDark = variant === 'white' || theme === 'dark'

  return (
    <Link 
      href="/" 
      className={`block relative ${className}`}
      onClick={(e) => {
        // If we're on terms or privacy page, do a hard redirect
        if (window.location.pathname === '/terms' || window.location.pathname === '/privacy') {
          window.location.href = '/'
          e.preventDefault()
        }
      }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, scale: 0.8, position: 'absolute' }}
            animate={{ opacity: 1, scale: 1, position: 'relative' }}
            exit={{ opacity: 0, scale: 0.8, position: 'absolute' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={isDark ? '/logo-white.png' : '/logo-black.png'}
              alt="LinkSea Logo"
              width={sizes[size].width}
              height={sizes[size].height}
              className="object-contain will-change-transform"
              priority
              quality={100}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </Link>
  )
} 