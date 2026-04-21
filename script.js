
// Prevent developer tools and right-click inspection
document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
})

document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
        e.preventDefault()
    }
    // Ctrl+Shift+I (Windows/Linux Inspector)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
    }
    // Ctrl+Shift+C (Windows/Linux Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
    }
    // Ctrl+Shift+J (Windows/Linux Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
    }
    // Cmd+Option+I (Mac Inspector)
    if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault()
    }
    // Cmd+Option+U (Mac View Source)
    if (e.metaKey && e.altKey && e.key === 'u') {
        e.preventDefault()
    }
})

// Password validation with OTP
const CORRECT_PASSWORD = '1763'
const otpInputs = document.querySelectorAll('.otp-input')
const passwordScreen = document.getElementById('passwordScreen')
const gameContent = document.getElementById('gameContent')
const passwordError = document.getElementById('passwordError')
const passwordButton = document.getElementById('passwordButton')

otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '')

        // Move to next input if value is entered
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus()
        }
    })

    input.addEventListener('keydown', (e) => {
        // Handle backspace to move to previous input
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            otpInputs[index - 1].focus()
        }
        // Allow Enter to submit
        if (e.key === 'Enter') {
            checkOTP()
        }
    })

    input.addEventListener('keypress', (e) => {
        // Only allow numbers
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault()
        }
    })
})

passwordButton.addEventListener('click', checkOTP)

function checkOTP() {
    const otp = Array.from(otpInputs).map(input => input.value).join('')

    if (otp.length < 4) {
        // Show incomplete message
        passwordError.style.display = 'block'
        setTimeout(() => {
            passwordError.style.display = 'none'
        }, 1500)
        return
    }

    if (otp === CORRECT_PASSWORD) {
        passwordScreen.classList.add('hidden')
        setTimeout(() => {
            gameContent.classList.remove('quiz-hidden')
            gameContent.classList.add('fade-in')
        }, 100)
        initGame()
    } else {
        showPasswordError()
    }
}

function showPasswordError() {
    // Add error class to all inputs for red border and shake
    otpInputs.forEach(input => {
        input.classList.add('error')
    })
    // Remove error class after animation completes
    setTimeout(() => {
        otpInputs.forEach(input => {
            input.classList.remove('error')
            input.value = ''
        })
        otpInputs[0].focus()
    }, 500)
}

// Focus first input on load
otpInputs[0].focus()

// Memory Game Variables
const CODE = [5, 9, 0, 4]
const ALL_IMAGES = [
    './photos/BMW.png',
    './photos/beach.png',
    './photos/clurb.png',
    './photos/cuddle.png',
    './photos/engagement.png',
    './photos/flowers.png',
    './photos/kiss-restaurant.png',
    './photos/kiss.png',
    './photos/marathon.png',
    './photos/mirror.png',
    './photos/steps.png',
    './photos/thailand.png'
]

let IMAGES = []

// Function to randomly select 5 images from all available images
function selectRandomImages() {
    const shuffled = [...ALL_IMAGES].sort(() => Math.random() - 0.5)
    IMAGES = shuffled.slice(0, 5)
}

let currentRound = 1
let flippedCards = []
let matchedPairs = 0
let canFlip = true
let cards = []

// Initialize game
function initGame() {
    setupRound()
}

// Create card elements
function createCards() {
    const gameGrid = document.getElementById('gameGrid')
    gameGrid.innerHTML = ''

    // Create pairs
    const cardImages = [...IMAGES, ...IMAGES]
    // Shuffle cards
    cardImages.sort(() => Math.random() - 0.5)

    cardImages.forEach((image, index) => {
        const card = document.createElement('div')
        card.classList.add('memory-card')
        card.dataset.image = image
        card.dataset.index = index

        card.innerHTML = `
            <div class="card-face card-back">
                <img src="./photos/polaroid-back.png" alt="Back">
            </div>
            <div class="card-face card-front">
                <img src="${image}" alt="Card">
            </div>
        `

        card.addEventListener('click', () => flipCard(card))
        gameGrid.appendChild(card)
    })

    cards = Array.from(document.querySelectorAll('.memory-card'))
}

