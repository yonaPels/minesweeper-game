'use strict'


function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push(createCell(0, false, false, false))
        }
        mat.push(row)
    }
    return mat
}

function createCell(minesAroundCount, isShown, isMine, isMarked) {
    const cell = {
        minesAroundCount,
        isShown,
        isMine,
        isMarked
    }
    return cell
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function drawNum(nums) {
    return nums.splice(getRandomInt(0, nums.length), 1)[0]
}

function getRandomPos() {
    const emptyPos = getAllEmptyPos()
    const randomIdx = getRandomInt(0, emptyPos.length)
    const randomPos = emptyPos[randomIdx]
    return randomPos
}

function getAllEmptyPos() {
    const emptyPos = []
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 12; j++) {
            if (gBoard[i][j].gameElement === null && gBoard[i][j].type !== WALL) {
                emptyPos.push({ i, j })
            }
        }
    }
    return emptyPos
}

function playAudio(url) {
    var audio = new Audio(url)
    audio.play()
}


















/*******************************/
/*Matrix methods*/
/*******************************/


function getAmountOfNeighboursContaining(BOARD, ROW, COL, ITEM) {
    var amount = 0
    for (var i = ROW - 1; i <= ROW + 1; i++) {
        if (i < 0 || i > BOARD.length - 1) continue
        for (var j = COL - 1; j <= COL + 1; j++) {
            if (j < 0 || j > BOARD[i].length - 1 || (i === ROW && j === COL)) continue
            if (BOARD[i][j] === ITEM) amount++
        }
    }
    return amount
}

function getAmountOfCellsContaining(BOARD, ITEM) {
    var amount = 0
    for (var i = 0; i < BOARD.length; i++) {
        for (var j = 0; j < BOARD[i].length; j++) {
            if (BOARD[i][j] === ITEM) amount++
        }
    }
    return amount
}

/*******************************/
/*Random*/
/*******************************/


function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getRandomOrderNumbersArray(MAX) {
    const nums = getArrayWithAscNums(MAX)
    var res = []
    for (var i = 0; i < MAX; i++) {
        res[i] = drawNum(nums)
    }
    return res
}

function getArrayWithAscNums(max) {
    var numbers = []
    for (var i = 0; i < max; i++) {
        numbers[i] = i + 1
    }
    return numbers
}

/*******************************/
/*Misc*/
/*******************************/

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
            const className = `cell cell-${i}-${j} floor`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

