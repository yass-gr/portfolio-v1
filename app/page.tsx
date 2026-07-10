'use client'

import { useState } from 'react'
import Model3D from '@/components/Model3D'
import AsciiCarousel from '@/components/AsciiCarousel'
import AsciiControls from '@/components/AsciiControls'
import type { AsciiConfig } from '@/components/AsciiCarousel'

export default function Home() {
  const [asciiConfig, setAsciiConfig] = useState<AsciiConfig>({})
  const [showControls, setShowControls] = useState(false)

  const mergedConfig: Required<AsciiConfig> = {
    charSet: asciiConfig.charSet ?? " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    fontSize: asciiConfig.fontSize ?? 0,
    contrast: asciiConfig.contrast ?? 1.4,
    threshold: asciiConfig.threshold ?? 248,
    letterSpacing: asciiConfig.letterSpacing ?? -0.3,
  }

  return (
    <main>
      <div className="flex justify-center mx-4 xl:lg:-translate-y-10 lg:-translate-y-6 sm:-translate-y-4">
        <h1 className="mx-auto text-[12.5vw] font-clash-grotesk-bold">YASSINE GRAIRI</h1>
      </div>
      <Model3D />
      <div className="max-w-md mx-auto mt-12">
        <AsciiCarousel config={asciiConfig} />
        {showControls && (
          <div className="mt-4">
            <AsciiControls
              config={mergedConfig}
              onChange={(patch) => setAsciiConfig(prev => ({ ...prev, ...patch }))}
              onClose={() => setShowControls(false)}
            />
          </div>
        )}
        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className="mt-4 w-full py-2 text-sm text-neutral-600 border border-neutral-300 rounded-lg hover:border-neutral-400 hover:text-neutral-800 transition-colors"
          >
            show ascii controls
          </button>
        )}
      </div>
    </main>
  )
}
