import { motion } from 'framer-motion'

type LoadingStateProps = {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

export default function LoadingState({ size = 'medium', text }: LoadingStateProps) {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
} 