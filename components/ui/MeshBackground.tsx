import { motion } from 'framer-motion'

export default function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 via-purple-500/30 to-pink-500/30 dark:from-primary-900/40 dark:via-purple-900/40 dark:to-pink-900/40" />
      
      {/* Animated Mesh Grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '0px -4rem'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/30 dark:bg-primary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 dark:bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/30 dark:bg-pink-400/20 rounded-full blur-3xl" />
    </div>
  )
} 