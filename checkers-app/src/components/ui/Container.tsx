import { HTMLAttributes, forwardRef } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const maxWidthStyles = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'lg', padding = true, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          mx-auto w-full
          ${maxWidthStyles[maxWidth]}
          ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
