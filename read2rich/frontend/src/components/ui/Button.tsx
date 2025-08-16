import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-300';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-dark-300 hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-dark-100 text-white border border-white/20 hover:bg-dark-50 focus:ring-white/20',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/20'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
