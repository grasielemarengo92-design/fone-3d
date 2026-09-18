import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface CursorContextValue {
  label: string | null;
  setLabel: (label: string | null) => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorLabelProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabelState] = useState<string | null>(null);
  const lastRef = useRef<string | null>(null);

  const setLabel = useCallback((next: string | null) => {
    if (lastRef.current === next) return;
    lastRef.current = next;
    setLabelState(next);
  }, []);

  return (
    <CursorContext.Provider value={{ label, setLabel }}>{children}</CursorContext.Provider>
  );
}

export function useCursorLabel() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursorLabel deve ser usado dentro de CursorLabelProvider');
  return ctx;
}
