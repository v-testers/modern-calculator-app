import React from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorButton } from './CalculatorButton';
import { useCalculator } from '../hooks/useCalculator';
import { useTheme } from '../hooks/useTheme';

export const Calculator: React.FC = () => {
  const {
    display,
    inputNumber,
    inputDecimal,
    clear,
    performOperation,
    calculate,
    toggleSign,
    percentage,
  } = useCalculator();

  const { toggleTheme, theme } = useTheme();

  const handleNumberClick = (num: string) => () => inputNumber(num);
  const handleOperationClick = (op: '+' | '-' | '*' | '/') => () => performOperation(op);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'colorful': return '🎨';
      default: return '🌙';
    }
  };

  return (
    <div className="calculator">
      <div className="calculator__header">
        <h1 className="calculator__title">Calculator</h1>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Current theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>
      </div>
      
      <CalculatorDisplay value={display} />
      
      <div className="calculator__buttons">
        {/* First row */}
        <CalculatorButton onClick={clear} variant="function">
          AC
        </CalculatorButton>
        <CalculatorButton onClick={toggleSign} variant="function">
          ±
        </CalculatorButton>
        <CalculatorButton onClick={percentage} variant="function">
          %
        </CalculatorButton>
        <CalculatorButton onClick={handleOperationClick('/')} variant="operator">
          ÷
        </CalculatorButton>

        {/* Second row */}
        <CalculatorButton onClick={handleNumberClick('7')}>
          7
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('8')}>
          8
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('9')}>
          9
        </CalculatorButton>
        <CalculatorButton onClick={handleOperationClick('*')} variant="operator">
          ×
        </CalculatorButton>

        {/* Third row */}
        <CalculatorButton onClick={handleNumberClick('4')}>
          4
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('5')}>
          5
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('6')}>
          6
        </CalculatorButton>
        <CalculatorButton onClick={handleOperationClick('-')} variant="operator">
          −
        </CalculatorButton>

        {/* Fourth row */}
        <CalculatorButton onClick={handleNumberClick('1')}>
          1
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('2')}>
          2
        </CalculatorButton>
        <CalculatorButton onClick={handleNumberClick('3')}>
          3
        </CalculatorButton>
        <CalculatorButton onClick={handleOperationClick('+')} variant="operator">
          +
        </CalculatorButton>

        {/* Fifth row */}
        <CalculatorButton onClick={handleNumberClick('0')} size="wide">
          0
        </CalculatorButton>
        <CalculatorButton onClick={inputDecimal}>
          .
        </CalculatorButton>
        <CalculatorButton onClick={calculate} variant="equals">
          =
        </CalculatorButton>
      </div>
    </div>
  );
};