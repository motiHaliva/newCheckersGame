let isPlayerTurn = true;
const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
const computerPlayer = JSON.parse(localStorage.getItem("computerPlayer"));
const playerScoreElement = document.querySelector("#player_score");
const computerScoreElement = document.querySelector("#computer_score");
const piecesPlayer = document.querySelector("#piecesPlayer");
const piecesComputer = document.querySelector("#piecesComputer");
let playerEat = 0;
let computerPlayerEat = 0;
let computerPlayerScore = 0;
let board = document.querySelector("#id_board");
let gameTime = 0;

let matrix = [
    [-1, 1, -1, 1, -1, 1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1],
    [-1, 1, -1, 1, -1, 1, -1, 1],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [2, -1, 2, -1, 2, -1, 2, -1],
    [-1, 2, -1, 2, -1, 2, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1],
];

// יצירת לוח המשחק והוספת כל החיילים למקומם ההתחלתי
const createBoard = () => {
    board.innerHTML = '';
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add((i + j) % 2 === 0 ? "blackCell" : "whiteCell");
            board.append(cell);
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (matrix[i][j] === 1 || matrix[i][j] === 2) {
                let circle = document.createElement("div");
                circle.dataset.row = i;
                circle.dataset.col = j;
                if (matrix[i][j] === 1) {
                    circle.classList.add("circle", "blackCircle");
                } else if (matrix[i][j] === 2) {
                    circle.classList.add("circle", "whiteCircle");
                }
                // מאזין לתא שלוחצים עליו כדי להראו לו את האפשרויות שלו
                circle.addEventListener("click", () => {
                    showPossibleMoves(circle);
                });

                cell.appendChild(circle);
                //נותן לי יכולת להזיז את העיגול
                circle.setAttribute("draggable", "true");
                // שומר על העיגול שזז
                circle.addEventListener("dragstart", dragStart);
            }
            cell.addEventListener("click", handleCellClick);

            // מאזין לתא שנגרר משהו מתוכו
            cell.addEventListener("dragover", dragOver);
            // מאזין לתא שנגרר משהו לתוכו
            cell.addEventListener("drop", drop);
        }
    }
};

let draggedCircle;

// מטפל בתחילת גרירת חייל
const dragStart = (e) => {
    if (!isPlayerTurn || e.target.classList.contains('blackCircle')) {
        e.preventDefault();
        return false;
    }
    draggedCircle = e.target;
}
// מאפשר גרירת חייל מעל תאים
const dragOver = (e) => {
    e.preventDefault();

}

// מטפל בשחרור החייל בתא חדש
const drop = (e) => {
    if (!isPlayerTurn) return;
    e.preventDefault();
    let target = e.target;

    if (isValidMove(target)) {
        // עדכון ה-DOM: העברת החייל לתא החדש
        target.appendChild(draggedCircle);

        // עדכון נתוני השורות והעמודות של החייל
        draggedCircle.dataset.row = target.dataset.row;
        draggedCircle.dataset.col = target.dataset.col;

        isPlayerTurn = false;

        if (!checkWinner()) {
            setTimeout(makeComputerMove, 1000);
        }
    }
};

// מטפל בלחיצה על תא בלוח ומאפשר הזזת חיילים על ידי לחיצה
const handleCellClick = (e) => {
    const cell = e.target;
    if (cell.classList.contains('circle')) {
        if (cell.classList.contains('whiteCircle') && isPlayerTurn) {
            showPossibleMoves(cell);
        }
        return;
    }

    if (draggedCircle && cell.classList.contains('cell')) {
        if (cell.style.backgroundImage.includes('dark_selected_wood.png')) {
            if (isValidMove(cell)) {
                cell.appendChild(draggedCircle);
                draggedCircle.dataset.row = cell.dataset.row;
                draggedCircle.dataset.col = cell.dataset.col;
                clearHighlights();
                isPlayerTurn = false;

                if (!checkWinner()) {
                    setTimeout(makeComputerMove, 1000);
                }
            }
        }
        draggedCircle = null;
    }
}

