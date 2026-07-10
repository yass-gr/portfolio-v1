'use client'

import { useRef, useEffect, useState } from 'react'

const CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

interface Char {
  c: string
  x: number
  y: number
  seed: number
}

interface Layout {
  chars: Char[]
  fontSize: number
}

export default function AsciiCarousel({ images = ['/pers-img-1.jpeg'] }: { images?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const layoutRef = useRef<Layout | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const progressRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % images.length), 4000)
    return () => clearInterval(t)
  }, [images.length])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const w = container.clientWidth
    const h = container.clientHeight
    const dpr = devicePixelRatio
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)

    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      layoutRef.current = buildLayout(img, w, h)
      progressRef.current = 0
    }
    img.src = images[index]
  }, [index, images])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const animate = () => {
      const img = imgRef.current
      const layout = layoutRef.current
      if (!img || !layout) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const target = hovered ? 1 : 0
      progressRef.current += (target - progressRef.current) * 0.06

      if (Math.abs(progressRef.current - target) < 0.001) {
        progressRef.current = target
      }

      drawFrame(canvas, layout, img, progressRef.current)

      if (Math.abs(progressRef.current - target) > 0.001) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hovered])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

function buildLayout(img: HTMLImageElement, w: number, h: number): Layout {
  const fontSize = Math.max(5, Math.round(Math.min(w, h) / 100))
  const spacing = fontSize * 0.55 - 0.3
  const charHeight = fontSize
  const cols = Math.floor(w / spacing)
  const rows = Math.floor(h / charHeight)

  const imgAspect = img.naturalWidth / img.naturalHeight
  const containerAspect = w / h

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

  const sampleCanvas = document.createElement('canvas')
  sampleCanvas.width = cols
  sampleCanvas.height = rows
  const sampleCtx = sampleCanvas.getContext('2d')!
  sampleCtx.drawImage(img, sx, sy, srcW, srcH, 0, 0, cols, rows)
  const data = sampleCtx.getImageData(0, 0, cols, rows).data

  const contrast = 1.4
  const threshold = 248
  const chars: Char[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const p = (row * cols + col) * 4
      let b = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]
      b = (b - 128) * contrast + 128
      b = Math.max(0, Math.min(255, b))

      if (b > threshold) continue

      const ci = Math.floor((b / 255) * (CHARS.length - 1))
      let seed = (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1
      if (seed < 0) seed += 1
      chars.push({
        c: CHARS[ci],
        x: col * spacing,
        y: row * charHeight,
        seed,
      })
    }
  }

  return { chars, fontSize }
}

function drawFrame(
  canvas: HTMLCanvasElement,
  layout: Layout | null,
  img: HTMLImageElement | null,
  progress: number,
) {
  const ctx = canvas.getContext('2d')!
  const dpr = devicePixelRatio
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  if (img && progress > 0) {
    ctx.save()
    ctx.globalAlpha = progress

    const imgAspect = img.naturalWidth / img.naturalHeight
    const containerAspect = w / h

    let sw: number, sh: number
    if (imgAspect > containerAspect) {
      sh = img.naturalHeight
      sw = sh * containerAspect
    } else {
      sw = img.naturalWidth
      sh = sw / containerAspect
    }
    const sx = (img.naturalWidth - sw) / 2
    const sy = (img.naturalHeight - sh) / 2

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
    ctx.restore()
  }

  if (layout && progress < 1) {
    const { chars, fontSize } = layout
    ctx.fillStyle = '#111'
    ctx.font = `${Math.round(fontSize * dpr)}px "JetBrains Mono", "IBM Plex Mono", "Geist Mono", "SF Mono", monospace`
    ctx.textBaseline = 'top'

    for (const c of chars) {
      if (progress >= c.seed) continue

      const localP = progress / Math.max(c.seed, 0.001)
      const driftY = -localP * localP * 15 * dpr
      ctx.globalAlpha = 1 - localP * 0.3
      ctx.fillText(c.c, Math.round(c.x * dpr), Math.round(c.y * dpr + driftY))
    }

    ctx.globalAlpha = 1
  }
}
