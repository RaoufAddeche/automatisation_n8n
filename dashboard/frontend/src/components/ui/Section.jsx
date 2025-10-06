/**
 * Section component for consistent spacing between page sections
 */

import Container from './Container';

export default function Section({
  children,
  id,
  title,
  subtitle,
  containerSize = 'default',
  spacing = 'default',
  background = 'transparent',
  className = '',
  ...props
}) {
  const spacings = {
    sm: 'py-8',
    default: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
  };

  const backgrounds = {
    transparent: 'bg-transparent',
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
  };

  const sectionClasses = [
    spacings[spacing] || spacings.default,
    backgrounds[background] || backgrounds.transparent,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section id={id} className={sectionClasses} {...props}>
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
