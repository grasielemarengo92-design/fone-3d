import * as THREE from 'three';

/** Progresso 0..1 de `value` dentro da faixa [start, end], com transição suave. */
export function bandProgress(value: number, start: number, end: number): number {
  if (end === start) return value >= end ? 1 : 0;
  const t = (value - start) / (end - start);
  return THREE.MathUtils.smoothstep(t, 0, 1);
}

/** Progresso linear (sem suavização) 0..1 de `value` dentro da faixa. */
export function bandLinear(value: number, start: number, end: number): number {
  if (end === start) return value >= end ? 1 : 0;
  return THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return THREE.MathUtils.lerp(a, b, t);
}
