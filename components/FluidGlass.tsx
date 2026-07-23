/* eslint-disable react/no-unknown-property */
"use client";

import * as THREE from "three";
import {
  useRef,
  useState,
  useEffect,
  memo,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
} from "@react-three/drei";
import { easing } from "maath";

export type FluidGlassMode = "lens" | "bar" | "cube";

export type GlassMaterialProps = {
  /** Uniform scale, or auto-fit when omitted (embed stretches to card) */
  scale?: number;
  /** Non-uniform scale overrides (embed). Useful to flatten/stretch the cube */
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
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

export type NavItem = { label: string; link: string };

type BarProps = GlassMaterialProps & { navItems?: NavItem[] };

type FluidGlassProps = {
  mode?: FluidGlassMode;
  lensProps?: GlassMaterialProps;
  barProps?: BarProps;
  cubeProps?: GlassMaterialProps;
  /** Card embed: cube only, no backdrop scene, transparent canvas */
  embed?: boolean;
};

export default function FluidGlass({
  mode = "cube",
  lensProps = {},
  barProps = {},
  cubeProps = {},
  embed = false,
}: FluidGlassProps) {
  if (embed) {
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

  const Wrapper = mode === "bar" ? Bar : mode === "cube" ? Cube : Lens;

  let navItems: NavItem[] = [
    { label: "Home", link: "" },
    { label: "About", link: "" },
    { label: "Contact", link: "" },
  ];
  let modeProps: GlassMaterialProps = {};

  if (mode === "bar") {
    const { navItems: items, ...rest } = barProps;
    if (items) navItems = items;
    modeProps = rest;
  } else if (mode === "cube") {
    modeProps = cubeProps;
  } else {
    modeProps = lensProps;
  }

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === "bar" && <NavItems items={navItems} />}
        <Wrapper modeProps={modeProps}>
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
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

type ModeWrapperProps = {
  children?: ReactNode;
  glb: string;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: GlassMaterialProps;
} & Omit<ComponentPropsWithoutRef<"mesh">, "children" | "ref">;

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh | undefined)?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    geoWidthRef.current = box ? box.max.x - box.min.x || 1 : 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    if (!ref.current) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
        ? (pointer.y * v.height) / 2
        : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x5227ff, 1);
  });

  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...extraMat
  } = modeProps;

  const geometry = (nodes[geometryKey] as THREE.Mesh | undefined)?.geometry;

  return (
    <>
      {children != null ? createPortal(children, scene) : null}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({
  modeProps,
  ...p
}: {
  modeProps?: GlassMaterialProps;
  children?: ReactNode;
}) {
  return (
    <ModeWrapper
      glb="/assets/3d/lens.glb"
      geometryKey="Cylinder"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Cube({
  modeProps,
  ...p
}: {
  modeProps?: GlassMaterialProps;
  children?: ReactNode;
}) {
  return (
    <ModeWrapper
      glb="/assets/3d/cube.glb"
      geometryKey="Cube"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Bar({
  modeProps = {},
  ...p
}: {
  modeProps?: GlassMaterialProps;
  children?: ReactNode;
}) {
  const defaultMat: GlassMaterialProps = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: "#ffffff",
    attenuationColor: "#ffffff",
    attenuationDistance: 0.25,
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items }: { items: NavItem[] }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 },
  } as const;

  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max
      ? "mobile"
      : w <= DEVICE.tablet.max
        ? "tablet"
        : "desktop";
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice);

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    if (link.startsWith("#")) window.location.hash = link;
    else window.location.href = link;
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef<THREE.Group>(null);
  const data = useScroll();
  const { height } = useThree((s) => s.viewport);

  useFrame(() => {
    if (!group.current) return;
    const kids = group.current.children as THREE.Mesh[];
    const mat = (i: number) =>
      kids[i]?.material as THREE.MeshBasicMaterial & { zoom?: number };

    if (mat(0)) mat(0).zoom = 1 + data.range(0, 1 / 3) / 3;
    if (mat(1)) mat(1).zoom = 1 + data.range(0, 1 / 3) / 3;
    if (mat(2)) mat(2).zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    if (mat(3)) mat(3).zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    if (mat(4)) mat(4).zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    <group ref={group}>
      <Image
        position={[-2, 0, 0]}
        scale={[3, height / 1.1]}
        url="/assets/demo/cs1.webp"
      />
      <Image position={[2, 0, 3]} scale={3} url="/assets/demo/cs2.webp" />
      <Image
        position={[-2.05, -height, 6]}
        scale={[1, 3]}
        url="/assets/demo/cs3.webp"
      />
      <Image
        position={[-0.6, -height, 9]}
        scale={[1, 2]}
        url="/assets/demo/cs1.webp"
      />
      <Image
        position={[0.75, -height, 10.5]}
        scale={1.5}
        url="/assets/demo/cs2.webp"
      />
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 },
  } as const;

  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? "mobile" : w <= 1023 ? "tablet" : "desktop";
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice);

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}

useGLTF.preload("/assets/3d/cube.glb");
