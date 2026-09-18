import { audioSection } from '../data/content';

export function AudioSection() {
  return (
    <section className="page-section audio-section" aria-label="Áudio">
      <div className="section-inner section-inner--center">
        <h2>{audioSection.title}</h2>
        <p>{audioSection.subtitle}</p>
      </div>
    </section>
  );
}
