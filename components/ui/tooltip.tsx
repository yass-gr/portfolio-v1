"use client"

import { type ReactNode } from "react"

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: ReactNode }) {
  return <div className="relative group">{children}</div>
}

export function TooltipTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function TooltipContent({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/80 dark:text-black">
      {children}
    </div>
  )
}
