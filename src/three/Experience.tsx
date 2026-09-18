import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PresentationControls,
  ContactShadows,
  Points,
  PointMaterial,
  useScroll,
} from '@react-three/drei';
import * as THREE from 'three';
import { EarbudModel, partTransforms } from './EarbudModel';
import { PartHotspot } from './PartHotspot';
import { parts as partsData, type PartId } from '../data/content';
import { pageIndex, TOTAL_PAGES } from '../data/timeline';
import { bandProgress, lerp } from '../utils/easing';
import { useCursorLabel } from '../hooks/useCursorLabel';

function HeroParticles({ opacity }: { opacity: number }) {
  const positions = useMemo(() => {
    const count = 180;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  if (opacity <= 0.01) return null;

  return (
    <Points ref={ref as any} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#c9c9c9"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity * 0.6}
      />
    </Points>
  );
}

function SoundWaves({ visible }: { visible: boolean }) {
  const ringsRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ringsRef.current) return;
    const t = clock.getElapsedTime();
    ringsRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const phase = (t * 0.4 + i * 0.33) % 1;
      const scale = 1 + phase * 2.2;
      mesh.scale.setScalar(scale);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = visible ? Math.max(0, 0.5 * (1 - phase)) : 0;
    });
  });

  return (
    <group ref={ringsRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 0.94, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

interface SceneProps {
  reducedMotion: boolean;
  selectedPart: PartId | null;
  onSelectPart: (id: PartId | null) => void;
}

export function Scene({ reducedMotion, selectedPart, onSelectPart }: SceneProps) {
  const scroll = useScroll();
  const { camera, gl, scene } = useThree();
  const [hoveredId, setHoveredId] = useState<PartId | null>(null);
  const [explodeT, setExplodeT] = useState(0);
  const [progress, setProgress] = useState(0);
  const { setLabel } = useCursorLabel();

  const rotateGroupRef = useRef<THREE.Group>(null);
  const manualZoomRef = useRef(0);
  const idleTimeRef = useRef(0);
  const bgColorRef = useRef(new THREE.Color('#fafaf9'));
  const lightBg = useMemo(() => new THREE.Color('#fafaf9'), []);
  const darkBg = useMemo(() => new THREE.Color('#0c0a09'), []);

  // Pinch-to-zoom (gesto de dois dedos) sem interferir no scroll de página.
  useEffect(() => {
    const el = gl.domElement;
    let lastDist: number | null = null;

    const distance = (touches: TouchList) => {
      const [a, b] = [touches[0], touches[1]];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = distance(e.touches);
        if (lastDist !== null) {
          const delta = (d - lastDist) * 0.01;
          manualZoomRef.current = THREE.MathUtils.clamp(manualZoomRef.current + delta, -1.2, 1.2);
        }
        lastDist = d;
      }
    };
    const onTouchEnd = () => {
      lastDist = null;
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl]);

  useFrame((state, delta) => {
    idleTimeRef.current += delta;
    const offset = scroll.offset; // 0..1 no total do ScrollControls
    const p = offset * TOTAL_PAGES;

    // ---- Explosão (0 montado -> 1 explodido) ----
    let explodeT: number;
    if (p < pageIndex.disassemblyStart) {
      explodeT = 0;
    } else if (p < pageIndex.internals + 1) {
      explodeT = bandProgress(p, pageIndex.disassemblyStart, pageIndex.internals + 1);
    } else if (p < pageIndex.reassembly) {
      explodeT = 1;
    } else if (p < pageIndex.reassembly + 1) {
      explodeT = 1 - bandProgress(p, pageIndex.reassembly, pageIndex.reassembly + 1);
    } else {
      explodeT = 0;
    }
    setExplodeT(explodeT);
    setProgress(p);

    // ---- Cor de fundo da cena (escurece durante a seção de áudio) ----
    const audioIn = bandProgress(p, pageIndex.audio - 0.6, pageIndex.audio + 0.15);
    const audioOut = 1 - bandProgress(p, pageIndex.audio + 0.85, pageIndex.battery - 0.1);
    const darkness = Math.min(audioIn, audioOut);
    bgColorRef.current.copy(lightBg).lerp(darkBg, THREE.MathUtils.clamp(darkness, 0, 1));
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(bgColorRef.current);
    } else {
      scene.background = bgColorRef.current.clone();
    }

    // ---- Câmera ----
    let camZ: number;
    let camY = 0;

    if (p < pageIndex.rotate360) {
      camZ = 5.4;
    } else if (p < pageIndex.zoom) {
      camZ = 5.4;
    } else if (p < pageIndex.disassemblyStart) {
      camZ = lerp(5.4, 3.5, bandProgress(p, pageIndex.zoom, pageIndex.disassemblyStart));
      camY = lerp(0, 0.08, bandProgress(p, pageIndex.zoom, pageIndex.disassemblyStart));
    } else if (p < pageIndex.internals) {
      camZ = lerp(3.5, 3.1, bandProgress(p, pageIndex.disassemblyStart, pageIndex.internals));
      camY = 0.1;
    } else if (p < pageIndex.internals + 1) {
      camZ = lerp(3.1, 6.0, bandProgress(p, pageIndex.internals, pageIndex.internals + 1));
      camY = lerp(0.1, 0.2, bandProgress(p, pageIndex.internals, pageIndex.internals + 1));
    } else if (p < pageIndex.reassembly) {
      camZ = 6.1;
      camY = 0.2;
    } else if (p < pageIndex.reassembly + 1) {
      camZ = lerp(6.1, 5.3, bandProgress(p, pageIndex.reassembly, pageIndex.reassembly + 1));
      camY = lerp(0.2, 0, bandProgress(p, pageIndex.reassembly, pageIndex.reassembly + 1));
    } else {
      camZ = lerp(5.3, 5.9, bandProgress(p, pageIndex.reassembly + 1, TOTAL_PAGES));
      camY = 0;
    }

    camZ += manualZoomRef.current;

    // suave flutuação no hero para não parecer estático
    const idleFloat = reducedMotion ? 0 : Math.sin(idleTimeRef.current * 0.6) * 0.03;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY + idleFloat, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, delta);
    camera.lookAt(0, 0, 0);

    // ---- Rotação automática (seção "Rotação 360") + órbita lenta durante exploração ----
    if (rotateGroupRef.current) {
      let targetY = 0;
      if (p >= pageIndex.rotate360 && p < pageIndex.zoom) {
        targetY = bandProgress(p, pageIndex.rotate360, pageIndex.zoom) * Math.PI * 2;
      } else if (p >= pageIndex.zoom && p < pageIndex.internals + 1) {
        targetY = Math.PI * 2;
      } else if (p >= pageIndex.internals + 1 && p < pageIndex.reassembly) {
        const orbitSpeed = reducedMotion ? 0 : 0.15;
        targetY = Math.PI * 2 + idleTimeRef.current * orbitSpeed;
      } else if (p >= pageIndex.reassembly) {
        const settle = bandProgress(p, pageIndex.reassembly, pageIndex.reassembly + 1);
        targetY = lerp(rotateGroupRef.current.rotation.y, 0, settle);
      }
      rotateGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rotateGroupRef.current.rotation.y,
        targetY,
        3,
        delta
      );
    }
  });

  const spotlightId = useMemo(() => {
    const active = partsData.find((part) => {
      if (!part.spotlightSection) return false;
      const start = pageIndex[part.spotlightSection];
      return progress >= start - 0.3 && progress < start + 1.3;
    });
    return active?.id ?? null;
  }, [progress]);

  const showHotspots = progress >= pageIndex.internals - 0.2 && progress < pageIndex.reassembly + 0.3;

  useEffect(() => {
    setLabel(hoveredId ? 'EXPLORAR' : null);
  }, [hoveredId, setLabel]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.4} />
      <Environment preset="studio" />

      <HeroParticles opacity={1 - bandProgress(progress, 0, pageIndex.rotate360)} />

      <group ref={rotateGroupRef}>
        <PresentationControls
          global={false}
          snap={false}
          cursor={false}
          rotation={[0, 0, 0]}
          polar={[-0.4, 0.4]}
          azimuth={[-1.2, 1.2]}
          config={{ mass: 1, tension: 170, friction: 26 }}
        >
          <group
            onPointerOver={() => setLabel('ARRASTAR')}
            onPointerOut={() => setLabel(hoveredId ? 'EXPLORAR' : null)}
          >
            <EarbudModel
              explodeT={explodeT}
              spotlightId={spotlightId}
              hoveredId={hoveredId}
              onPartPointerOver={(id) => setHoveredId(id)}
              onPartPointerOut={() => setHoveredId(null)}
              onPartClick={(id) => onSelectPart(id)}
            />
            {showHotspots &&
              partsData.map((part) => (
                <PartHotspot
                  key={part.id}
                  id={part.id}
                  label={part.label}
                  position={partTransforms[part.id].exploded.clone()}
                  visible={showHotspots}
                  active={hoveredId === part.id || selectedPart === part.id}
                  onSelect={onSelectPart}
                />
              ))}
          </group>
        </PresentationControls>
        <SoundWaves
          visible={progress >= pageIndex.audio - 0.3 && progress < pageIndex.audio + 1.3}
        />
      </group>

      <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={6} blur={2.4} far={2} />
    </>
  );
}
