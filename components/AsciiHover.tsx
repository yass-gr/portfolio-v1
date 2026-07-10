'use client'

import { useRef } from 'react'

export default function AsciiHover() {
  const asciiRef = useRef<HTMLImageElement>(null)

  return (
    <div
      className="relative w-[300px] overflow-hidden rounded-xl border-2 border-white cursor-pointer"
      onMouseEnter={() => { if (asciiRef.current) asciiRef.current.style.opacity = '0' }}
      onMouseLeave={() => { if (asciiRef.current) asciiRef.current.style.opacity = '1' }}
    >
      <img src="/pic1.png" alt="" className="w-full block" />
      <img
        ref={asciiRef}
        src="/pic1-ascii.png"
        alt="Yassine Grairi"
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
      />
    </div>
  )
}
