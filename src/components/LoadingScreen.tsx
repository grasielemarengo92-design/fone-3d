import { AnimatePresence, motion } from 'framer-motion';
import { loadingScreen } from '../data/content';

export function LoadingScreen({ visible, progress }: { visible: boolean; progress: number }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="loading-screen__mark" aria-hidden="true" />
          <p className="loading-screen__text">{loadingScreen.message}</p>
          <div className="loading-screen__bar">
            <div className="loading-screen__bar-fill" style={{ width: `${Math.round(progress)}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
