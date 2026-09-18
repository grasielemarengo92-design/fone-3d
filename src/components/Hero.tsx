import { motion } from 'framer-motion';
import { hero } from '../data/content';

export function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="page-section hero-section" id="hero">
      <motion.div
        className="hero-content"
        initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <p className="section-eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <p className="hero-hint" aria-hidden="true">
          {hero.hint} ↓
        </p>
      </motion.div>
    </section>
  );
}
