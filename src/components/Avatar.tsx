import { toneFor } from '../utils';

interface AvatarProps {
  name: string;
  photo?: string;
  className?: string; // e.g. "avatar--card" or "avatar--xl"
}

// Shows the member's photo, or their initials on a neutral tone if there is none.
export function Avatar({ name, photo, className = '' }: AvatarProps) {
  if (photo) return <img className={`avatar ${className}`} src={photo} alt={name} />;
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('') || '?';
  return (
    <div
      className={`avatar avatar--fallback tone-${toneFor(name)} ${className}`}
      role="img"
      aria-label={name}
    >
      {initials}
    </div>
  );
}
