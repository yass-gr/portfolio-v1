'use client'

import { useRef, useEffect, useState } from 'react'

const CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

export default function AsciiCarousel({ images = ['/pers-img-1.jpeg'] }: { images?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % images.length), 4000)
    return () => clearInterval(t)
  }, [images.length])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let active = true

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!active) return
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      generateAscii(img, canvas, w, h)
      setLoaded(true)
    }
    img.src = images[index]

    return () => { active = false }
  }, [index, images])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loaded && (
        <img
          src={images[index]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: loaded && !hovered ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />
    </div>
  )
}

function generateAscii(img: HTMLImageElement, canvas: HTMLCanvasElement, displayW: number, displayH: number) {
  const ctx = canvas.getContext('2d')!
  const dpr = devicePixelRatio

  const fontSize = Math.max(5, Math.round(displayW / 100))
  const charWidth = fontSize * 0.55
  const charHeight = fontSize

  const imgAspect = img.naturalWidth / img.naturalHeight
  const containerAspect = displayW / displayH

  let srcW: number, srcH: number
  if (imgAspect > containerAspect) {
    srcH = img.naturalHeight
    srcW = srcH * containerAspect
  } else {
    srcW = img.naturalWidth
    srcH = srcW / containerAspect
  }

  const sx = (img.naturalWidth - srcW) / 2
  const sy = (img.naturalHeight - srcH) / 2

  const cols = Math.floor(displayW / charWidth)
  const rows = Math.floor(displayH / charHeight)

  const offscreen = new OffscreenCanvas(cols, rows)
  const offCtx = offscreen.getContext('2d')!
  offCtx.drawImage(img, sx, sy, srcW, srcH, 0, 0, cols, rows)
  const data = offCtx.getImageData(0, 0, cols, rows).data

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#111'
  ctx.font = `${fontSize * dpr}px "JetBrains Mono", "IBM Plex Mono", "Geist Mono", "SF Mono", monospace`
  ctx.textBaseline = 'top'

  const contrast = 1.4
  const brightnessThreshold = 248
  const spacing = (charWidth + -0.3) * dpr
  const fs = fontSize * dpr
  const ch = fs

  for (let row = 0; row < rows; row++) {
    const y = row * ch
    for (let col = 0; col < cols; col++) {
      const p = (row * cols + col) * 4
      let brightness = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]
      brightness = (brightness - 128) * contrast + 128
      brightness = Math.max(0, Math.min(255, brightness))

      if (brightness > brightnessThreshold) continue

      const ci = Math.floor((brightness / 255) * (CHARS.length - 1))
      ctx.fillText(CHARS[ci], col * spacing, y)
    }
  }
}
