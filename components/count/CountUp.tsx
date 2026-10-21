'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate, useInView } from 'framer-motion'

type Props = {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

const CountUp = ({
  end = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  className = 'font-bold text-primary',
}: Props) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) {
      const controls = animate(count, end, {
        duration,
        onUpdate: (latest) => {
          setDisplay(Math.round(latest))
        },
      })

      return controls.stop
    }
  }, [inView, end, duration, count])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}>
      {prefix}
      {display}
      {" "}{suffix}
    </motion.span>
  )
}

export default CountUp
