import React, { useState } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorButton } from './CalculatorButton';
import { Clock } from './Clock';
import { Notes } from './Notes';
import { Calendar } from './Calendar';
import { Alarm } from './Alarm';
import { useCalculator } from '../hooks/useCalculator';
import { useTheme } from '../hooks/useTheme';

type TabType = 'calculator' | 'calendar' | 'alarm';

export const Calculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  
  const {
    display,
    notes,
    inputNumber,
    inputDecimal,
    clear,
    performOperation,
    calculate,
    toggleSign,
    percentage,
    addNote,
    removeNote,
    clearAllNotes,
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

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'calculator': return '🔢';
      case 'calendar': return '📅';
      case 'alarm': return '⏰';
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'calculator': return 'Calculator';
      case 'calendar': return 'Calendar';
      case 'alarm': return 'Alarm';
    }
  };

  return (
    <div className="calculator">
      <div className="calculator__header">
        <div className="calculator__header-left">
          <h1 className="calculator__title">{getTabLabel(activeTab)}</h1>
        </div>
        <div className="calculator__header-right">
          <Clock />
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
      
      <div className="calculator__tabs">
        {(['calculator', 'calendar', 'alarm'] as TabType[]).map(tab => (
          <button
            key={tab}
            className={`calculator__tab ${activeTab === tab ? 'calculator__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="calculator__tab-icon">{getTabIcon(tab)}</span>
            <span className="calculator__tab-label">{getTabLabel(tab)}</span>
          </button>
        ))}
      </div>
      
      <div className="calculator__content">
        {activeTab === 'calculator' && (
          <>
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
            
            <Notes
              notes={notes}
              onAddNote={addNote}
              onRemoveNote={removeNote}
              onClearAllNotes={clearAllNotes}
            />
          </>
        )}
        
        {activeTab === 'calendar' && <Calendar />}
        
        {activeTab === 'alarm' && <Alarm />}
      </div>
    </div>
  );
};