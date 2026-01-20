import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-black text-white 
    hover:bg-gray-800 
    active:bg-gray-900
    disabled:bg-gray-300 disabled:text-gray-500
  `,
  secondary: `
    bg-gray-100 text-black 
    hover:bg-gray-200 
    active:bg-gray-300
    disabled:bg-gray-100 disabled:text-gray-400
  `,
  outline: `
    bg-transparent text-black 
    border-2 border-black
    hover:bg-black hover:text-white
    active:bg-gray-900
    disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400
  `,
  ghost: `
    bg-transparent text-black
    hover:bg-gray-100
    active:bg-gray-200
    disabled:text-gray-400 disabled:hover:bg-transparent
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-medium
          rounded-none
          transition-all duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          cursor-pointer
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
