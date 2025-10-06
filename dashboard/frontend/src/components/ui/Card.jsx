/**
 * Reusable Card component
 * Atomic UI component for consistent container styling
 */

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'default',
  ...props
}) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700';

  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = [
    baseStyles,
    hoverStyles,
    paddings[padding] || paddings.default,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}
