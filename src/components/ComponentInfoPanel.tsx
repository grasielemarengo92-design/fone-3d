import { AnimatePresence, motion } from 'framer-motion';
import { parts, type PartId } from '../data/content';

export function ComponentInfoPanel({
  selected,
  onClose,
}: {
  selected: PartId | null;
  onClose: () => void;
}) {
  const info = parts.find((p) => p.id === selected) ?? null;

  return (
    <AnimatePresence>
      {info && (
        <motion.aside
          className="component-panel"
          role="dialog"
          aria-label={`Detalhes: ${info.label}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            className="component-panel__close"
            onClick={onClose}
            aria-label="Fechar detalhes do componente"
          >
            ×
          </button>
          <h3>{info.label}</h3>
          <p>{info.description}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
