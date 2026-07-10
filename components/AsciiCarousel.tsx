'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const CHARS = ' .:-=+*#%@'

function imageToAscii(img: HTMLImageElement, cols: number): { indices: number[]; cols: number; rows: number } {
  const aspect = img.naturalWidth / img.naturalHeight
  const rows = Math.round(cols / aspect)
  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const indices: number[] = new Array(cols * rows)
  for (let i = 0; i < cols * rows; i++) {
    const p = i * 4
    const brightness = (data[p] + data[p + 1] + data[p + 2]) / 3
    indices[i] = Math.floor((brightness / 255) * (CHARS.length - 1))
  }
  return { indices, cols, rows } as { indices: number[]; cols: number; rows: number }
}

function createSpritesheet(): THREE.CanvasTexture {
  const charSize = 128
  const n = CHARS.length
  const canvas = document.createElement('canvas')
  canvas.width = n * charSize
  canvas.height = charSize
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#fff'
  ctx.font = `${charSize * 0.8}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  CHARS.split('').forEach((char, i) => {
    ctx.fillText(char, i * charSize + charSize / 2, charSize / 2)
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function buildGeometry(indices: number[], cols: number, rows: number) {
  const cellW = 2 / cols
  const cellH = 2 / rows
  const gap = 0.1
  const s = 1 - gap

  const vertCount = cols * rows * 6
  const positions = new Float32Array(vertCount * 3)
  const uvs = new Float32Array(vertCount * 2)
  const charIdx = new Float32Array(vertCount)
  const gridPos = new Float32Array(vertCount * 2)

  let vi = 0, ti = 0, ci = 0, gi = 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = (col / cols) * 2 - 1 + cellW / 2
      const cy = 1 - (row / rows) * 2 - cellH / 2
      const hw = (cellW * s) / 2
      const hh = (cellH * s) / 2

      const verts = [
        [cx - hw, cy - hh, 0],
        [cx + hw, cy - hh, 0],
        [cx - hw, cy + hh, 0],
        [cx + hw, cy - hh, 0],
        [cx - hw, cy + hh, 0],
        [cx + hw, cy + hh, 0],
      ]

      for (let i = 0; i < 6; i++) {
        positions[vi++] = verts[i][0]
        positions[vi++] = verts[i][1]
        positions[vi++] = verts[i][2]
      }

      const quadUv = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1]
      for (let i = 0; i < 6; i++) {
        uvs[ti++] = quadUv[i * 2]
        uvs[ti++] = quadUv[i * 2 + 1]
      }

      const idx = indices[row * cols + col]
      for (let i = 0; i < 6; i++) charIdx[ci++] = idx

      for (let i = 0; i < 6; i++) {
        gridPos[gi++] = col / cols
        gridPos[gi++] = row / rows
      }
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setAttribute('aCharIndex', new THREE.Float32BufferAttribute(charIdx, 1))
  geom.setAttribute('aGridPos', new THREE.Float32BufferAttribute(gridPos, 2))

  return geom
}

const vertShader = `
  uniform float uTime;
  uniform float uHover;

  attribute float aCharIndex;
  attribute vec2 aGridPos;

  varying vec2 vUv;
  flat varying float vCharIndex;

  void main() {
    vUv = uv;
    vCharIndex = aCharIndex;

    vec3 pos = position;
    float phase = aGridPos.x * 10.0 + aGridPos.y * 7.0;

    float driftX = sin(uTime * 2.0 + phase) * uHover * 0.05;
    float driftY = cos(uTime * 2.5 + phase * 1.3) * uHover * 0.05;
    pos.x += driftX;
    pos.y += driftY;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragShader = `
  uniform sampler2D uTexture;
  uniform float uCharCount;
  uniform float uHover;

  varying vec2 vUv;
  flat varying float vCharIndex;

  void main() {
    float charW = 1.0 / uCharCount;
    vec2 charUv = vec2(vUv.x * charW + vCharIndex * charW, vUv.y);
    float char = texture2D(uTexture, charUv).r;
    float alpha = char * (1.0 - uHover * 0.85);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`

function Scene({ imageUrl, hovered }: { imageUrl: string; hovered: boolean }) {
  const texture = useTexture(imageUrl)
  const meshRef = useRef<THREE.Mesh>(null)
  const imageRef = useRef<THREE.Mesh>(null)
  const hoverRef = useRef(0)
  const timeRef = useRef(0)

  const ascii = useMemo(() => {
    if (!texture?.image) return null
    return imageToAscii(texture.image as HTMLImageElement, 55)
  }, [texture])

  const spritesheet = useMemo(() => createSpritesheet(), [])

  const geometry = useMemo(() => {
    if (!ascii) return null
    return buildGeometry(ascii.indices, ascii.cols, ascii.rows)
  }, [ascii])

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: spritesheet },
      uCharCount: { value: CHARS.length },
      uHover: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
    depthWrite: false,
  }), [spritesheet])

  useEffect(() => {
    return () => {
      material.dispose()
      if (geometry) geometry.dispose()
    }
  }, [material, geometry])

  useFrame((_, delta) => {
    timeRef.current += delta
    const target = hovered ? 1 : 0
    hoverRef.current += (target - hoverRef.current) * delta * 4

    material.uniforms.uTime.value = timeRef.current
    material.uniforms.uHover.value = hoverRef.current

    if (imageRef.current) {
      const mat = imageRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hoverRef.current * 0.9
    }
  })

  const imageAspect = texture?.image
    ? (texture.image as HTMLImageElement).naturalWidth / (texture.image as HTMLImageElement).naturalHeight
    : 1

  return (
    <group>
      <mesh ref={imageRef} scale={[imageAspect > 1 ? 1 : imageAspect, imageAspect > 1 ? 1 / imageAspect : 1, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {geometry && (
        <mesh ref={meshRef} geometry={geometry} material={material} />
      )}
    </group>
  )
}

export default function AsciiCarousel({ images = ['/pers-img-1.jpeg'] }: { images?: string[] }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % images.length), 4000)
    return () => clearInterval(t)
  }, [images.length])

  return (
    <div
      className="relative w-full aspect-square"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-neutral-950">
          <span className="text-neutral-500 text-sm">loading...</span>
        </div>
      }>
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
          <Scene imageUrl={images[index]} hovered={hovered} />
        </Canvas>
      </Suspense>
    </div>
  )
}
