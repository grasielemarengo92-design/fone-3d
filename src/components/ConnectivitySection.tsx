import { connectivitySection } from '../data/content';

export function ConnectivitySection() {
  return (
    <section className="page-section connectivity-section" aria-label="Conectividade">
      <div className="section-inner section-inner--center">
        <h2>{connectivitySection.title}</h2>
        <p>{connectivitySection.subtitle}</p>
        <ul className="device-list">
          {connectivitySection.devices.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
