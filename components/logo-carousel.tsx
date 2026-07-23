"use client"

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

interface Logo {
  name: string
  id: number
  img: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface LogoColumnProps {
  logos: Logo[]
  index: number
  currentTime: number
  isMobile: boolean
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const deduplicateByIcon = (logos: Logo[]): Logo[] => {
  const seen = new Set<React.ComponentType<React.SVGProps<SVGSVGElement>>>()
  return logos.filter((logo) => {
    if (seen.has(logo.img)) return false
    seen.add(logo.img)
    return true
  })
}

const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const unique = deduplicateByIcon(allLogos)
  const shuffled = shuffleArray(unique)
  const columns: Logo[][] = Array.from({ length: columnCount }, () => [])

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo)
  })

  const maxLength = Math.max(...columns.map((col) => col.length))
  const usedIds = new Set(shuffled.map((l) => l.id))
  columns.forEach((col) => {
    while (col.length < maxLength) {
      const available = unique.filter((l) => !usedIds.has(l.id))
      const pick = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : unique[Math.floor(Math.random() * unique.length)]
      col.push(pick)
      usedIds.add(pick.id)
    }
  })

  return columns
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime, isMobile }) => {
    const cycleInterval = 4000
    const columnDelay = index * 200
    const adjustedTime = (currentTime + columnDelay) % (cycleInterval * logos.length)
    const currentIndex = Math.floor(adjustedTime / cycleInterval)
    const CurrentLogo = useMemo(() => logos[currentIndex].img, [logos, currentIndex])

    if (isMobile) {
      return (
        <div className="relative h-8 w-8 overflow-hidden">
          <div
            key={`${logos[currentIndex].id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center animate-logo-fade"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CurrentLogo className="h-8 w-8 max-h-[80%] max-w-[80%] object-contain text-black dark:text-white" />
          </div>
        </div>
      )
    }

    return (
      <motion.div
        className="relative h-8 w-8 overflow-hidden md:h-10 md:w-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${logos[currentIndex].id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              filter: "blur(6px)",
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            <CurrentLogo className="h-8 w-8 max-h-[80%] max-w-[80%] object-contain md:h-10 md:w-10 text-black dark:text-white" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }
)

interface LogoCarouselProps {
  columnCount?: number
  logos: Logo[]
}

export function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const isMobileRef = useRef(false)

  useEffect(() => {
    const check = () => { isMobileRef.current = window.innerWidth < 1024 }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const intervalMs = isMobileRef.current ? 4000 : 100
    const intervalId = setInterval(() => {
      setCurrentTime((prev) => prev + intervalMs)
    }, intervalMs)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const distributedLogos = distributeLogos(logos, columnCount)
    setLogoSets(distributedLogos)
  }, [logos, columnCount])

  return (
    <div className="flex space-x-4">
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          logos={logos}
          index={index}
          currentTime={currentTime}
          isMobile={isMobileRef.current}
        />
      ))}
    </div>
  )
}

export { LogoColumn }
