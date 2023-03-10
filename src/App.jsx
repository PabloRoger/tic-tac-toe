import { useState } from "react";
import confetti from "canvas-confetti";

import { Square } from "./Components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinner, checkEndGame } from "./logic/board.js";
import { Winner } from "./Components/Winner.jsx";
import { BoardGame } from "./Components/BoardGame.jsx";

function App() {

  const [board, setBoard] = useState(()=>{
    const boardFromLocalStorage = window.localStorage.getItem('board')
    return boardFromLocalStorage ? JSON.parse(boardFromLocalStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(()=>{
    const turnFromLocalStorage = window.localStorage.getItem('turn')
    return turnFromLocalStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const updateBoard = (index) => {
    //si hay ganador o ya hay una ficha en el cuadro, no hace nada
    if(board[index] || winner) return

    //actualiza el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    //cambia de turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn);

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    console.log(newTurn)

    //revisa si hay ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard))
      setWinner(false)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <div className="App">
      <header className="Header">
        <h1>Tic Tac Toe</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      </header>

      <main className="board">
        <button onClick={resetGame}>Reiniciar</button>
        <BoardGame board={board} updateBoard={updateBoard} />

        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        <Winner winner={winner} resetGame={resetGame} />
      </main>
    </div>
  );
}

export default App;
