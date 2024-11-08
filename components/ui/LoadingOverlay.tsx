import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type LoadingOverlayProps = {
  message?: string
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
                 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-800 
                   shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </motion.div>
    </motion.div>
  )
} 