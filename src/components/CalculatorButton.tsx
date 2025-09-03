import React from 'react';

interface CalculatorButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'number' | 'operator' | 'function' | 'equals';
  size?: 'normal' | 'wide';
  className?: string;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  onClick,
  children,
  variant = 'number',
  size = 'normal',
  className = '',
}) => {
  const baseClasses = 'calculator-button';
  const variantClass = `calculator-button--${variant}`;
  const sizeClass = size === 'wide' ? 'calculator-button--wide' : '';
  
  const classes = [baseClasses, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};