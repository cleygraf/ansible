(() => {
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardEl = document.getElementById("board");
  const cells = [...boardEl.querySelectorAll(".cell")];
  const statusEl = document.getElementById("status");
  const scoreXEl = document.getElementById("score-x");
  const scoreOEl = document.getElementById("score-o");
  const newGameBtn = document.getElementById("new-game");
  const resetScoresBtn = document.getElementById("reset-scores");

  let board = Array(9).fill(null);
  let current = "X";
  let locked = false;
  let scores = { X: 0, O: 0 };

  function setStatus(text, mode) {
    statusEl.textContent = text;
    statusEl.className = `turn${mode ? ` is-${mode}` : ""}`;
  }

  function renderScores() {
    scoreXEl.textContent = String(scores.X);
    scoreOEl.textContent = String(scores.O);
  }

  function getWinner() {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line };
      }
    }
    return null;
  }

  function paintCell(index, player) {
    const cell = cells[index];
    cell.innerHTML = "";
    if (!player) {
      cell.disabled = locked;
      cell.setAttribute("aria-label", `Feld ${index + 1}`);
      return;
    }

    const mark = document.createElement("span");
    mark.className = `mark mark-${player.toLowerCase()}`;
    mark.setAttribute("aria-hidden", "true");
    cell.appendChild(mark);
    cell.disabled = true;
    cell.setAttribute("aria-label", `Feld ${index + 1}, ${player}`);
  }

  function highlightWin(line) {
    for (const index of line) {
      cells[index].classList.add("win");
    }
  }

  function clearHighlights() {
    for (const cell of cells) {
      cell.classList.remove("win");
    }
  }

  function endRound(message, mode, winningLine) {
    locked = true;
    setStatus(message, mode);
    if (winningLine) highlightWin(winningLine);
    for (const cell of cells) cell.disabled = true;
  }

  function afterMove() {
    const win = getWinner();
    if (win) {
      scores[win.player] += 1;
      renderScores();
      endRound(`${win.player} gewinnt!`, "win", win.line);
      return;
    }

    if (board.every(Boolean)) {
      endRound("Unentschieden", "draw");
      return;
    }

    current = current === "X" ? "O" : "X";
    setStatus(`${current} ist dran`, current.toLowerCase());
  }

  function place(index) {
    if (locked || board[index]) return;
    board[index] = current;
    paintCell(index, current);
    afterMove();
  }

  function newGame() {
    board = Array(9).fill(null);
    current = "X";
    locked = false;
    clearHighlights();
    cells.forEach((_, index) => paintCell(index, null));
    for (const cell of cells) cell.disabled = false;
    setStatus("X ist dran", "x");
  }

  function resetScores() {
    scores = { X: 0, O: 0 };
    renderScores();
    newGame();
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      place(Number(cell.dataset.index));
    });
  });

  newGameBtn.addEventListener("click", newGame);
  resetScoresBtn.addEventListener("click", resetScores);

  renderScores();
  setStatus("X ist dran", "x");
})();
