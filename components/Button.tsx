import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-neon-blue border border-blue-400 focus:ring-blue-500",
    secondary: "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-neon-cyan border border-cyan-400 focus:ring-cyan-500",
    danger: "bg-red-900/50 text-red-200 hover:bg-red-800/80 border border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] focus:ring-red-500",
    outline: "border-2 border-blue-500/50 bg-transparent text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300 hover:shadow-neon-blue focus:ring-blue-500",
    ghost: "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white focus:ring-slate-400"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};