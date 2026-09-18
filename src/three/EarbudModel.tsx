import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { PartId } from '../data/content';
import { parts as partsData } from '../data/content';

export interface PartTransform {
  assembled: THREE.Vector3;
  exploded: THREE.Vector3;
  rotationExploded?: THREE.Euler;
}

/** Posições de montagem (dentro da carcaça) e de explosão (espalhadas no espaço) de cada peça. */
export const partTransforms: Record<PartId, PartTransform> = {
  shell: {
    assembled: new THREE.Vector3(0, 0, 0),
    exploded: new THREE.Vector3(0, 1.7, 0),
  },
  driver: {
    assembled: new THREE.Vector3(0, 0.05, 0.05),
    exploded: new THREE.Vector3(-1.6, 0.5, 0.9),
    rotationExploded: new THREE.Euler(0.3, 0.2, 0),
  },
  mics: {
    assembled: new THREE.Vector3(0, -0.1, 0.15),
    exploded: new THREE.Vector3(1.5, 0.9, 1.1),
  },
  battery: {
    assembled: new THREE.Vector3(0, -0.35, -0.05),
    exploded: new THREE.Vector3(-1.8, -0.9, -0.6),
    rotationExploded: new THREE.Euler(0, 0.4, 0.1),
  },
  board: {
    assembled: new THREE.Vector3(0, -0.05, -0.1),
    exploded: new THREE.Vector3(1.7, -0.2, -1.0),
    rotationExploded: new THREE.Euler(0.15, -0.3, 0),
  },
  chip: {
    assembled: new THREE.Vector3(0, -0.05, -0.08),
    exploded: new THREE.Vector3(1.75, -0.15, -0.55),
    rotationExploded: new THREE.Euler(0.15, -0.3, 0),
  },
  sensors: {
    assembled: new THREE.Vector3(0, 0.2, 0.1),
    exploded: new THREE.Vector3(-1.3, 1.3, -0.8),
  },
  antenna: {
    assembled: new THREE.Vector3(0, -0.5, 0),
    exploded: new THREE.Vector3(1.4, -1.4, 0.5),
    rotationExploded: new THREE.Euler(0.6, 0, 0.2),
  },
};

/** Ordem/atraso de cada peça na cascata de desmontagem (0 = primeira a se mover). */
export const partOrder: Record<PartId, number> = Object.fromEntries(
  partsData.map((p) => [p.id, p.order])
) as Record<PartId, number>;

interface EarbudModelProps {
  /** 0 = montado, 1 = totalmente explodido */
  explodeT: number;
  /** id da peça em destaque (spotlight), ou null */
  spotlightId: PartId | null;
  /** id da peça sob o ponteiro/selecionada, ou null */
  hoveredId: PartId | null;
  onPartPointerOver?: (id: PartId, worldPos: THREE.Vector3) => void;
  onPartPointerOut?: () => void;
  onPartClick?: (id: PartId, worldPos: THREE.Vector3) => void;
}

const shellMaterial = new THREE.MeshPhysicalMaterial({
  color: '#f2f2f0',
  roughness: 0.28,
  metalness: 0.05,
  clearcoat: 0.6,
  clearcoatRoughness: 0.25,
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: '#c9cdd3',
  roughness: 0.2,
  metalness: 0.9,
});

const boardMaterial = new THREE.MeshStandardMaterial({
  color: '#1f2a24',
  roughness: 0.55,
  metalness: 0.35,
});

const chipMaterial = new THREE.MeshStandardMaterial({
  color: '#0a0a0c',
  roughness: 0.35,
  metalness: 0.6,
});

const batteryMaterial = new THREE.MeshStandardMaterial({
  color: '#c7c29a',
  roughness: 0.4,
  metalness: 0.2,
});

const driverMaterial = new THREE.MeshStandardMaterial({
  color: '#b98a4e',
  roughness: 0.3,
  metalness: 0.75,
});

const antennaMaterial = new THREE.MeshStandardMaterial({
  color: '#b3773f',
  roughness: 0.25,
  metalness: 0.95,
});

