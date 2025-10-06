/**
 * Responsive container component
 * Consistent max-width and padding across pages
 */

export default function Container({
  children,
  size = 'default',
  className = '',
  ...props
}) {
  const baseStyles = 'mx-auto px-4 sm:px-6 lg:px-8';

  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const containerClasses = [
    baseStyles,
    sizes[size] || sizes.default,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}
