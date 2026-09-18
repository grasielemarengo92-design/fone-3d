// Fonte única de verdade para a "linha do tempo" cinematográfica do scroll.
// Cada seção ocupa 1 "página" (100vh) dentro do ScrollControls.

export const TOTAL_PAGES = 12;

export const pageIndex = {
  hero: 0,
  rotate360: 1,
  zoom: 2,
  disassemblyStart: 3,
  internals: 4,
  technology: 5,
  howItWorks: 6,
  audio: 7,
  battery: 8,
  connectivity: 9,
  reassembly: 10,
  final: 11,
} as const;

export type SectionKey = keyof typeof pageIndex;

export const sectionOrder: SectionKey[] = [
  'hero',
  'rotate360',
  'zoom',
  'disassemblyStart',
  'internals',
  'technology',
  'howItWorks',
  'audio',
  'battery',
  'connectivity',
  'reassembly',
  'final',
];

/** Retorna a seção "ativa" (mais visível) para um dado progresso global de página (0..TOTAL_PAGES). */
export function activeSectionForPage(p: number): SectionKey {
  const idx = Math.min(sectionOrder.length - 1, Math.max(0, Math.round(p)));
  return sectionOrder[idx];
}