function PartGroup({
  id,
  explodeT,
  isSpotlit,
  isDimmed,
  isHovered,
  onPointerOver,
  onPointerOut,
  onClick,
  children,
}: {
  id: PartId;
  explodeT: number;
  isSpotlit: boolean;
  isDimmed: boolean;
  isHovered: boolean;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
  onClick?: (e: any) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const t = partTransforms[id];
  const order = partOrder[id];

  // Cascata: cada peça tem sua própria janela dentro de explodeT (0..1 global),
  // criando o efeito de "não desaparecer tudo de uma vez".
  const windowStart = order * 0.09;
  const windowEnd = Math.min(1, windowStart + 0.32);
  const localT =
    explodeT <= windowStart
      ? 0
      : explodeT >= windowEnd
        ? 1
        : (explodeT - windowStart) / (windowEnd - windowStart);
  const smoothLocalT = THREE.MathUtils.smoothstep(localT, 0, 1);

  const pos = t.assembled.clone().lerp(t.exploded, smoothLocalT);
  const rot = t.rotationExploded
    ? [
        t.rotationExploded.x * smoothLocalT,
        t.rotationExploded.y * smoothLocalT,
        t.rotationExploded.z * smoothLocalT,
      ]
    : [0, 0, 0];

  // Peças "sem destaque" enquanto outra está em spotlight ficam ligeiramente
  // recolhidas na escala, reforçando o foco visual sem exigir materiais únicos por peça.
  const scale = isSpotlit ? 1.15 : isHovered ? 1.06 : isDimmed ? 0.94 : 1;

  return (
    <group
      ref={ref}
      position={pos}
      rotation={rot as [number, number, number]}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.(e);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
    </group>
  );
}

export function EarbudModel({
  explodeT,
  spotlightId,
  hoveredId,
  onPartPointerOver,
  onPartPointerOut,
  onPartClick,
}: EarbudModelProps) {
  const dimOthers = spotlightId !== null;

  const groupsProps = useMemo(
    () =>
      partsData.map((p) => ({
        isSpotlit: spotlightId === p.id,
        isDimmed: dimOthers && spotlightId !== p.id,
        isHovered: hoveredId === p.id,
      })),
    [spotlightId, hoveredId, dimOthers]
  );

  const emitPointer =
    (id: PartId, handler?: (id: PartId, pos: THREE.Vector3) => void) => (e: any) => {
      handler?.(id, e.point ?? partTransforms[id].exploded);
    };

  return (
    <group>
      {/* Carcaça externa (shell) */}
      <PartGroup
        id="shell"
        explodeT={explodeT}
        {...groupsProps[0]}
        onPointerOver={emitPointer('shell', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('shell', onPartClick)}
      >
        <mesh material={shellMaterial} castShadow receiveShadow>
          <capsuleGeometry args={[0.62, 0.55, 6, 24]} />
        </mesh>
        <mesh position={[0, -0.85, 0.05]} rotation={[0.12, 0, 0]} material={shellMaterial} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 0.9, 20]} />
        </mesh>
      </PartGroup>

      {/* Driver / alto-falante */}
      <PartGroup
        id="driver"
        explodeT={explodeT}
        {...groupsProps[1]}
        onPointerOver={emitPointer('driver', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('driver', onPartClick)}
      >
        <mesh material={driverMaterial} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
        </mesh>
        <mesh position={[0, 0.05, 0]} material={metalMaterial}>
          <torusGeometry args={[0.2, 0.015, 8, 32]} />
        </mesh>
      </PartGroup>

      {/* Microfones */}
      <PartGroup
        id="mics"
        explodeT={explodeT}
        {...groupsProps[2]}
        onPointerOver={emitPointer('mics', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('mics', onPartClick)}
      >
        <mesh position={[0.12, 0, 0]} material={metalMaterial} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} material={metalMaterial} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
        </mesh>
      </PartGroup>

      {/* Bateria */}
      <PartGroup
        id="battery"
        explodeT={explodeT}
        {...groupsProps[3]}
        onPointerOver={emitPointer('battery', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('battery', onPartClick)}
      >
        <mesh material={batteryMaterial} castShadow>
          <boxGeometry args={[0.5, 0.28, 0.16]} />
        </mesh>
      </PartGroup>

      {/* Placa eletrônica */}
      <PartGroup
        id="board"
        explodeT={explodeT}
        {...groupsProps[4]}
        onPointerOver={emitPointer('board', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('board', onPartClick)}
      >
        <mesh material={boardMaterial} castShadow>
          <boxGeometry args={[0.55, 0.32, 0.04]} />
        </mesh>
      </PartGroup>

      {/* Chip principal */}
      <PartGroup
        id="chip"
        explodeT={explodeT}
        {...groupsProps[5]}
        onPointerOver={emitPointer('chip', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('chip', onPartClick)}
      >
        <mesh material={chipMaterial} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.05]} />
        </mesh>
      </PartGroup>

      {/* Sensores */}
      <PartGroup
        id="sensors"
        explodeT={explodeT}
        {...groupsProps[6]}
        onPointerOver={emitPointer('sensors', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('sensors', onPartClick)}
      >
        <mesh position={[0.08, 0, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
        <mesh position={[-0.08, 0, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
      </PartGroup>

      {/* Antena */}
      <PartGroup
        id="antenna"
        explodeT={explodeT}
        {...groupsProps[7]}
        onPointerOver={emitPointer('antenna', onPartPointerOver)}
        onPointerOut={onPartPointerOut}
        onClick={emitPointer('antenna', onPartClick)}
      >
        <mesh material={antennaMaterial} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        </mesh>
      </PartGroup>
    </group>
  );
}
