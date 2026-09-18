import { howItWorks } from '../data/content';

export function HowItWorksSection() {
  return (
    <section className="page-section how-it-works" id="experiencia">
      <div className="section-inner">
        <p className="section-eyebrow">Como funciona</p>
        <h2>Do som ao ouvido, em milissegundos.</h2>
        <ol className="flow-list">
          {howItWorks.map((step, i) => (
            <li key={step.id} className="flow-list__item">
              <span className="flow-list__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="flow-list__label">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
