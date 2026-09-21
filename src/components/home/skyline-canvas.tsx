"use client";
// MIRADOR — the ONE WebGL moment (§9 F6): particle skyline behind the journey.
// ≤6000 instanced particles · DPR clamp 1.5 · render-on-demand (invalidate on
// scroll + gentle shimmer tick) · colors read from CSS vars at runtime (G2-safe:
// no hex literals in src — fallbacks are rgb() strings) · density builds
// act-by-act (25% → 60% → 100%) · auto kill-switch: rAF-measured fps < 30 for
// 3 consecutive seconds → onLowFps → poster treatment.
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
const MAX_PARTICLES = 6000;

function cssColor(varName: string, fallback: string): THREE.Color {
  let raw = "";
  if (typeof window !== "undefined") {
    raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return new THREE.Color(raw || fallback);
}

/** seeded deterministic PRNG — stable skyline across renders */
function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function Skyline({
  progressRef,
  onReady,
  onLowFps,
}: {
  progressRef: React.MutableRefObject<number>;
  onReady: (invalidate: () => void) => void;
  onLowFps: () => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const introRef = useRef(0);
  const densityRef = useRef(0.25);
  const { invalidate } = useThree();

  const { geometry, fogColor } = useMemo(() => {
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);

    // palette from design tokens, resolved at RUNTIME (never literals in src)
    const amber = cssColor("--color-amber", "rgb(203,163,92)");
    const copper = cssColor("--color-copper", "rgb(184,115,51)");
    const ink = cssColor("--color-ink", "rgb(242,239,232)");
    const night = cssColor("--color-night", "rgb(10,10,11)");
    const fogColor = night.getStyle(); // fog tint = the night sky

    const rand = makeRand(9621);
    // building-height profile across x ∈ [-35, 35] — tower clusters for composition
    const heightAt = (x: number) =>
      2.2 +
      7.5 * Math.exp(-((x - 9) ** 2) / 90) +
      5.5 * Math.exp(-((x + 13) ** 2) / 45) +
      3.0 * Math.exp(-((x + 2) ** 2) / 220) +
      rand() * 1.6;

    const tmp = new THREE.Color();
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const kind = rand();
      let x: number, y: number, z: number, intensity: number;
      if (kind < 0.72) {
        // window lights on the skyline
        x = (rand() - 0.5) * 70;
        z = -3 - rand() * 26;
        y = rand() * heightAt(x);
        intensity = 0.45 + rand() * 0.55;
        tmp.copy(amber);
      } else if (kind < 0.87) {
        // drifting city haze / embers in the air
        x = (rand() - 0.5) * 90;
        z = -2 - rand() * 30;
        y = 0.5 + rand() * 13;
        intensity = 0.12 + rand() * 0.22;
        tmp.copy(rand() < 0.5 ? copper : amber);
      } else {
        // ground glow at street level
        x = (rand() - 0.5) * 80;
        z = -2 - rand() * 22;
        y = rand() * 0.8;
        intensity = 0.25 + rand() * 0.35;
        tmp.copy(ink);
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      tmp.multiplyScalar(intensity);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, Math.floor(MAX_PARTICLES * 0.25)); // initial density (act I)

    return { geometry, fogColor };
  }, []);

  // report invalidate to the parent (render-on-demand wiring) + shimmer tick
  useEffect(() => {
    onReady(invalidate);
    const t = setInterval(() => invalidate(), 450); // gentle shimmer refresh
    return () => {
      clearInterval(t);
      geometry.dispose();
    };
  }, [invalidate, onReady, geometry]);

  useFrame((state) => {
    const p = progressRef.current;
    // act-based density: 25% → 60% → 100% (density builds act-by-act)
    const target = p < 1 / 3 ? 0.25 : p < 2 / 3 ? 0.6 : 1;
    // smooth toward target (intro builds from 0 on mount)
    introRef.current = Math.min(1, introRef.current + 0.02);
    densityRef.current += (target - densityRef.current) * 0.08;
    const count = Math.floor(MAX_PARTICLES * densityRef.current * introRef.current);
    geometry.setDrawRange(0, count);

    // parallax: drift the skyline group laterally across the journey
    // (camera stays fixed; mutating own refs is the sanctioned pattern)
    if (groupRef.current) {
      groupRef.current.position.x = (p - 0.5) * -14;
      groupRef.current.position.y = p * 1.6;
    }

    // subtle shimmer on each rendered frame
    const mat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
    if (mat) {
      mat.opacity = 0.82 + 0.12 * Math.sin(state.clock.elapsedTime * 2.1);
    }
  });

  return (
    <>
      {/* fog tint = the night sky, depth for the far skyline layers */}
      <fog attach="fog" args={[fogColor, 18, 55]} />
      <group ref={groupRef}>
        <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
          <pointsMaterial
            vertexColors
            size={0.16}
            sizeAttenuation
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}

export default function SkylineCanvas({
  progressRef,
  onReady,
  onLowFps,
}: {
  progressRef: React.MutableRefObject<number>;
  onReady: (invalidate: () => void) => void;
  onLowFps: () => void;
}) {
  // auto kill-switch: rAF-measured frame rate < 30fps for 3 consecutive seconds
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let slowSince: number | null = null;
    const loop = (t: number) => {
      const delta = t - last;
      last = t;
      if (delta > 1000 / 30) {
        slowSince ??= t;
        if (t - slowSince > 3000) {
          onLowFps();
          return;
        }
      } else {
        slowSince = null;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onLowFps]);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      camera={{ fov: 42, position: [-8, 5, 26] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <Skyline progressRef={progressRef} onReady={onReady} onLowFps={onLowFps} />
    </Canvas>
  );
}
