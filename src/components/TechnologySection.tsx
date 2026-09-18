import { motion } from 'framer-motion';
import { technologies } from '../data/content';

export function TechnologySection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="page-section tech-section" id="tecnologia">
      <div className="section-inner">
        <p className="section-eyebrow">Tecnologia</p>
        <h2>Cada componente, pensado com propósito.</h2>
        <div className="tech-grid">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.id}
              className="tech-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: reducedMotion ? 0 : i * 0.04 }}
            >
              <h3>{tech.title}</h3>
              <p>{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
