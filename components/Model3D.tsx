"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import type { Group } from "three";

function Model() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/y.grairi-model.glb");

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function Model3D() {
  return (
    <div className="w-full h-[95vh]  fixed top-[10%] -right-[38%] pointer-events-none">
      <Canvas camera={{ position: [0, 1, 3], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
