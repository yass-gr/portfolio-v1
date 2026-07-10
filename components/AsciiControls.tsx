'use client'

import { useState } from 'react'
import type { AsciiConfig } from './AsciiCarousel'

interface Props {
  initial: Required<AsciiConfig>
  onChange: (config: Required<AsciiConfig>) => void
  onClose: () => void
}

export default function AsciiControls({ initial, onChange, onClose }: Props) {
  const [values, setValues] = useState(initial)

  const update = (patch: Partial<Required<AsciiConfig>>) => {
    const next = { ...values, ...patch }
    setValues(next)
    onChange(next)
  }

  return (
    <div className="space-y-3 p-4 bg-white border border-neutral-200 rounded-lg text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-neutral-700">ASCII Controls</span>
        <button onClick={onClose} className="text-xs text-neutral-400 hover:text-neutral-700">&times; close</button>
      </div>
      <Slider label="Font Size" min={3} max={15} step={1} value={values.fontSize} onChange={v => update({ fontSize: v })} />
      <Slider label="Contrast" min={0.5} max={3} step={0.1} value={values.contrast} onChange={v => update({ contrast: v })} />
      <Slider label="Threshold" min={200} max={255} step={1} value={values.threshold} onChange={v => update({ threshold: v })} />
      <Slider label="Letter Spacing" min={-1} max={0.5} step={0.1} value={values.letterSpacing} onChange={v => update({ letterSpacing: v })} />
    </div>
  )
}

function Slider({ label, min, max, step, value, onChange }: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-neutral-500 text-xs">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-neutral-800"
      />
      <span className="w-10 text-right text-xs text-neutral-500 tabular-nums">{value}</span>
    </div>
  )
}