// מנהל את הטיימר של המשחק ומציג את הזמן שחלף
let seconds = 0;
const timer = () => {
    const display = document.getElementById("timer");
    const timer = setInterval(() => {
        gameTime = seconds;
        let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        let secs = String(seconds % 60).padStart(2, '0');
        display.textContent = `${hrs}:${mins}:${secs}`;
        seconds++;
        currentPlayer.playTime = (seconds / 60) + mins;
    }, 1000);
}

// מעדכן את מספר החיילים שנאכלו לכל שחקן
const updateCurrentPiecses = () => {
    const whitePieces = document.querySelectorAll('.whiteCircle').length;
    const blackPieces = document.querySelectorAll('.blackCircle').length;
    playerEat = 12 - blackPieces;
    computerPlayerEat = 12 - whitePieces;
    const firstName = currentPlayer.name.split(" ")[0];
    const playerTitle = document.querySelector(".piecesCnt h2");
    playerTitle.textContent = `Eat ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}`;
    const computerTitle = document.querySelector(".piecesCnt2 h2");
    computerTitle.textContent = "Eat Computer";
    updateCircleUi();
}

// מעדכן את התצוגה של החיילים שנאכלו בצד הלוח
const updateCircleUi = () => {
    piecesPlayer.innerHTML = '';
    piecesComputer.innerHTML = '';
    for (let i = 0; i < playerEat; i++) {
        let circle = document.createElement("div");
        circle.classList.add("circles", "blackCircles");
        circle.style.width = "35px";
        circle.style.height = "35px";
        circle.style.margin = "5px";
        piecesPlayer.appendChild(circle);
    }
    for (let i = 0; i < computerPlayerEat; i++) {
        let circle = document.createElement("div");
        circle.classList.add("circles", "whiteCircles");
        circle.style.width = "35px";
        circle.style.height = "35px";
        circle.style.margin = "5px";
        piecesComputer.appendChild(circle);
    }
}

// בודק אם מהלך אכילה הוא חוקי
const canEat = (target) => {
    let cellRow = parseInt(target.dataset.row);
    let cellCol = parseInt(target.dataset.col);
    let circleRow = parseInt(draggedCircle.dataset.row);
    let circleCol = parseInt(draggedCircle.dataset.col);



    if (!draggedCircle.classList.contains('king')) {


        if (draggedCircle.classList.contains('blackCircle')) {
            if (cellRow <= circleRow) return false;
        } else {
            if (cellRow >= circleRow) return false;
        }
    }
    // בדיקה האם המהלך הוא קפיצה של 2
    if (Math.abs(circleRow - cellRow) !== 2) return false;
    if (Math.abs(circleCol - cellCol) !== 2) return false;

    // מציאת הכלי שנמצא באמצע (שאמור להיאכל)
    let middleRow = (circleRow + cellRow) / 2;
    let middleCol = (circleCol + cellCol) / 2;



    let middleCell = document.querySelector(
        `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );

    if (!middleCell || !middleCell.firstChild) return false;

    let middlePiece = middleCell.firstChild;


    return (draggedCircle.classList.contains('blackCircle') &&
        middlePiece.classList.contains('whiteCircle')) ||
        (draggedCircle.classList.contains('whiteCircle') &&
            middlePiece.classList.contains('blackCircle'));
}

// בודק אם המהלך המבוקש הוא חוקי
const isValidMove = (target) => {
    clearHighlights();

    if (!target.classList.contains("cell")) return false;

    let cellRow = parseInt(target.dataset.row);
    let cellCol = parseInt(target.dataset.col);
    let circleRow = parseInt(draggedCircle.dataset.row);
    let circleCol = parseInt(draggedCircle.dataset.col);

    // אכילת חייל יריב
    if (canEat(target)) {
        removePiece(target);

        // עדכון המטריצה במצב של אכילה
        matrix[circleRow][circleCol] = 0; // תא החייל הקודם מתאפס
        matrix[cellRow][cellCol] = draggedCircle.classList.contains("whiteCircle") ? 2 : 1; // עדכון התא החדש

        // מציאת החייל הנאכל ועדכון המטריצה
        const middleRow = (circleRow + cellRow) / 2;
        const middleCol = (circleCol + cellCol) / 2;
        matrix[middleRow][middleCol] = 0; // התא של החייל הנאכל הופך לריק

        checkForKing(draggedCircle, cellRow);
        return true;
    }

    // בדיקה לתנועה חוקית של "קינג"
    if (draggedCircle.classList.contains('king')) {
        if (Math.abs(circleRow - cellRow) !== 1) return false;
        if (Math.abs(circleCol - cellCol) !== 1) return false;

        // עדכון המטריצה לתנועה של "קינג"
        matrix[circleRow][circleCol] = 0;
        matrix[cellRow][cellCol] = draggedCircle.classList.contains("whiteCircle") ? 2 : 1;

        return true;
    }

    // בדיקות תנועה לחיילים רגילים (שחורים ולבנים)
    if (circleRow - cellRow !== 1 && draggedCircle.classList.contains("whiteCircle")) return false;
    if (circleRow - cellRow !== -1 && draggedCircle.classList.contains("blackCircle")) return false;
    if (Math.abs(circleCol - cellCol) !== 1) return false;

    // עדכון המטריצה לתנועה רגילה
    matrix[circleRow][circleCol] = 0;
    matrix[cellRow][cellCol] = draggedCircle.classList.contains("whiteCircle") ? 2 : 1;

    checkForKing(draggedCircle, cellRow);

    return true;
};

// מסיר חייל שנאכל מהלוח
const removePiece = (target) => {
    let cellRow = parseInt(target.dataset.row);
    let cellCol = parseInt(target.dataset.col);
    let circleRow = parseInt(draggedCircle.dataset.row);
    let circleCol = parseInt(draggedCircle.dataset.col);

    let middleRow = (circleRow + cellRow) / 2;
    let middleCol = (circleCol + cellCol) / 2;

    let middleCell = document.querySelector(
        `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );

    if (middleCell && middleCell.firstChild) {
        middleCell.removeChild(middleCell.firstChild);
        matrix[middleRow][middleCol] = 0;
        updateCurrentPiecses();
        isPlayerTurn = true;
    }
}

