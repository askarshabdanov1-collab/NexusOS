import { motion, Variants } from 'framer-motion'

interface DecryptedTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
}

export default function DecryptedText({ text, speed = 30, delay = 0, className = "" }: DecryptedTextProps) {
  // Split the text into characters
  const characters = text.split("")

  // Framer Motion container with staggered children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed / 1000,
        delayChildren: delay / 1000,
      },
    },
  }

  // Smooth slide-up fade character transition using premium spring physics
  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 110,
      },
    },
  }

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
    >
      {characters.map((char, idx) => (
        <motion.span
          key={idx}
          variants={childVariants}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}
