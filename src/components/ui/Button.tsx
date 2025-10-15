import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110',
  secondary: 'bg-blueSoft text-gray-900 hover:bg-blue-200',
  ghost: 'bg-transparent hover:bg-blueSoft'
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-3 text-lg'
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button className={`rounded transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props} />
  );
}
