'use strict'


const MINE_IMG = '🎆'
const FLAG_IMG = '🚩'
const HAPPY_IMG = '😊'
const SADNESS_IMG = '😒'
const NORMAL_IMG = '🫡'

var gBoardSize = 8
var gMinesAmount = 14
var gBoard
var gGame
var gTimerIntervalId

function onInit() {
    renderSmily(NORMAL_IMG)
    gGame = createGame()
    gBoard = createBoard(gBoardSize)
    renderBoard(gBoard, ".board")
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
    elContainer.innerHTML = strHTML
}

function onCellClicked(ROW, COL) {
    if (!gGame.isOn) {
        gGame.isOn = true
        startTimer()
        setMinesCount(ROW, COL)
        updateNegs()
    }
    if (gBoard[ROW][COL].isMarked || gBoard[ROW][COL].isShown) return
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
        if (i < 0 || i >= gBoardSize) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j >= gBoardSize || (i === ROW && j === COL)) continue
            if (!gBoard[i][j].isShown) onCellClicked(i, j)
        }
    }
}

function setMinesNegsCount(BOARD, ROW, COL) {
    var amount = 0
    for (var i = ROW - 1; i <= ROW + 1; i++) {
        if (i < 0 || i >= gBoardSize) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j >= gBoardSize || (i === ROW && j === COL)) continue
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
    renderSmily(SADNESS_IMG)
    console.log('game over')
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
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

function setMinesCount(ROW, COL) {
    for (var i = 0; i < gMinesAmount; i++) {
        const row = getRandomInt(0, gBoardSize)
        const col = getRandomInt(0, gBoardSize)
        if (row === ROW && col === COL) i--
        else if (gBoard[row][col].isMine === true) i--
        else gBoard[row][col].isMine = true
    }
}

function updateNegs() {
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}

function onCellMarked(i, j) {
    if (!gTimerIntervalId) startTimer()
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = (gBoard[i][j].isMarked) ? FLAG_IMG : ""
    if (gBoard[i][j].isMarked && gBoard[i][j].isMine) gGame.markedCount++
    if (!gBoard[i][j].isMarked && gBoard[i][j].isMine) gGame.markedCount--
    checkVictory()
}

function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === gBoardSize * gBoardSize) {
        console.log('victori')
        clearInterval(gTimerIntervalId)
        renderSmily(HAPPY_IMG)
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

function renderSmily(smily) {
    const elSmily = document.querySelector(".smily")
    elSmily.innerText = smily
}

function onRestart() {
    clearInterval(gTimerIntervalId)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = "0.000"
    onInit()
}

function createGame() {
    return {
        isOn: false,
        lives: 3,
        markedCount: 0,
        shownCount: 0,
        secsPassed: 0
    }
}

function createBoard() {
    const board = createMat(gBoardSize, gBoardSize)
    return board
}

function onStartlevel1() {
    console.log('test')
    gBoardSize = 4
    gMinesAmount = 2
    onInit()
}

function onStartlevel2() {
    gBoardSize = 8
    gMinesAmount = 14
    onInit()
}
function onStartlevel3() {
    gBoardSize = 12
    gMinesAmount = 32
    onInit()
}