// בודק אם חייל הגיע לשורה האחרונה והופך אותו למלך
const checkForKing = (circle, row) => {
    if (circle.classList.contains('blackCircle') && row === 7) {
        circle.classList.add('king');
        circle.style.backgroundImage = 'url("../images/dark_king.png")';
    }
    if (circle.classList.contains('whiteCircle') && row === 0) {
        circle.classList.add('king');
        circle.style.backgroundImage = 'url("../images/white_king.png")';
    }
}
// מציג את המהלכים האפשריים לחייל שנבחר
const showPossibleMoves = (circle) => {
    if (!isPlayerTurn || circle.classList.contains('blackCircle')) {
        return;
    }

    clearHighlights();
    draggedCircle = circle

    let row = parseInt(circle.dataset.row);
    let col = parseInt(circle.dataset.col);

    if (isNaN(row) || isNaN(col)) return;

    let validMoves = getValidMoves(circle, row, col);
    let eatingMoves = getEatingMoves(circle, row, col);

    validMoves.forEach(move => {
        highlightCell(move, "../images/dark_selected_wood.png");
    });

    eatingMoves.forEach(move => {
        highlightCell(move, "../images/dark_selected_wood.png");
    });
}

// מחזיר את כל מהלכי האכילה האפשריים לחייל
const getValidMoves = (circle, row, col) => {
    let moves = [];

    if (circle.classList.contains('king')) {
        moves = [
            { row: row + 1, col: col + 1 },
            { row: row + 1, col: col - 1 },
            { row: row - 1, col: col + 1 },
            { row: row - 1, col: col - 1 }
        ];
    } else if (circle.classList.contains('blackCircle')) {
        moves = [
            { row: row + 1, col: col + 1 },
            { row: row + 1, col: col - 1 }
        ];
    } else {
        moves = [
            { row: row - 1, col: col + 1 },
            { row: row - 1, col: col - 1 }
        ];
    }
    return moves.filter(move => isValidPosition(move.row, move.col));
}
// מחזיר את כל מהלכי האכילה האפשריים לחייל
const getEatingMoves = (circle, row, col) => {
    let possibleMoves = [];

    if (circle.classList.contains('king')) {
        possibleMoves = [
            { row: row + 2, col: col + 2 },
            { row: row + 2, col: col - 2 },
            { row: row - 2, col: col + 2 },
            { row: row - 2, col: col - 2 }
        ];
    }

    else if (circle.classList.contains('blackCircle')) {
        possibleMoves = [
            { row: row + 2, col: col + 2 },
            { row: row + 2, col: col - 2 }
        ];
    }

    else if (circle.classList.contains('whiteCircle')) {
        possibleMoves = [
            { row: row - 2, col: col + 2 },
            { row: row - 2, col: col - 2 }
        ];
    }


    return possibleMoves.filter(move => {
        if (!isValidPosition(move.row, move.col)) return false;
        let targetCell = document.querySelector(
            `.cell[data-row="${move.row}"][data-col="${move.col}"]`
        );
        return targetCell && canEat(targetCell);
    });
}

