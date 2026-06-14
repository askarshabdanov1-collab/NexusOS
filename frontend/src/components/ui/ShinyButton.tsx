import { motion } from 'framer-motion'

interface ShinyButtonProps {
  text: string
  onClick?: () => void
  className?: string
}

export default function ShinyButton({ text, onClick, className = "" }: ShinyButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`relative px-8 py-4 rounded-xl font-medium text-[#FAF6F0] overflow-hidden bg-[#1D1E20] border border-[#2D2E30] transition-all hover:bg-[#2D2E30] hover:shadow-[0_10px_24px_rgba(108,126,114,0.12)] cursor-pointer ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <motion.div
        initial={{ left: '-100%' }}
        animate={{ left: '140%' }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
        className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
      />
    </motion.button>
  )
}
