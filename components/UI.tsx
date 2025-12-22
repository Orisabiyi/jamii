import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'accent' | 'outline'; className?: string }> = ({
  children, variant = 'primary', className = ''
}) => {
  const variants = {
    primary: 'bg-primary/10 text-primary-dark border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-dark border-secondary/20',
    accent: 'bg-orange-100 text-orange-800 border-orange-200',
    outline: 'bg-transparent border-gray-200 text-gray-600 border'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; className?: string; onClick?: React.MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" | "reset"; disabled?: boolean }> = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button type={type} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export const Input: React.FC<{ label?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${className}`} {...props} />
  </div>
);
