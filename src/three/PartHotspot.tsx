import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PartId } from '../data/content';

interface PartHotspotProps {
  id: PartId;
  label: string;
  position: THREE.Vector3;
  visible: boolean;
  active: boolean;
  onSelect: (id: PartId) => void;
}

export function PartHotspot({ id, label, position, visible, active, onSelect }: PartHotspotProps) {
  if (!visible) return null;

  const dir = position.clone().normalize();
  const labelPos = position.clone().add(dir.multiplyScalar(0.55));

  return (
    <group>
      <Line
        points={[position, labelPos]}
        color={active ? '#111111' : '#9a9a9a'}
        lineWidth={1}
        transparent
        opacity={active ? 0.9 : 0.35}
      />
      <Html position={labelPos} center distanceFactor={8} zIndexRange={[10, 0]}>
        <button
          type="button"
          className={`hotspot-chip${active ? ' hotspot-chip--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          aria-label={`Ver detalhes: ${label}`}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}
