import { useState, useCallback } from 'react';

export type Operation = '+' | '-' | '*' | '/' | null;

export interface Note {
  id: string;
  text: string;
  calculation: string;
  result: string;
  timestamp: Date;
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: Operation;
  waitingForNewValue: boolean;
  notes: Note[];
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    notes: [],
  });

  const inputNumber = useCallback((num: string) => {
    setState((prevState) => {
      // Reset from error state
      if (prevState.display === 'Error') {
        return {
          ...prevState,
          display: num,
          previousValue: null,
          operation: null,
          waitingForNewValue: false,
        };
      }
      
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: num,
          waitingForNewValue: false,
        };
      }
      
      if (prevState.display === '0') {
        return {
          ...prevState,
          display: num,
        };
      }
      
      // Prevent display from getting too long
      if (prevState.display.length >= 15) {
        return prevState;
      }
      
      return {
        ...prevState,
        display: prevState.display + num,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prevState) => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: '0.',
          waitingForNewValue: false,
        };
      }
      
      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        };
      }
      
      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
    }));
  }, []);

  const performOperation = useCallback((nextOperation: Operation) => {
    setState((prevState) => {
      const inputValue = parseFloat(prevState.display);
      
      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForNewValue: true,
        };
      }
      
      if (prevState.operation && prevState.waitingForNewValue) {
        return {
          ...prevState,
          operation: nextOperation,
        };
      }
      
      let result: number;
      
      switch (prevState.operation) {
        case '+':
          result = prevState.previousValue + inputValue;
          break;
        case '-':
          result = prevState.previousValue - inputValue;
          break;
        case '*':
          result = prevState.previousValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            return {
              ...prevState,
              display: 'Error',
              previousValue: null,
              operation: null,
              waitingForNewValue: true,
            };
          }
          result = prevState.previousValue / inputValue;
          break;
        default:
          result = inputValue;
      }
      
      return {
        ...prevState,
        display: String(result),
        previousValue: result,
        operation: nextOperation,
        waitingForNewValue: true,
      };
    });
  }, []);

  const calculate = useCallback(() => {
    setState((prevState) => {
      const inputValue = parseFloat(prevState.display);
      
      if (prevState.previousValue === null || !prevState.operation) {
        return prevState;
      }
      
      let result: number;
      
      switch (prevState.operation) {
        case '+':
          result = prevState.previousValue + inputValue;
          break;
        case '-':
          result = prevState.previousValue - inputValue;
          break;
        case '*':
          result = prevState.previousValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            return {
              ...prevState,
              display: 'Error',
              previousValue: null,
              operation: null,
              waitingForNewValue: true,
            };
          }
          result = prevState.previousValue / inputValue;
          break;
        default:
          result = inputValue;
      }
      
      return {
        ...prevState,
        display: String(result),
        previousValue: null,
        operation: null,
        waitingForNewValue: true,
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState((prevState) => {
      const value = parseFloat(prevState.display);
      return {
        ...prevState,
        display: String(-value),
      };
    });
  }, []);

  const percentage = useCallback(() => {
    setState((prevState) => {
      const value = parseFloat(prevState.display);
      return {
        ...prevState,
        display: String(value / 100),
      };
    });
  }, []);

  const addNote = useCallback((text: string) => {
    setState((prevState) => {
      const calculation = formatCurrentCalculation(prevState);
      const newNote: Note = {
        id: Date.now().toString(),
        text,
        calculation,
        result: prevState.display,
        timestamp: new Date(),
      };
      
      return {
        ...prevState,
        notes: [...prevState.notes, newNote],
      };
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      notes: prevState.notes.filter(note => note.id !== id),
    }));
  }, []);

  const clearAllNotes = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      notes: [],
    }));
  }, []);

  const formatCurrentCalculation = (state: CalculatorState): string => {
    if (state.previousValue === null) {
      return state.display;
    }
    
    const operatorSymbol = state.operation === '*' ? '×' : 
                          state.operation === '/' ? '÷' : 
                          state.operation === '-' ? '−' : 
                          state.operation === '+' ? '+' : '';
    
    return `${state.previousValue} ${operatorSymbol} ${state.display}`;
  };

  return {
    display: state.display,
    notes: state.notes,
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
  };
};