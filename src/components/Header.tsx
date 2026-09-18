import { useState } from 'react';
import { brand, nav } from '../data/content';
import { useCursorLabel } from '../hooks/useCursorLabel';

export function Header() {
  const [open, setOpen] = useState(false);
  const { setLabel } = useCursorLabel();

  return (
    <header className="site-header">
      <a
        href={nav[0].href}
        className="site-header__brand"
        onMouseEnter={() => setLabel('ABRIR')}
        onMouseLeave={() => setLabel(null)}
      >
        {brand.name}
      </a>

      <nav className="site-header__nav" aria-label="Navegação principal">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onMouseEnter={() => setLabel('ABRIR')}
            onMouseLeave={() => setLabel(null)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="site-header__burger"
        aria-expanded={open}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="site-header__mobile-menu" role="dialog" aria-label="Menu">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
