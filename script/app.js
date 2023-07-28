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
    if (gGame.hintMode) return getHint(ROW, COL)
    if (gBoard[ROW][COL].isMarked || gBoard[ROW][COL].isShown) return
    const elCell = document.querySelector(`.cell-${ROW}-${COL}`)
    gBoard[ROW][COL].isShown = true
    playAudio("sound/open.mp3")
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
    playAudio("sound/explotion.mp3")
    elCell.innerText = `${MINE_IMG}`
    elCell.classList.add("explotion")
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
                    playAudio("sound/explotion.mp3")
                }, 700 + i * 300 + j * 100)
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
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true
    if (gBoard[i][j].isMarked) playAudio("sound/flag.mp3")
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = (gBoard[i][j].isMarked) ? FLAG_IMG : ""
    if (gBoard[i][j].isMarked && gBoard[i][j].isMine) gGame.markedCount++
    if (!gBoard[i][j].isMarked && gBoard[i][j].isMine) gGame.markedCount--
    checkVictory()
}

function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === gBoardSize * gBoardSize) {
        playAudio("sound/victory.mp3")
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
        countHints: 3,
        hintMode: false,
        safeClicks: 3
    }
}

function createBoard() {
    const board = createMat(gBoardSize, gBoardSize)
    return board
}

function onStartlevel1() {
    playAudio("sound/start.mp3")
    gBoardSize = 4
    gMinesAmount = 2
    onInit()
}

function onStartlevel2() {
    playAudio("sound/start.mp3")
    gBoardSize = 8
    gMinesAmount = 14
    onInit()
}
function onStartlevel3() {
    playAudio("sound/start.mp3")
    gBoardSize = 12
    gMinesAmount = 32
    onInit()
}

function onGetHint() {
    if (!gGame.countHints) return
    gGame.hintMode = true
    const elHints = document.querySelector(".hint")
    elHints.style.backgroundColor = "red"
}

function getHint(ROW, COL) {
    var toClose = []
    for (var i = ROW - 1; i <= ROW + 1; i++) {
        if (i < 0 || i >= gBoardSize) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j >= gBoardSize) continue
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            if (gBoard[i][j].isShown) continue
            elCell.classList.add("shown")
            if (gBoard[i][j].minesAroundCount) elCell.innerText = gBoard[i][j].minesAroundCount
            if (gBoard[i][j].isMine) elCell.innerText = `${MINE_IMG}`
            toClose.push({ i, j })
        }
    }
    setTimeout(() => {
        for (var idx = 0; idx < toClose.length; idx++) {
            const elCell = document.querySelector(`.cell-${toClose[idx].i}-${toClose[idx].j}`)
            elCell.classList.remove("shown")
            elCell.innerText = ''
        }
        const elHints = document.querySelector(".hint")
        elHints.style.backgroundColor = "aliceblue"
        gGame.hintMode = false
    }, 1000)
    gGame.countHints--
}

function onSafeClick() {
    if (!gGame.safeClicks) return
    gGame.safeClicks--
    const safeCelles = []
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            const pos = { i, j }
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) safeCelles.push(pos)
        }
    }
    const randomIdx = getRandomInt(0, safeCelles.length)
    const pos = safeCelles[randomIdx]
    const elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    elCell.classList.add("safecell")
    const elBtn = document.querySelector(".safeclick")
    elBtn.style.backgroundColor = "hsl(182, 79%, 21%)"
    setTimeout(() => {
        elCell.classList.remove("safecell")
        elBtn.style.backgroundColor = "aliceblue"
    }, 5000)
    const strHTML = `${gGame.safeClicks} SAFE CLICKS`
    elBtn.innerText = strHTML
}