// מדגיש את התאים שאליהם החייל יכול לזוז
const highlightCell = (move, color) => {
    let cell = document.querySelector(
        `.cell[data-row="${move.row}"][data-col="${move.col}"]`
    );
    if (cell && !cell.firstChild && cell.classList.contains('whiteCell')) {
        cell.style.backgroundImage = `url(${color})`;
    }
}

// מנקה את כל ההדגשות מהלוח
const clearHighlights = () => {
    document.querySelectorAll('.whiteCell').forEach(cell => {
        cell.style.backgroundImage = "";
    });
}
// בודק אם המיקום על הלוח הוא חוקי
const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
// מבצע את המהלך של המחשב
const makeComputerMove = () => {
    const computerPieces = Array.from(document.querySelectorAll('.blackCircle'));
    let validMove = false;

    for (let piece of computerPieces) {
        draggedCircle = piece;
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);
        const eatingMoves = getEatingMoves(piece, row, col);

        // סינון מהלכי אכילה תקפים
        const validEatingMoves = eatingMoves.filter(move => {
            const targetCell = document.querySelector(
                `.cell[data-row="${move.row}"][data-col="${move.col}"]`
            );
            return targetCell && !targetCell.firstChild;
        });

        if (validEatingMoves.length > 0) {
            const move = validEatingMoves[Math.floor(Math.random() * validEatingMoves.length)];
            const targetCell = document.querySelector(
                `.cell[data-row="${move.row}"][data-col="${move.col}"]`
            );

            // חישוב התא האמצעי (החייל שנאכל)
            const middleRow = (row + move.row) / 2;
            const middleCol = (col + move.col) / 2;
            const middleCell = document.querySelector(
                `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
            );

            // עדכון ה-DOM: הזזת החייל
            targetCell.appendChild(piece);
            piece.dataset.row = move.row.toString();
            piece.dataset.col = move.col.toString();

            // עדכון המטריצה
            matrix[row][col] = 0; // התא הישן הופך לריק
            matrix[move.row][move.col] = 1; // המיקום החדש של חייל המחשב

            // הסרת החייל הנאכל מהמטריצה ומהלוח
            if (middleCell && middleCell.firstChild) {
                middleCell.removeChild(middleCell.firstChild);
                matrix[middleRow][middleCol] = 0; // התא הנאכל הופך לריק
            }

            updateCurrentPiecses();
            checkForKing(piece, move.row);

            if (!checkWinner()) {
                isPlayerTurn = true;
            }
            validMove = true;
            break;
        }
    }

    // אם אין מהלך אכילה, מבצע מהלך רגיל
    if (!validMove) {
        computerPieces.sort(() => Math.random() - 0.5);

        for (let piece of computerPieces) {
            draggedCircle = piece;
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            const validMoves = getValidMoves(piece, row, col);

            const possibleMoves = validMoves.filter(move => {
                const targetCell = document.querySelector(
                    `.cell[data-row="${move.row}"][data-col="${move.col}"]`
                );
                return targetCell && !targetCell.firstChild;
            });

            if (possibleMoves.length > 0) {
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const targetCell = document.querySelector(
                    `.cell[data-row="${move.row}"][data-col="${move.col}"]`
                );

                // עדכון ה-DOM: הזזת החייל
                targetCell.appendChild(piece);
                piece.dataset.row = move.row.toString();
                piece.dataset.col = move.col.toString();

                // עדכון המטריצה
                matrix[row][col] = 0; // התא הישן הופך לריק
                matrix[move.row][move.col] = 1; // המיקום החדש של חייל המחשב

                checkForKing(piece, move.row);

                validMove = true;
                break;
            }
        }
    }

    if (validMove) {
        if (!checkWinner()) {
            setTimeout(() => {
                isPlayerTurn = true;
            }, 1000);
        }
    }
};

const saveGameState = () => {
    const gameState = {
        matrix: matrix,
        isPlayerTurn: isPlayerTurn,
        gameTime: gameTime,
        playerEat: playerEat,
        computerPlayerEat: computerPlayerEat
    };

    localStorage.setItem(`gameState_${currentPlayer.name}`, JSON.stringify(gameState));
}

const loadGameState = () => {
    const savedState = localStorage.getItem(`gameState_${currentPlayer.name}`);

    if (savedState) {
        const gameState = JSON.parse(savedState);

        matrix = gameState.matrix;
        isPlayerTurn = gameState.isPlayerTurn;
        seconds = gameState.gameTime;
        playerEat = gameState.playerEat;
        computerPlayerEat = gameState.computerPlayerEat;
        board.innerHTML = '';

        createBoard();
        updateCurrentPiecses();
        return true;
    } 
    return false;
}


const clearSavedGame = () => {
    localStorage.removeItem(`gameState_${currentPlayer.name}`);
}

const urlParams = new URLSearchParams(window.location.search);
const shouldLoadGame = urlParams.get('load') === 'true';

if (shouldLoadGame) {
    if (!loadGameState()) {
        createBoard();
        updateCurrentPiecses();
    } 
} else {
    createBoard();
    updateCurrentPiecses();
}
timer();

// הוספת מאזין לשמירה אוטומטית בעזיבת הדף
window.addEventListener('beforeunload', () => {
    saveGameState();
});


// בודק אם יש מנצח במשחק ומעדכן את הסטטיסטיקות בהתאם
const checkWinner = () => {
    const blackPieces = document.querySelectorAll('.blackCircle');
    const whitePieces = document.querySelectorAll('.whiteCircle');
    let currentPlayerData = JSON.parse(localStorage.getItem("currentPlayer"));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(user => user.name === currentPlayerData.name);

    if (blackPieces.length === 0) {
        currentPlayerData.wins = (currentPlayerData.wins || 0) + 1;
        currentPlayerData.playTime = (currentPlayerData.playTime || 0) + gameTime;
        localStorage.setItem("currentPlayer", JSON.stringify(currentPlayerData));

        if (userIndex !== -1) {
            users[userIndex].wins = currentPlayerData.wins;
            users[userIndex].playTime = currentPlayerData.playTime;
            localStorage.setItem("users", JSON.stringify(users));
        }
        alert(`${currentPlayerData.name} wow!`);
        setTimeout(() => {
            window.location.href = "../project-folder/start.html";
        }, 2000);
        return true;
    }

    if (whitePieces.length === 0) {
        currentPlayerData.losses = (currentPlayerData.losses || 0) + 1;
        currentPlayerData.playTime = (currentPlayerData.playTime || 0) + gameTime;
        localStorage.setItem("currentPlayer", JSON.stringify(currentPlayerData));

        if (userIndex !== -1) {
            users[userIndex].losses = currentPlayerData.losses;
            users[userIndex].playTime = currentPlayerData.playTime;
            localStorage.setItem("users", JSON.stringify(users));
        }
        alert(`Computer Won! Won!`);
        setTimeout(() => {
            window.location.href = "../project-folder/start.html";
        }, 2000);
        return true;
    }
    return false;
}