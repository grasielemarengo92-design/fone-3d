import { disassemblySection, reassemblySection } from '../data/content';

export function RotateSection() {
  return (
    <section className="page-section narrative-section" aria-label="Rotação 360 graus">
      <div className="section-inner section-inner--center">
        <p className="section-eyebrow">360°</p>
        <h2>Um design pensado de todos os ângulos.</h2>
      </div>
    </section>
  );
}

export function ZoomSection() {
  return (
    <section className="page-section narrative-section" aria-label="Detalhes do produto" id="produto">
      <div className="section-inner section-inner--center">
        <p className="section-eyebrow">Detalhe</p>
        <h2>Cada acabamento, examinado de perto.</h2>
      </div>
    </section>
  );
}

export function DisassemblyStartSection() {
  return (
    <section className="page-section narrative-section" aria-label="Início da desmontagem">
      <div className="section-inner section-inner--center">
        <h2>{disassemblySection.title}</h2>
        <p className="hero-hint">{disassemblySection.hint} ↓</p>
      </div>
    </section>
  );
}

export function InternalsSection() {
  return (
    <section className="page-section narrative-section internals-section" id="especificacoes" aria-label="Componentes internos">
      <div className="section-inner section-inner--center">
        <p className="section-eyebrow">Por dentro</p>
        <h2>Toque em cada peça para conhecer sua função.</h2>
      </div>
    </section>
  );
}

export function ReassemblySection() {
  return (
    <section className="page-section narrative-section" aria-label="Remontagem">
      <div className="section-inner section-inner--center">
        <h2>Tudo volta ao lugar.</h2>
      </div>
    </section>
  );
}

export function FinalSection() {
  return (
    <section className="page-section narrative-section final-section" aria-label="Produto final">
      <div className="section-inner section-inner--center">
        <h2>{reassemblySection.finalLine}</h2>
      </div>
    </section>
  );
}
