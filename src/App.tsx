import { useState } from 'react'
import './App.css'

export default function App() {
  const [displayValue, setDisplayValue] = useState('0')
  const [previousValue, setPreviousValue] = useState('')
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function inputDigit(digit: string) {
    if (displayValue === 'Error') {
      handleClear()
      setDisplayValue(digit)
      return
    }
    if (waitingForOperand) {
      setDisplayValue(digit)
      setWaitingForOperand(false)
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit)
    }
  }

  function inputDecimal() {
    if (displayValue === 'Error') {
      handleClear()
      setDisplayValue('0.')
      return
    }
    if (waitingForOperand) {
      setDisplayValue('0.')
      setWaitingForOperand(false)
      return
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.')
    }
  }

  function compute(left: string, right: string, op: string): number | 'Error' {
    const a = parseFloat(left)
    const b = parseFloat(right)
    let result: number
    switch (op) {
      case '+': result = a + b; break
      case '−': result = a - b; break
      case '×': result = a * b; break
      case '÷': result = a / b; break
      default: result = b
    }
    if (!isFinite(result) || isNaN(result)) return 'Error'
    return result
  }

  function handleOperator(nextOperator: string) {
    if (displayValue === 'Error') {
      handleClear()
      setOperator(nextOperator)
      setWaitingForOperand(true)
      return
    }
    if (operator && !waitingForOperand) {
      const result = compute(previousValue, displayValue, operator)
      if (result === 'Error') {
        setDisplayValue('Error')
        setPreviousValue('')
        setOperator(null)
        setWaitingForOperand(false)
        return
      }
      const resultStr = String(parseFloat(result.toPrecision(10)))
      setDisplayValue(resultStr)
      setPreviousValue(resultStr)
    } else {
      setPreviousValue(displayValue)
    }
    setOperator(nextOperator)
    setWaitingForOperand(true)
  }

  function handleEquals() {
    if (displayValue === 'Error') {
      handleClear()
      return
    }
    if (!operator || waitingForOperand) return
    const result = compute(previousValue, displayValue, operator)
    if (result === 'Error') {
      setDisplayValue('Error')
      setPreviousValue('')
      setOperator(null)
      setWaitingForOperand(false)
      return
    }
    const resultStr = String(parseFloat(result.toPrecision(10)))
    setDisplayValue(resultStr)
    setPreviousValue('')
    setOperator(null)
    setWaitingForOperand(false)
  }

  function handleClear() {
    setDisplayValue('0')
    setPreviousValue('')
    setOperator(null)
    setWaitingForOperand(false)
  }

  function toggleSign() {
    const value = parseFloat(displayValue)
    if (value !== 0) {
      setDisplayValue(String(-value))
    }
  }

  function handlePercent() {
    const value = parseFloat(displayValue)
    setDisplayValue(String(value / 100))
  }

  const isLong = displayValue.length > 9

  return (
    <div className="calculator">
      <div className={`display${isLong ? ' display--small' : ''}`}>
        {displayValue}
      </div>
      <div className="buttons">
        <button className="btn btn-function" onClick={handleClear}>AC</button>
        <button className="btn btn-function" onClick={toggleSign}>+/−</button>
        <button className="btn btn-function" onClick={handlePercent}>%</button>
        <button
          className={`btn btn-operator${operator === '÷' && waitingForOperand ? ' active' : ''}`}
          onClick={() => handleOperator('÷')}
        >÷</button>

        <button className="btn btn-number" onClick={() => inputDigit('7')}>7</button>
        <button className="btn btn-number" onClick={() => inputDigit('8')}>8</button>
        <button className="btn btn-number" onClick={() => inputDigit('9')}>9</button>
        <button
          className={`btn btn-operator${operator === '×' && waitingForOperand ? ' active' : ''}`}
          onClick={() => handleOperator('×')}
        >×</button>

        <button className="btn btn-number" onClick={() => inputDigit('4')}>4</button>
        <button className="btn btn-number" onClick={() => inputDigit('5')}>5</button>
        <button className="btn btn-number" onClick={() => inputDigit('6')}>6</button>
        <button
          className={`btn btn-operator${operator === '−' && waitingForOperand ? ' active' : ''}`}
          onClick={() => handleOperator('−')}
        >−</button>

        <button className="btn btn-number" onClick={() => inputDigit('1')}>1</button>
        <button className="btn btn-number" onClick={() => inputDigit('2')}>2</button>
        <button className="btn btn-number" onClick={() => inputDigit('3')}>3</button>
        <button
          className={`btn btn-operator${operator === '+' && waitingForOperand ? ' active' : ''}`}
          onClick={() => handleOperator('+')}
        >+</button>

        <button className="btn btn-number btn-zero" onClick={() => inputDigit('0')}>0</button>
        <button className="btn btn-number" onClick={inputDecimal}>.</button>
        <button className="btn btn-operator" onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}
