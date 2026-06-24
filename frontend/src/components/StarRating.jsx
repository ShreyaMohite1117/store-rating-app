// Renders 5 stars. Pass `value` + `onChange` to make it interactive (a rating picker).
// Omit `onChange` to render a read-only display of an existing rating.
export default function StarRating({ value = 0, onChange, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <span className={`star-rating star-rating--${size}`} role={interactive ? 'radiogroup' : 'img'}>
      {stars.map((n) => (
        <span
          key={n}
          className={`star ${n <= Math.round(value) ? 'star--filled' : ''} ${interactive ? 'star--interactive' : ''}`}
          onClick={interactive ? () => onChange(n) : undefined}
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? n === value : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={
            interactive
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') onChange(n);
                }
              : undefined
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}
