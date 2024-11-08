import { motion } from 'framer-motion'

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large'
  light?: boolean
  className?: string
}

export default function LoadingSpinner({ size = 'medium', light = false, className = '' }: LoadingSpinnerProps) {
  const sizes = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400 ${
          light ? 'border-white/20 border-t-white' : ''
        } animate-spin`}
      />
    </div>
  )
} 