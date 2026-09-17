"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type * as THREE from "three";
import { useThemeStore } from "@/lib/store/theme";

function GlassesRig({ progress, light }: { progress: MotionValue<number>; light: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const p = progress.get();
    const targetY = p * Math.PI * 2.6 - 0.45;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.07;
    group.current.rotation.x = -0.09 + Math.sin(p * Math.PI) * 0.14;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.32) * 0.025;
    group.current.position.y = -0.06 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05 - p * 0.35;
    group.current.scale.setScalar(1 + p * 0.1);
  });

  const frameMat = {
    color: light ? "#c8a35a" : "#d9ac57",
    metalness: 0.95,
    roughness: light ? 0.22 : 0.18,
  } as const;

  // Brand-navy smoked lenses — carries the logo colour into the hero.
  const lensMat = {
    color: light ? "#16386e" : "#0d2344",
    transparent: true,
    opacity: light ? 0.62 : 0.74,
    roughness: 0.05,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  } as const;

  const lensX = 0.64;
  const lensR = 0.56;

  return (
    <group ref={group}>
      {[-1, 1].map((side) => (
        <mesh key={`lens-${side}`} position={[side * lensX, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[lensR - 0.06, lensR - 0.06, 0.05, 48]} />
          <meshPhysicalMaterial {...lensMat} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh key={`rim-${side}`} position={[side * lensX, 0, 0]} rotation={[0, side * 0.06, 0]}>
          <torusGeometry args={[lensR, 0.05, 22, 56]} />
          <meshStandardMaterial {...frameMat} />
        </mesh>
      ))}

      <mesh position={[0, 0.06, 0.02]}>
        <boxGeometry args={[0.34, 0.055, 0.055]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[0, -0.05, 0.02]}>
        <boxGeometry args={[0.26, 0.035, 0.035]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`arm-${side}`} position={[side * (lensX + lensR - 0.02), 0.02, 0.05]}>
          <mesh position={[side * 0.5, -0.02, -0.42]} rotation={[0, side * 0.62, 0]}>
            <boxGeometry args={[1.05, 0.04, 0.04]} />
            <meshStandardMaterial {...frameMat} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.05, 18, 18]} />
            <meshStandardMaterial {...frameMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function GlassesScene({ progress }: { progress: MotionValue<number> }) {
  const theme = useThemeStore((s) => s.theme);
  const light = theme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={light ? 0.85 : 0.25} />
      <directionalLight position={[3, 4, 3]} intensity={light ? 2.4 : 2.1} color="#fff3dc" />
      <directionalLight position={[-4, 1, -2]} intensity={light ? 1.4 : 1.1} color="#8fb2e2" />
      <pointLight position={[0, -2, 2]} intensity={light ? 0.6 : 0.8} color="#cc9d4a" />
      <spotLight
        position={[0, 5, 1]}
        angle={0.5}
        penumbra={1}
        intensity={light ? 1.6 : 1.2}
        color="#ffffff"
      />
      <GlassesRig progress={progress} light={light} />
    </Canvas>
  );
}
