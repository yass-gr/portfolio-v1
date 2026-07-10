'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./ThreeScene'), { ssr: false })

export default function Model3D() {
  return <Scene />
}