// Flip a card
function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return
    }

    if (flippedCards.length < 2) {
        card.classList.add('flipped')
        flippedCards.push(card)

        if (flippedCards.length === 2) {
            canFlip = false
            checkMatch()
        }
    }
}

// Check if flipped cards match
function checkMatch() {
    const card1 = flippedCards[0]
    const card2 = flippedCards[1]

    const match = card1.dataset.image === card2.dataset.image

    if (match) {
        setTimeout(() => {
            card1.classList.add('matched')
            card2.classList.add('matched')
            matchedPairs++
            resetFlipped()

            if (matchedPairs === 5) {
                endRound()
            }
        }, 500)
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped')
            card2.classList.remove('flipped')
            resetFlipped()
        }, 800)
    }
}

// Reset flipped cards array
function resetFlipped() {
    flippedCards = []
    canFlip = true
}

// End current round
function endRound() {
    revealDigit(currentRound - 1)
    const nextBtn = document.getElementById('nextRoundBtn')
    nextBtn.style.display = 'block'
    if (currentRound === 4) {
        nextBtn.textContent = 'Reveal Code'
    }
}

// Reveal digit based on round
function revealDigit(digitIndex) {
    const digitElement = document.getElementById(`digit${digitIndex + 1}`)
    if (digitElement && !digitElement.classList.contains('revealed')) {
        digitElement.textContent = CODE[digitIndex]
        digitElement.classList.add('revealed')
        digitElement.style.visibility = 'visible'
        fillCircles(digitIndex)
    }
}

// Fill circles for the revealed digit
function fillCircles(digitIndex) {
    const startCircle = digitIndex * 3 + 1
    for (let i = 0; i < 3; i++) {
        const circle = document.getElementById(`circle${startCircle + i}`)
        if (circle) {
            const fillDiv = circle.querySelector('.c-fill')
            const iconDiv = circle.querySelector('.c-icon')
            const dotDiv = circle.querySelector('.c-dot')

            if (fillDiv && !fillDiv.classList.contains('active')) {
                fillDiv.classList.add('active')
                if (iconDiv) {
                    iconDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`
                }
                if (dotDiv) dotDiv.style.display = 'none'
            }
        }
    }
}

// Setup new round
function setupRound() {
    selectRandomImages()
    matchedPairs = 0
    flippedCards = []
    canFlip = true
    document.getElementById('nextRoundBtn').style.display = 'none'
    document.getElementById('nextRoundBtn').textContent = 'Next Round'

    const roundCounter = document.getElementById('roundCounter')
    roundCounter.textContent = `Round ${currentRound}/4`

    createCards()
}

// Move to next round
document.getElementById('nextRoundBtn').addEventListener('click', () => {
    if (currentRound < 4) {
        currentRound++
        setupRound()
    } else {
        // Game complete - show code animation
        triggerGameComplete()
    }
})

// Trigger final game complete animation
function triggerGameComplete() {
    const gameGrid = document.getElementById('gameGrid')
    const codeArea = document.getElementById('codeArea')
    const roundCounter = document.getElementById('roundCounter')
    const heading = document.querySelector('h1')
    const nextBtn = document.getElementById('nextRoundBtn')

    gameGrid.style.display = 'none'
    roundCounter.style.display = 'none'
    nextBtn.style.display = 'none'

    codeArea.style.display = 'flex'
    codeArea.classList.add('quiz-complete')

    const digitGroups = document.querySelectorAll('#codeArea .code-digit-group')
    const circleRows = document.querySelectorAll('#codeArea .circle-row')
    const digitLines = document.querySelectorAll('#codeArea .digit-line')

    digitGroups.forEach(group => group.classList.add('centered'))
    circleRows.forEach(row => row.classList.add('quiz-complete'))
    digitLines.forEach(line => line.classList.add('quiz-complete'))
    if (heading) heading.classList.add('quiz-complete')
}

// Set initial digit values and hide them
document.getElementById('digit1').textContent = CODE[0]
document.getElementById('digit2').textContent = CODE[1]
document.getElementById('digit3').textContent = CODE[2]
document.getElementById('digit4').textContent = CODE[3]

document.getElementById('digit1').style.visibility = 'hidden'
document.getElementById('digit2').style.visibility = 'hidden'
document.getElementById('digit3').style.visibility = 'hidden'
document.getElementById('digit4').style.visibility = 'hidden'