/* eslint-disable react/no-unknown-property */
"use client";

import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  useFBO,
  Preload,
  MeshTransmissionMaterial,
} from "@react-three/drei";

export type GlassMaterialProps = {
  scale?: number;
  ior?: number;
  thickness?: number;
  anisotropy?: number;
  chromaticAberration?: number;
  transmission?: number;
  roughness?: number;
  color?: string;
  attenuationColor?: string;
  attenuationDistance?: number;
};

type FluidGlassProps = {
  cubeProps?: GlassMaterialProps;
};

export default function FluidGlass({
  cubeProps = {},
}: FluidGlassProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <EmbedCube modeProps={cubeProps} />
      <Preload all />
    </Canvas>
  );
}

/**
 * Card embed: captures the transparent scene behind into an FBO,
 * then renders a cube with MeshTransmissionMaterial that uses the FBO
 * as buffer — creates a refractive glass panel with no background images.
 */
function EmbedCube({ modeProps = {} }: { modeProps?: GlassMaterialProps }) {
  const ref = useRef<THREE.Mesh>(null);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  useFrame((state) => {
    const { gl, camera } = state;
    if (!ref.current) return;
    const v = vp.getCurrentViewport(camera, [0, 0, 15]);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);

    const { scale } = modeProps;
    if (scale != null) {
      ref.current.scale.setScalar(scale);
    } else {
      ref.current.scale.set(v.width * 0.98, v.height * 0.98, Math.min(v.width, v.height) * 0.06);
    }
  });

  const {
    scale: _s,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...extraMat
  } = modeProps;

  return (
    <>
      {createPortal(null, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh ref={ref} rotation-x={Math.PI / 2}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          transmission={1}
          roughness={0.05}
          {...extraMat}
        />
      </mesh>
    </>
  );
}


