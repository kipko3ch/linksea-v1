import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900' 
          : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
      )}
      <p className={`text-sm font-medium ${
        type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
      }`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
          type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
} 