import { motion } from 'framer-motion'

type SkeletonLoaderProps = {
  count?: number
  type?: 'card' | 'line' | 'circle'
  className?: string
}

export default function SkeletonLoader({ count = 1, type = 'card', className = '' }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  const getSkeletonClass = () => {
    switch (type) {
      case 'line':
        return 'h-4 rounded-full'
      case 'circle':
        return 'h-12 w-12 rounded-full'
      default:
        return 'h-24 rounded-xl'
    }
  }

  return (
    <div className="space-y-4">
      {items.map((index) => (
        <motion.div
          key={index}
          className={`${getSkeletonClass()} ${className} bg-gradient-to-r from-gray-200 dark:from-gray-800 via-gray-300 dark:via-gray-700 to-gray-200 dark:to-gray-800 bg-[length:400%_100%]`}
          animate={{
            backgroundPosition: ['100% 0%', '0% 0%', '100% 0%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
} 