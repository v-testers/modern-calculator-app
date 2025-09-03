import { useState, useCallback } from 'react';

export type Operation = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: Operation;
  waitingForNewValue: boolean;
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
  });

  const inputNumber = useCallback((num: string) => {
    setState((prevState) => {
      // Reset from error state
      if (prevState.display === 'Error') {
        return {
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
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
    });
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

  return {
    display: state.display,
    inputNumber,
    inputDecimal,
    clear,
    performOperation,
    calculate,
    toggleSign,
    percentage,
  };
};