import { batterySection } from '../data/content';

export function BatterySection() {
  return (
    <section className="page-section battery-section" aria-label="Bateria">
      <div className="section-inner section-inner--center">
        <h2>{batterySection.title}</h2>
        <p className="muted-note">{batterySection.note}</p>
      </div>
    </section>
  );
}
