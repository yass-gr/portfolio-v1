'use client'

import { useState } from 'react'
import Model3D from '@/components/Model3D'
import AsciiCarousel from '@/components/AsciiCarousel'

export default function Home() {
  const [contrast, setContrast] = useState(1.4)

  return (
    <main>
      <div className="flex justify-center mx-4 xl:lg:-translate-y-10 lg:-translate-y-6 sm:-translate-y-4">
        <h1 className="mx-auto text-[12.5vw] font-clash-grotesk-bold">YASSINE GRAIRI</h1>
      </div>
      <Model3D />
      <div className="max-w-md mx-auto mt-12 space-y-4">
        <AsciiCarousel config={{ contrast }} />
        <div className="flex items-center gap-3 border p-3 rounded-lg">
          <span className="text-xs w-20">Contrast</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={contrast}
            onChange={e => setContrast(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-8 text-right tabular-nums">{contrast}</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          onChange={e => setContrast(parseFloat(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-neutral-400">test raw range input</p>
        <button
          onClick={() => setContrast(c => c + 0.1)}
          className="block w-full py-2 text-sm border rounded-lg"
        >
          increment contrast ({contrast.toFixed(1)})
        </button>
      </div>
    </main>
  )
}
