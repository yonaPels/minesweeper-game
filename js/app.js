'use strict'

const BOARD_WIDTH = 8
const BOARD_LENGTH = 8
const MINES_AMOUNT = 8
const MINE_IMG = '🎆'
const FLAG_IMG = '🚩'
const HAPPY_IMG = '😊'
const SADNESS_IMG = '😒'

const beginner = { length: 8, width: 8, minesAmount: 10 }
const intermediate = { length: 12, width: 12, minesAmount: 20 }
const expert = { length: 16, width: 16, minesAmount: 40 }

var gBoard
var gTimerIntervalId

const gGame = {
    isOn: false,
    lives: 3,
    markedCount: 0,
    shownCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = createBoard(BOARD_WIDTH, BOARD_LENGTH)
    // console.table(gBoard)
    // console.log(gBoard)
    renderBoard(gBoard, ".board")
}

function createBoard() {
    const board = createMat(BOARD_WIDTH, BOARD_LENGTH)
    return board
}


function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" onclick="onCellClicked(${i},${j})"
            oncontextmenu="onCellMarked(${i},${j});return false">`
            strHTML += `</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    // console.log('gBoard:', gBoard)
    elContainer.innerHTML = strHTML
}

function onCellClicked(ROW, COL) {
    if (!gGame.isOn) {
        gGame.isOn = true
        startTimer()
        setMines(ROW, COL)
        updateNegs()
    }
    const elCell = document.querySelector(`.cell-${ROW}-${COL}`)
    gBoard[ROW][COL].isShown = true
    elCell.classList.add("shown")
    gGame.shownCount++
    if (gBoard[ROW][COL].isShown && gBoard[ROW][COL].isMine) getMineExplotion(elCell)
    else if (gBoard[ROW][COL].minesAroundCount) elCell.innerText = gBoard[ROW][COL].minesAroundCount
    if (!gBoard[ROW][COL].isMine && gBoard[ROW][COL].minesAroundCount === 0) openAround(ROW, COL)
    checkVictory()
}

function openAround(ROW, COL) {
    for (var i = ROW - 1; i <= ROW + 1; i++) {
        if (i < 0 || i >= BOARD_WIDTH) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j >= BOARD_LENGTH || (i === ROW && j === COL)) continue
            if (!gBoard[i][j].isShown) onCellClicked(i, j)
        }
    }
}

function setMinesNegsCount(BOARD, ROW, COL) {
    var amount = 0
    for (var i = ROW - 1; i <= ROW + 1; i++) {
        if (i < 0 || i >= BOARD_WIDTH) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j >= BOARD_LENGTH || (i === ROW && j === COL)) continue
            if (BOARD[i][j].isMine) amount++
        }
    }
    return amount
}

function getMineExplotion(elCell) {
    elCell.innerText = `${MINE_IMG}`
    elCell.classList.add("explosion")
    gGame.lives--
    if (gGame.lives === 0) gameOver()

}

function gameOver() {
    clearInterval(gTimerIntervalId)
    console.log('game over')
    for (var i = 0; i < BOARD_WIDTH; i++) {
        for (var j = 0; j < BOARD_LENGTH; j++) {
            if (gBoard[i][j].isMine) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                setTimeout(() => {
                    elCell.innerText = `${MINE_IMG}`
                    elCell.classList.add("explosion")
                }, 700)
            }
        }
    }
}

function setMines(ROW, COL) {
    for (var i = 0; i < MINES_AMOUNT; i++) {
        const row = getRandomInt(0, BOARD_LENGTH)
        const col = getRandomInt(0, BOARD_WIDTH)
        if (row === ROW && col === COL) i--
        else if (gBoard[row][col].isMine === true) i--
        else gBoard[row][col].isMine = true
    }
}

function updateNegs() {
    for (var i = 0; i < BOARD_WIDTH; i++) {
        for (var j = 0; j < BOARD_LENGTH; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}

function onCellMarked(i, j) {
    gBoard[i][j].isMarked = true
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = FLAG_IMG
    gGame.markedCount++
    checkVictory()
}

function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === BOARD_WIDTH * BOARD_LENGTH) {
        console.log('victori')
        clearInterval(gTimerIntervalId)
    }
}

function startTimer() {
    var startTime = Date.now()
    const elTimer = document.querySelector('.timer')
    gTimerIntervalId = setInterval(() => {
        const diff = Date.now() - startTime
        elTimer.innerText = (diff / 1000).toFixed(3)
    }, 10)
}