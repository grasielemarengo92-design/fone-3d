import { interactionHints } from '../data/content';
import { useIsTouchDevice } from '../hooks/useIsMobile';

export function InteractionHint({ onExplore }: { onExplore: () => void }) {
  const isTouch = useIsTouchDevice();

  return (
    <div className="interaction-hint" aria-label="Como interagir">
      <p className="interaction-hint__title">Interação</p>
      <ul>
        {isTouch ? (
          <>
            <li>
              <span>Toque</span>
              {interactionHints.touch.drag}
            </li>
            <li>
              <span>Dois dedos</span>
              {interactionHints.touch.pinch}
            </li>
          </>
        ) : (
          <>
            <li>
              <span>Mouse</span>
              {interactionHints.desktop.drag}
            </li>
            <li>
              <span>Scroll</span>
              {interactionHints.desktop.scroll}
            </li>
          </>
        )}
      </ul>
      <button type="button" className="interaction-hint__cta" onClick={onExplore}>
        {interactionHints.desktop.exploreCta}
      </button>
    </div>
  );
}
