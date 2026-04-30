const instructionScreen = document.getElementById('instructionScreen')
const startGameButton = document.getElementById('startGameButton')
// ========== SECURITY ========== 
// Prevent developer tools and right - click inspection
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
const CORRECT_PASSWORD = '7438'
const otpInputs = document.querySelectorAll('.otp-input')
const passwordScreen = document.getElementById('passwordScreen')
const quizContent = document.getElementById('quizContent')
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
        passwordError.style.display = 'block'
        setTimeout(() => {
            passwordError.style.display = 'none'
        }, 1500)
        return
    }

    if (otp === CORRECT_PASSWORD) {
        // Hide password and show instructions instead of the game
        passwordScreen.classList.add('hidden')
        instructionScreen.classList.remove('hidden')
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

startGameButton.addEventListener('click', () => {
    instructionScreen.classList.add('hidden')
    setTimeout(() => {
        quizContent.classList.remove('quiz-hidden')
        quizContent.classList.add('fade-in')
        // Ensure stage 1 is ready
        initializeStage(1)
    }, 100)
})

// Focus first input on load
otpInputs[0].focus()

// ========== GAME STATE & CONFIGURATION ========== 

const code = [5, 9, 0, 4]

// Stage configuration: [totalCards, numAiCards]
const stageConfig = {
    1: { totalCards: 3, aiCards: 2 },
    2: { totalCards: 4, aiCards: 2 },
    3: { totalCards: 5, aiCards: 2 },
    4: { totalCards: 6, aiCards: 2 }
}

// Image pools - all available images
const aiImages = [
    './photos/cards/ai/BMW.png',
    './photos/cards/ai/beach.png',
    './photos/cards/ai/clurb.png',
    './photos/cards/ai/cuddle.png',
    './photos/cards/ai/engagement.png',
    './photos/cards/ai/flowers.png',
    './photos/cards/ai/kiss-restaurant.png',
    './photos/cards/ai/kiss.png',
    './photos/cards/ai/marathon.png',
    './photos/cards/ai/mirror.png',
    './photos/cards/ai/steps.png',
    './photos/cards/ai/thailand.png'
]

const realImages = [
    './photos/cards/real/BMW.png',
    './photos/cards/real/car-selfie.png',
    './photos/cards/real/club.png',
    './photos/cards/real/flowers.png',
    './photos/cards/real/lunch.png',
    './photos/cards/real/marathon.png',
    './photos/cards/real/mirror.png',
    './photos/cards/real/paddle.png',
    './photos/cards/real/selfie.png',
    './photos/cards/real/steps.png',
    './photos/cards/real/tennis.png',
    './photos/cards/real/thailand.png'
]

// Game state
let gameState = {
    currentStage: 1,
    selectedCards: [],
    currentCards: [],
    aiCardIndices: [],
    isProcessing: false,
    correctSelections: 0
}

// Store stage configurations so they remain consistent during a playthrough
let stageConfigs = {
    1: null,
    2: null,
    3: null,
    4: null
}

// DOM elements
const cardGrid = document.getElementById('cardGrid')
const stageNumber = document.getElementById('stageNumber')
const hint = document.getElementById('hint')
const digit1 = document.getElementById('digit1')
const digit2 = document.getElementById('digit2')
const digit3 = document.getElementById('digit3')
const digit4 = document.getElementById('digit4')

// Initialize digit visibility
digit1.style.visibility = 'hidden'
digit2.style.visibility = 'hidden'
digit3.style.visibility = 'hidden'
digit4.style.visibility = 'hidden'

digit1.textContent = code[0]
digit2.textContent = code[1]
digit3.textContent = code[2]
digit4.textContent = code[3]

// ========== UTILITY FUNCTIONS ========== 

function shuffleArray(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

function getRandomSubset(array, count) {
    const shuffled = shuffleArray(array)
    return shuffled.slice(0, count)
}

// ========== STAGE SETUP ========== 

function initializeStage(stageNum) {
    const config = stageConfig[stageNum]

    // Check if this stage has already been configured in this playthrough
    if (stageConfigs[stageNum] === null) {
        // First time entering this stage - generate and store the configuration
        const selectedAi = getRandomSubset(aiImages, config.aiCards)
        const selectedReal = getRandomSubset(realImages, config.totalCards - config.aiCards)

        const cards = [
            ...selectedAi.map(img => ({ src: img, isAi: true })),
            ...selectedReal.map(img => ({ src: img, isAi: false }))
        ]

        // Shuffle to randomize positions for this stage
        let shuffled = shuffleArray(cards)

        // For stage 4, move AI cards up one position in the grid (3x2 grid)
        if (stageNum === 4) {
            // Find AI card indices
            const aiIndices = shuffled
                .map((card, idx) => card.isAi ? idx : -1)
                .filter(idx => idx !== -1)

            // Move each AI index up by 3 (from bottom row to top row)
            // If in bottom row (3-5), move to top row (0-2)
            aiIndices.forEach(aiIdx => {
                if (aiIdx >= 3) {
                    const newIdx = aiIdx - 3
                    // Swap the AI card with the card at the new position
                    const temp = shuffled[aiIdx]
                    shuffled[aiIdx] = shuffled[newIdx]
                    shuffled[newIdx] = temp
                }
            })
        }

        stageConfigs[stageNum] = shuffled
    }

    // Use the stored configuration for this stage
    gameState.currentCards = stageConfigs[stageNum]

    // Track which card indices are AI
    gameState.aiCardIndices = gameState.currentCards
        .map((card, idx) => card.isAi ? idx : -1)
        .filter(idx => idx !== -1)

    gameState.selectedCards = []
    gameState.correctSelections = 0
    gameState.isProcessing = false

    // Update stage indicator
    stageNumber.textContent = stageNum

    renderCards()
}

// ========== CARD RENDERING ========== 

function renderCards() {
    cardGrid.innerHTML = ''

    gameState.currentCards.forEach((card, index) => {
        const cardEl = document.createElement('div')
        cardEl.className = 'card'
        cardEl.dataset.index = index

        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <img src="./photos/cards/polaroid-back.png" alt="Card back">
                </div>
                <div class="card-face card-front">
                    <img src="${card.src}" alt="Card image">
                </div>
            </div>
        `

        cardEl.addEventListener('click', () => handleCardClick(index, cardEl))
        cardGrid.appendChild(cardEl)
    })
}

// ========== CARD INTERACTION ========== 

function handleCardClick(index, cardEl) {
    if (gameState.isProcessing) return
    if (gameState.selectedCards.includes(index)) return

    gameState.isProcessing = true

    // Flip card
    cardEl.classList.add('flipped')

    setTimeout(() => {
        const card = gameState.currentCards[index]

        if (card.isAi) {
            // Correct selection
            gameState.selectedCards.push(index)
            gameState.correctSelections++
            cardEl.classList.add('correct')
            hint.classList.remove('show')

            // Check if stage complete
            if (gameState.correctSelections === stageConfig[gameState.currentStage].aiCards) {
                advanceStage()
            } else {
                gameState.isProcessing = false
            }
        } else {
            // Wrong selection - reset to stage 1
            cardEl.classList.add('wrong')
            hint.classList.add('show')

            setTimeout(() => {
                resetGame()
            }, 600)
        }
    }, 300)
}

// ========== STAGE PROGRESSION ========== 

function advanceStage() {
    const currentStage = gameState.currentStage

    // Reveal digit for this stage
    const digitMap = { 1: digit1, 2: digit2, 3: digit3, 4: digit4 }
    revealDigit(digitMap[currentStage])

    setTimeout(() => {
        if (currentStage === 4) {
            triggerGameComplete()
        } else {
            gameState.currentStage++
            initializeStage(gameState.currentStage)
            gameState.isProcessing = false
        }
    }, 2000)
}

function resetGame() {
    gameState.currentStage = 1
    initializeStage(gameState.currentStage)
}

// ========== CODE REVEAL ========== 

function revealDigit(digitElement) {
    if (digitElement.classList.contains('revealed')) return
    digitElement.classList.add('revealed')
    digitElement.style.visibility = 'visible'
}

// ========== GAME COMPLETION ========== 

function triggerGameComplete() {
    const imgContainer = cardGrid
    const codeArea = document.getElementById('codeArea')
    const stageIndicator = document.getElementById('stageIndicator') // Add this
    const digitGroups = document.querySelectorAll('.code-digit-group')
    const heading = document.querySelector('h1')

    cardGrid.classList.add('quiz-complete')
    codeArea.classList.add('quiz-complete')
    hint.classList.add('quiz-complete')

    if (stageIndicator) stageIndicator.classList.add('quiz-complete') // Add this

    digitGroups.forEach(group => group.classList.add('centered'))
    if (heading) heading.classList.add('quiz-complete')

    // Optional: Force removal after animation to be 100% sure
    setTimeout(() => {
        cardGrid.style.display = 'none'
        if (stageIndicator) stageIndicator.style.display = 'none'
    }, 700)
}

// ========== INITIALIZE GAME ========== 
// initializeStage(1)