
import { useState } from 'react'
import './App.css'

function Square(
  { value, onClick: onClickHandler }: ({ value: string, onClick: () => void })
) {
  return (
    <button
      className="square"
      onClick={onClickHandler}
    >{value}</button>
  )
}

function Board(
  { xIsNext, squares, onPlay }: { xIsNext: boolean, squares: string[], onPlay: (nextSquares: string[]) => void }
) {
  function onClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  const status = typeof winner === 'string'
    ? `Winner: ${winner}`
    : winner === null
      ? `Next player: ${(xIsNext ? 'X' : 'O')}`
      : 'No winner'

  /**
   * React uses keys internally to
   *  - match old elements to new ones
   *  - minimize dom mutations
   *  - preserve component state correctly
   *
   * When index keys are not safe
   *  - when items can be reordered
   *  - items can be inserted/removed
   *  - items represent user-editable data
   *
   * If no key is specified, React will report an error and use the array index as a key
   *  by default. Using the array index as a key is problematic when trying to re-order a
   *  list's items or inserting/removing list items. Explicitly passing key={i} silences
   *  the error but has the same problems as array indices and is not recommended in most
   *  cases.
   */
  const SquareElements = []
  for (let i = 0; i <= 8; i++) {
    SquareElements.push(<Square key={i} value={squares[i]} onClick={() => onClick(i)}/>)
  }

  return (
    <>
      <div className="status">{ status }</div>
      <div className="board">
        {SquareElements}
      </div>
    </>
  )
}

/**
 * React render cycle allows you to move state and calculations outside of clickHandlers
 * to the root of the element.
 */
function Game() {
  const [history, setHistory] = useState([Array(9).fill('')])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function onPlay(nextSquares: string[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(historyIdx: number) {
    setCurrentMove(historyIdx)
  }

  const moves = history.map((_squares, historyIdx) => {
    const description = historyIdx > 0
      ? `Go to move #${historyIdx}`
      : 'Go to game start'

    // Its okay to use the index here since moves will never be re-ordered, deleted, or
    // inserted in the middle
    return (
      // eslint-disable-next-line react-x/no-array-index-key
      <li key={historyIdx}>
        <button onClick={() => jumpTo(historyIdx)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={onPlay}/>
        </div>
        <div className="game-info">
          <ol>
            {moves}
          </ol>
        </div>
    </div>
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
  return <Game />
}
