
import { useState } from 'react'
import './App.css'

function Square({ value, onClick: onClickHandler }: ({ value: string, onClick: () => void })) {
  return (
    <button
      className="square"
      onClick={onClickHandler}
    >{value}</button>
  )
}

function Board() {
  const [xIsNext, setXIsNext] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(''))

  function onClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  const winner = calculateWinner(squares)
  const status = typeof winner === 'string'
    ? `Winner: ${winner}`
    : winner === null
      ? `Next player: ${(xIsNext ? 'X' : 'O')}`
      : 'No winner'

  return (
    <>
      <div className="status">{ status }</div>
      <div className="board">
        <Square value={squares[0]} onClick={() => onClick(0)}/>
        <Square value={squares[1]} onClick={() => onClick(1)}/>
        <Square value={squares[2]} onClick={() => onClick(2)}/>
        <Square value={squares[3]} onClick={() => onClick(3)}/>
        <Square value={squares[4]} onClick={() => onClick(4)}/>
        <Square value={squares[5]} onClick={() => onClick(5)}/>
        <Square value={squares[6]} onClick={() => onClick(6)}/>
        <Square value={squares[7]} onClick={() => onClick(7)}/>
        <Square value={squares[8]} onClick={() => onClick(8)}/>
      </div>
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UnusedElement() {
  const [count, setCount] = useState(0)

  function onClickHandler() {
    /**
     * This is okay if
     * - you call it once
     * - update is synchronous
     * - no batching / no async / no derived updates
     */
    // return setCount(count + 1)
    /**
     * using the functional updater form: (count => count + 1)
     * - React passes the latest state value into the function
     * - Each update is applied sequentially
     * - Safe against batching, async updates, and stale closures
     */
    return setCount(count => count + 1)
  }

  return (
    <div className="card">
      <button onClick={onClickHandler}>count is {count}</button>
    </div>
  )
}

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const linesLength = 8 // lines.length
  let isBoardFilled = true
  for (let i = 0; i < linesLength; i++) {
    const [a, b, c] = lines[i]
    const squareA = squares[a]
    if (squareA && squareA === squares[b] && squareA === squares[c]) {
      return squareA
    }
    if (squares[i] === '') isBoardFilled = false
  }

  return isBoardFilled ? false : null
}

export default function App() {
  return <Board />
}
