import { accessibility } from '../data/content';

export function AccessibilityControls({
  reduced,
  onToggle,
}: {
  reduced: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <div className="a11y-controls">
      <a href="#main-content" className="a11y-controls__skip">
        {accessibility.skipToContent}
      </a>
      <label className="a11y-controls__toggle">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label={accessibility.reduceMotionLabel}
        />
        {accessibility.reduceMotionLabel}
      </label>
    </div>
  );
}
