import { useEffect, useState } from 'react';

/**
 * Combina a preferência do sistema (prefers-reduced-motion) com um toggle manual
 * exposto na interface, para que o usuário sempre tenha controle explícito.
 */
export function useReducedMotion(): [boolean, (value: boolean) => void] {
  const [systemPref, setSystemPref] = useState(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPref(mq.matches);
    const listener = (e: MediaQueryListEvent) => setSystemPref(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const reduced = manualOverride ?? systemPref;
  return [reduced, (value: boolean) => setManualOverride(value)];
}
