const grid = document.querySelector("#grid");
const resetButton = document.querySelector('button#reset');
const flagButton = document.querySelector('button#flag-mode');
const turnsDisplay = document.querySelector('h2#turns');
const bombsLeftDisplay = document.querySelector('h2#bombs-left');

flagButton.disabled = true

const faces = {
    happy: '( •_•)',
    sad: '(T_T)',
    veryHappy: '(¬‿¬)>⌐■-■'
}



const bombIcon = '💣';
const destroyedIcon = '💥';
const gridWidth = 32;
const gridHeight = 16;
let numMines = 40;
const flagIcon = '🚩';


let flagModeStatus = false;
let mines = [];
let cells = [];
let seenCells = [];
let turns = 0;
let gameState = '';

// setup reset buttion
resetButton.onclick = () => {
    flagModeStatus = false;
    flagButton.disabled = true;
    turns = 0;
    gameState = '';
    mines = [];
    seenCells = [];
    for (let cell of cells) {
        cell.innerHTML = '';
        cell.classList.remove(
            'empty',
            'has-1-bombs',
            'has-2-bombs',
            'has-3-bombs',
            'has-4-bombs',
            'has-5-bombs',
            'has-6-bombs',
            'has-7-bombs',
            'has-8-bombs',
        );
    }
    updateDisplay();
}

// flags mode
flagButton.onclick = () => {
    flagModeStatus = !flagModeStatus;
    flaglimet =- 1 
    if(flaglimet === 0){
        const flagend = true
    }
    updateDisplay();
};

//creates grid
for (let i = 0; i < gridHeight; i++) {
    const row = document.createElement("div")
    row.className = "row"
    for (let j = 0; j < gridWidth; j++) {
        const rowCell = document.createElement("div");
        rowCell.x = j;
        rowCell.y = i;
        cells.push(rowCell)
        rowCell.className = "cell";
        // on clisk  for squares
        rowCell.onmouseup = () => {
            if (gameState != '') {
                return
            }
            
            if(flagModeStatus && !isSeen(j, i)){
        
                rowCell.innerHTML = flagIcon;
                const removedMine = removeMine(j, i)
                if(!removedMine){
                    gameState = 'lose'
                }
 
                if (mines.length === 0){
                    gameState = 'win'
                    
                }
                updateDisplay();
                return 

            }
            
            flagButton.disabled = false

            let empty = true;
            if (mines.length === 0) {
                mines = createMines(numMines)
            } else {
                if (!isEmpty(j, i)) {
                    empty = false
                }
            }

            if (empty) {
                showCell(j, i);
                turns += 1;
                //win Check
                if (gridWidth * gridHeight - numMines == seenCells.length) {
                    gameState = 'win';
                } 
            } else {
                gameState = 'lose'
                showBombs()
                for (let cell of cells) {
                    if (cell.x == j && cell.y == i) {
                        cell.innerHTML = destroyedIcon
                    }
                }
            }
            updateDisplay();
        }
        row.appendChild(rowCell);
    }
    grid.appendChild(row);
}

const showCell = (x, y) => {
    if (isSeen(x, y)) {
        return
    }

    let el = getCellElement(x, y)
    el.classList.add("empty")

    seenCells.push({
        x,
        y
    });

    let bombs = 0;
    for (let xx = -1; xx < 2; xx++) {
        for (let yy = -1; yy < 2; yy++) {
            if (xx == 0 && yy == 0) {
                continue
            }
            if (!isEmpty(x + xx, y + yy)) {
                bombs += 1;
            }
        }
    }

    if (bombs > 0) {
        el.innerHTML = bombs
        el.classList.add(`has-${bombs}-bombs`);
    } else {
        for (let xx = -1; xx < 2; xx++) {
            for (let yy = -1; yy < 2; yy++) {
                if (xx == 0 && yy == 0) {
                    continue
                }
                if ((x + xx) < 0 || (x + xx) >= gridWidth || (y + yy) < 0 || (y + yy) >= gridHeight) {
                    continue
                }
                showCell(x + xx, y + yy);
            }
        }
    }
}

const showBombs = () => {
    for (let mine of mines) {
        for (let cell of cells) {
            if (cell.x == mine.x && cell.y == mine.y) {
                cell.innerHTML = bombIcon
            }
        }
    }
}

const isSeen = (x, y) => {
    for (let c of seenCells) {
        if (c.x === x && c.y === y) {
            return true

        }
    }
    return false
}

const isEmpty = (x, y) => {
    for (let m of mines) {
        if (m.x === x && m.y === y) {
            return false
        }
    }
    return true
}
const removeMine = (x, y) =>{
    if(flaglimet === 0){
        return false
    } 
    for (let m of mines) {
        if (m.x === x && m.y === y) {
            const mineIndex = mines.indexOf(m)
            mines.splice(mineIndex, 1)
            return true;
        }            
    }
    return false
}

const createMines = (numMines) => {
    let mines = [];
    while (mines.length < numMines) {
        const pos = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight),
        }
        let empty = true;
        for (let i = 0; i < mines.length; i++) {
            const mine = mines[i];
            if (mine.x === pos.x && mine.y === pos.y) {
                empty = false
            }
        }
        if (empty) {
            mines.push(pos);
        }
    }
    return mines;
}
const getCellElement = (x, y) => {
    for (let el of cells) {
        if (el.x == x && el.y == y) {
            return el;
        }
    }
}


const updateDisplay = () => {
    turnsDisplay.innerHTML = turns.toString().padStart(3, '0')
    let minesDisplay;
     if (mines.length > 0) {
        minesDisplay = mines.length;
     } else {
        minesDisplay = numMines;
     }
     bombsLeftDisplay.innerHTML = minesDisplay.toString().padStart(3, '0')
    let faceString;
    document.body.classList.remove('lose')
    switch (gameState) {
    case '':
        faceString = faces.happy;
        break;
    case 'win':
        faceString = faces.veryHappy;
        break;
    case 'lose':
        faceString = faces.sad;
        document.body.classList.add('lose')
        break;
    }
    resetButton.innerHTML = faceString;
    
    if(flagModeStatus){
        flagButton.innerHTML = "NORMAL-MODE"
    }else{
        flagButton.innerHTML = "FLAG-MODE"
    }
}

updateDisplay();
