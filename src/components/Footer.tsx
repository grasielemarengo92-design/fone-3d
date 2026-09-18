import { brand } from '../data/content';

export function Footer() {
  return (
    <footer className="site-footer" id="comprar">
      <div className="site-footer__inner">
        <p className="site-footer__brand">{brand.name}</p>
        <p className="site-footer__legal">{brand.legalNote}</p>
        <p className="site-footer__copy">© {new Date().getFullYear()} — Projeto conceitual, feito com React, Three.js e React Three Fiber.</p>
      </div>
    </footer>
  );
}
