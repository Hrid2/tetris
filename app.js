document.addEventListener('DOMContentLoaded', () => {
 const grid = document.querySelector('.grid')
 let squares = Array.from(document.querySelectorAll('.grid div'))
 const ScoreDisplay = document.querySelector('#score')
 const StartBtn = document.querySelector('#start-button')
 const leftBtn = document.querySelector('#left')
 const rightBtn = document.querySelector('#right')
 const rotateBtn = document.querySelector('#rotate')
 const width = 10
 let nextRandom = 0
 let timerId
 let score = 0

// The Tetrominos

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [width*2, width*2+1, width+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width*2+1, width+1, width+2],
    [0, width, width+1, width*2+1]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width+2, width*2+1],
    [1, width+1, width*2+1, width]
]

const oTetromino = [
    [1, width, width+1, 0],
    [1, width, width+1, 0],
    [1, width, width+1, 0],
    [1, width, width+1, 0]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width+0, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width+0, width+1, width+2, width+3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


let random = Math.floor(Math.random()*theTetrominoes.length)


let currentPosition = 4
let currentRotation = 0
let current = theTetrominoes[random][currentRotation]


function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tertromino')
    })
}

function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tertromino')
    })
}

function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freez()
}

// timerId = setInterval (moveDown,300)


function control(e){
    if(e.keyCode === 37){
        moveLeft()
    }else if(e.keyCode === 38){
        rotate()
    }else if(e.keyCode === 39){
        moveRight()
    }else if(e.keyCode === 40){
        moveDown()
    }
}

document.addEventListener('keydown', control)

function freez(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
        currentPosition += 1
    }

    draw()
}

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
        currentPosition -= 1
    }

    draw()
}



function rotate(){
    undraw()
    currentRotation++
    if(currentRotation === 4) currentRotation = 0
    current = theTetrominoes[random][currentRotation]
    draw()
}



const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 1

const nextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [1, displayWidth, displayWidth+1, 0],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
]

function displayShape(){
    displaySquares.forEach(squares => {
        squares.classList.remove('tertromino')
    })
    nextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tertromino')
    })

}

StartBtn.addEventListener('click', () => {
    if(timerId){
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 300)
        displayShape()
    }
})

function addScore(){
    for(let i =0; i < 199; i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
        if (row.every(index => squares[index].classList.contains('taken'))){
            score += 10
            ScoreDisplay.innerHTML = score
            row.forEach(index =>{ squares[index].classList.remove('taken')
            squares[index].classList.remove('tertromino')
            
        })
        const squareRemoved = squares.splice(i, width)
        squares = squareRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

function gameOver(){
    if(current.some(cell => squares[currentPosition + cell].classList.contains('taken'))){
        clearInterval(timerId)
    }
}

leftBtn.addEventListener('click', () => {
    moveLeft()
})
rightBtn.addEventListener('click', () => {
    moveRight()
})
rotateBtn.addEventListener('click', () => {
    rotate()
})
})