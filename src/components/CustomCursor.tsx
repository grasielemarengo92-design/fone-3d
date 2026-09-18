import { useEffect, useRef } from 'react';
import { useCursorLabel } from '../hooks/useCursorLabel';

/** Cursor discreto e customizado, visível apenas em dispositivos com ponteiro fino (mouse). */
export function CustomCursor() {
  const { label } = useCursorLabel();
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const el = dotRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div ref={dotRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor__dot" />
      {label && <span className="custom-cursor__label">{label}</span>}
    </div>
  );
}
