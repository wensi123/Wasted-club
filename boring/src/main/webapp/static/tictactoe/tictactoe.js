document.addEventListener('DOMContentLoaded', () => {
    const cells = [];
    const statusText = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const modeButtons = document.querySelectorAll('input[name="mode"]');
    const player1ScoreText = document.getElementById('player1-score');
    const player2ScoreText = document.getElementById('player2-score');
    let currentPlayer = 'X'; // X 始终是先手
    let gameState = Array(9).fill(null);
    let gameActive = true;
    let isPlayerVsComputer = false;
    let player1Score = parseInt(player1ScoreText.textContent) || 0;
    let player2Score = parseInt(player2ScoreText.textContent) || 0;
    let lastWinner = 'X'; // 初始先手玩家

    const xSvgPath = '错误.svg'; // 请替换为正确的 X 图标路径
    const oSvgPath = 'O.svg'; // 请替换为正确的 O 图标路径

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // 初始化棋盘
    const board = document.querySelector('.board');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }

    // 模式切换监听器
    modeButtons.forEach(button => button.addEventListener('change', () => {
        isPlayerVsComputer = document.querySelector('input[name="mode"]:checked').value === 'computer';
        resetGameBoard();
    }));

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'), 10);
    
        if (gameState[cellIndex] !== null || !gameActive || (isPlayerVsComputer && currentPlayer !== 'X')) return;
    
        gameState[cellIndex] = currentPlayer;
        cell.innerHTML = `<img src="${currentPlayer === 'X' ? xSvgPath : oSvgPath}" alt="${currentPlayer}" style="max-width: 70%; max-height: 70%;">`;
        checkForWinnerOrDraw();
    
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // 切换玩家
            if (isPlayerVsComputer && currentPlayer === 'O') {
                setTimeout(computerMove, 1000);
            }
        }
    }

    function computerMove() {
        let moveFound = false;
        while (!moveFound) {
            const move = getBestMove(gameState, 'O');
            if (gameState[move.index] === null) {
                gameState[move.index] = 'O';
                cells[move.index].innerHTML = `<img src="${oSvgPath}" alt="O" style="max-width: 70%; max-height: 70%;">`;
                checkForWinnerOrDraw();
                currentPlayer = 'X'; // 切换回玩家
                moveFound = true;
            }
        }
    }

    function getBestMove(board, player) {
        let bestScore = player === 'O' ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = player;
                let score = minimax(board, player === 'O' ? 'X' : 'O', 0, player === 'O');
                board[i] = null; // Undo the move

                if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
                    bestScore = score;
                    bestMove = {index: i};
                }
            }
        }

        return bestMove || {index: Math.floor(Math.random() * board.length)};
    }

    function minimax(board, player, depth, isMaximizing) {
        let winner = checkForWinner();
        if (winner) {
            if (winner === player) {
                return 10 - depth;
            } else if (winner === 'X' || winner === 'O') {
                return depth - 10;
            }
        } else if (!board.includes(null)) {
            return 0;
        }

        let moves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = player;
                let score = minimax(board, player === 'O' ? 'X' : 'O', depth + 1, !isMaximizing);
                board[i] = null;
                moves.push({index: i, score: score});
            }
        }

        if (isMaximizing) {
            return moves.reduce((max, move) => (move.score > max.score ? move : max), moves[0]);
        } else {
            return moves.reduce((min, move) => (move.score < min.score ? move : min), moves[0]);
        }
    }

    function checkForWinnerOrDraw() {
    let winner = checkForWinner();
    if (winner) {
        statusText.textContent = `玩家 ${winner} 获胜！`;
        gameActive = false;
        lastWinner = winner; // 更新最后获胜的玩家
        if (winner === 'X') {
            player1Score++;
            player1ScoreText.textContent = player1Score;
        } else if (winner === 'O') {
            player2Score++;
            player2ScoreText.textContent = player2Score;
        }
    } else if (!gameState.includes(null)) {
        statusText.textContent = '平局！';
        gameActive = false;
        lastWinner = 'X'; // 平局后重置先手为玩家 X
    } else {
        statusText.textContent = `玩家 ${currentPlayer} 的回合`;
    }
}

    function checkForWinner() {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }

        if (!gameState.includes(null)) {
            return null;
        }

        return null;
    }

    function resetGameBoard() {
        gameState = Array(9).fill(null);
        cells.forEach(cell => {
            cell.innerHTML = '';
        });
        gameActive = true;
        // 根据最后获胜的玩家设置先手
        if (lastWinner === 'X') {
            currentPlayer = 'X';
        } else {
            currentPlayer = 'O';
        }
        if (isPlayerVsComputer) {
            if(lastWinner==='O'){
            // 如果是人机模式，根据先手自动开始
            setTimeout(computerMove, 1000);
            }    
        }
        statusText.textContent = `玩家 ${currentPlayer} 的回合`;
    }

    function resetGame() {
        resetGameBoard();
    }

    resetButton.addEventListener('click', resetGame);
    window.addEventListener('beforeunload', logToDatabase); // 页面关闭时记录数据

    function logToDatabase() {
        const playerData = {
            player1: {
                name: '玩家1',
                score: player1Score,
                onlineTime: parseInt(timerText.textContent)
            },
        };
        console.log('记录到数据库：', playerData);
    }

    resetGameBoard(); // 初始化游戏
});