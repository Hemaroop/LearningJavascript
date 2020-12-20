const p1Text = 'X';
const p2Text = 'O';

const p1TurnText = 'Player 1 Turn!';
const p2TurnText = 'Player 2 Turn!';

const p1WinsText = 'X has won!';
const p2WinsText = 'O has won!';
const noOneWinsText = 'Cats game!';

const occupiedCellClass = 'occupiedCell';
const p1AdditionalClass = 'redFont'

let validGameClick = 0;
let gameOver = 0;

let gameStatus;
let p1MovesList = [];
let p2MovesList = [];

const checkForThreeInLine = (playerMovesList) => {
    //Uncomment to test
    //console.log(playerMovesList);
    //return 0;

    //Complete logic to see if a player has won
    let nOfMoves = playerMovesList.length;
    let i, j, k;
    let x1, x2, x3, rowDiff1, rowDiff2;
    let y1, y2, y3, colDiff1, colDiff2;

    k = nOfMoves-1;
    x3 = playerMovesList[k].x;
    y3 = playerMovesList[k].y;

    for (i = 0; i < nOfMoves-2; i++) {
        x1 = playerMovesList[i].x;
        y1 = playerMovesList[i].y;
        for (j = i+1; j < nOfMoves-1; j++) {
            x2 = playerMovesList[j].x;
            y2 = playerMovesList[j].y;

            rowDiff1 = x2-x1;
            rowDiff2 = x3-x1;
            colDiff1 = y2-y1;
            colDiff2 = y3-y1;

            //console.log(`${rowDiff1} ${rowDiff2} ${colDiff1} ${colDiff2}`);

            if ((rowDiff1 === 0 && rowDiff2 === 0) || (colDiff1 === 0 && colDiff2 === 0) || 
            ((rowDiff1 * colDiff2 === colDiff1 * rowDiff2) && (rowDiff1 * colDiff2 !== 0))) {
                return 1;
            }
        }
    }
    return 0;
}

const checkWin = () => {
    if (validGameClick % 2 == 1) {
        gameOver = checkForThreeInLine(p1MovesList);
    }
    else {
        gameOver = checkForThreeInLine(p2MovesList) * 2;
    }
    if (gameOver === 0  && validGameClick === 9) {
        gameOver = 3;
    }
};

const resetCountersAndStates = () => {
    validGameClick = gameOver = 0;
}

const changeGameStatus = () => {
    if (validGameClick >= 5) {
        checkWin();
    }
    if (gameOver === 0) {
        if (validGameClick > 0) {
            if (validGameClick % 2 === 1) {
                gameStatus.innerText = p2TurnText;
            }
            else{
                gameStatus.innerText = p1TurnText;
            }
        }
    }
    else {
        switch (gameOver){
            case 1:
                gameStatus.innerText = p1WinsText;
                break;
            case 2:
                gameStatus.innerText = p2WinsText;
                break;
            default:
                gameStatus.innerText = noOneWinsText;
        }
        setTimeout(() => {
            gameStatus.innerText = "Resetting...";
            resetCountersAndStates();
            document.location.reload(true);
        }, 3000);
    }
}

const processClickEvent = (event) => {
    const gameTableElements = document.querySelectorAll("td");
    if (!gameOver)
    {
        let clickedCell = {};
        for (var mem of gameTableElements) {
            if (mem.contains(event.target)) {
                let memOccupied = false;

                // Set clickedCell's row and column 
                switch (mem.parentElement.className) {
                    case "row1":
                        clickedCell.x = 1;
                        break;
                    case "row2":
                            clickedCell.x = 2;
                            break;
                    case "row3":
                            clickedCell.x = 3;
                            break;
                }

                for (var memClass of mem.classList) {
                    if (memClass === occupiedCellClass) {
                        memOccupied = true;
                        break;
                    }
                    switch (memClass) {
                        case "col1":
                            clickedCell.y = 1;
                            break;
                        case "col2":
                            clickedCell.y = 2;
                            break;
                        case "col3":
                            clickedCell.y = 3;
                            break;
                        default:
                            break;
                    }
                }

                if (!memOccupied) {
                    validGameClick += 1;
                    mem.classList.add(occupiedCellClass);
                    if (validGameClick % 2 === 1){
                        mem.innerText = p1Text;
                        mem.classList.add(p1AdditionalClass);
                        p1MovesList.push(clickedCell);
                    }
                    else {
                        mem.innerText = p2Text;
                        p2MovesList.push(clickedCell);
                    }
                    changeGameStatus();
                }

                break;
            }
        }
    }
};

window.onload = () => {
    gameStatus = document.getElementById("gameStatus");
    setTimeout(() => {
        gameStatus.innerText = p1TurnText;
        document.addEventListener("click", processClickEvent);
    }, 3000);
};
