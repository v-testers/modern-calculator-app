import React from 'react';

interface CalculatorDisplayProps {
  value: string;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }) => {
  const formatDisplayValue = (val: string): string => {
    const num = parseFloat(val);
    
    if (isNaN(num)) return '0';
    
    // Handle very large numbers with scientific notation
    if (Math.abs(num) >= 1e10) {
      return num.toExponential(2);
    }
    
    // Handle very small numbers
    if (Math.abs(num) < 1e-6 && num !== 0) {
      return num.toExponential(2);
    }
    
    // Format with appropriate decimal places
    if (num % 1 === 0) {
      return num.toLocaleString();
    }
    
    return parseFloat(num.toFixed(8)).toString();
  };

  return (
    <div className="calculator-display">
      <span className="calculator-display__value">
        {formatDisplayValue(value)}
      </span>
    </div>
  );
};