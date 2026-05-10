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
        // Allocate AI images for all stages (no repeats)
        allocateAiImagesForGame()
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
    3: { totalCards: 5, aiCards: 3 },
    4: { totalCards: 6, aiCards: 4 }
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
    isProcessing: false
}

// Store stage configurations so they remain consistent during a playthrough
let stageConfigs = {
    1: null,
    2: null,
    3: null,
    4: null
}

// Store pre-allocated AI images for each stage (no repeats across stages)
let allocatedAiImages = {
    1: [],
    2: [],
    3: [],
    4: []
}

// DOM elements
const cardGrid = document.getElementById('cardGrid')
const stageNumber = document.getElementById('stageNumber')
const hint = document.getElementById('hint')
const digit1 = document.getElementById('digit1')
const digit2 = document.getElementById('digit2')
const digit3 = document.getElementById('digit3')
const digit4 = document.getElementById('digit4')
const timerElement = document.getElementById('timer')
const timerValue = document.getElementById('timerValue')

// Timer state
let currentTimer = null
let timeRemaining = 30

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

function allocateAiImagesForGame() {
    // Shuffle all AI images and allocate them to stages without repeats
    const shuffledAi = shuffleArray(aiImages)
    let index = 0

    // Stage 1: 1 AI image
    allocatedAiImages[1] = shuffledAi.slice(index, index + stageConfig[1].aiCards)
    index += stageConfig[1].aiCards

    // Stage 2: 3 AI images
    allocatedAiImages[2] = shuffledAi.slice(index, index + stageConfig[2].aiCards)
    index += stageConfig[2].aiCards

    // Stage 3: 3 AI images
    allocatedAiImages[3] = shuffledAi.slice(index, index + stageConfig[3].aiCards)
    index += stageConfig[3].aiCards

    // Stage 4: 5 AI images
    allocatedAiImages[4] = shuffledAi.slice(index, index + stageConfig[4].aiCards)
}

// ========== TIMER ========== 

function startTimer(durationSeconds = 30) {
    stopTimer()
    timeRemaining = durationSeconds
    updateTimerDisplay()

    currentTimer = setInterval(() => {
        timeRemaining--
        updateTimerDisplay()

        if (timeRemaining <= 0) {
            stopTimer()
            onTimeExpired()
        }
    }, 1000)
}

function updateTimerDisplay() {
    timerValue.textContent = timeRemaining
    timerElement.classList.remove('warning', 'critical')

    if (timeRemaining <= 5) {
        timerElement.classList.add('critical')
    } else if (timeRemaining <= 10) {
        timerElement.classList.add('warning')
    }
}

function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer)
        currentTimer = null
    }
}

function onTimeExpired() {
    // Time's up! Bump down a stage (or reset if stage 1)
    if (gameState.currentStage === 1) {
        gameState.currentStage = 1
    } else {
        gameState.currentStage--
    }

    gameState.isProcessing = false
    initializeStage(gameState.currentStage)
}

// ========== STAGE SETUP ==========

function initializeStage(stageNum) {
    const config = stageConfig[stageNum]

    // Check if this stage has already been configured in this playthrough
    if (stageConfigs[stageNum] === null) {
        // First time entering this stage - use pre-allocated AI images
        const selectedAi = allocatedAiImages[stageNum]
        const selectedReal = getRandomSubset(realImages, config.totalCards - config.aiCards)

        const cards = [
            ...selectedAi.map(img => ({ src: img, isAi: true })),
            ...selectedReal.map(img => ({ src: img, isAi: false }))
        ]

        // Shuffle to randomize positions for this stage
        let shuffled = shuffleArray(cards)

        stageConfigs[stageNum] = shuffled
    }

    // Use the stored configuration for this stage
    gameState.currentCards = stageConfigs[stageNum]

    // Track which card indices are AI
    gameState.aiCardIndices = gameState.currentCards
        .map((card, idx) => card.isAi ? idx : -1)
        .filter(idx => idx !== -1)

    gameState.selectedCards = []
    gameState.isProcessing = false

    // Update stage indicator
    stageNumber.textContent = stageNum

    renderCards()

    // Start 10-second timer for this stage
    startTimer(10)
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
                <img src="${card.src}" alt="Card image" class="card-image">
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

    const card = gameState.currentCards[index]

    // Check if user clicked on a real image (wrong) - immediately punish
    if (!card.isAi) {
        gameState.isProcessing = true
        gameState.selectedCards.push(index)
        cardEl.classList.add('selected')
        handleWrongSelection()
        return
    }

    // Add correct card to selected list and mark it visually
    gameState.selectedCards.push(index)
    cardEl.classList.add('selected')

    // Wait for the correct number of selections (equal to AI count for this stage)
    const aiCountForStage = stageConfig[gameState.currentStage].aiCards
    if (gameState.selectedCards.length < aiCountForStage) {
        return
    }

    // All correct selections made! Advance to next stage
    gameState.isProcessing = true
    handleCorrectSelection()
}

function handleCorrectSelection() {
    hint.classList.remove('show')
    stopTimer()

    setTimeout(() => {
        if (gameState.currentStage === 4) {
            triggerGameComplete()
        } else {
            gameState.currentStage++
            initializeStage(gameState.currentStage)
            gameState.isProcessing = false
        }
    }, 800)
}

function handleWrongSelection() {
    // Show shake animation on selected cards
    stopTimer()
    const selectedCardEls = document.querySelectorAll('.card.selected')
    selectedCardEls.forEach(card => {
        card.classList.add('shake')
    })
    hint.classList.add('show')

    setTimeout(() => {
        // Remove selection styling
        selectedCardEls.forEach(card => {
            card.classList.remove('selected', 'shake')
        })

        // If on stage 1, just reset selections without changing stage or restarting timer
        if (gameState.currentStage === 1) {
            gameState.selectedCards = []
            gameState.isProcessing = false
            // Continue with existing timer
            startTimer(timeRemaining)
        } else {
            // Bump down a stage
            gameState.currentStage--
            initializeStage(gameState.currentStage)
            gameState.isProcessing = false
        }
    }, 600)
}

// ========== CODE REVEAL ========== 

function revealDigit(digitElement) {
    if (digitElement.classList.contains('revealed')) return
    digitElement.classList.add('revealed')
    digitElement.style.visibility = 'visible'
}

// ========== GAME COMPLETION ========== 

function triggerGameComplete() {
    // Stop the timer
    stopTimer()

    // Reveal all digits at game completion
    const digitMap = { 1: digit1, 2: digit2, 3: digit3, 4: digit4 }
    Object.values(digitMap).forEach(digit => revealDigit(digit))

    const imgContainer = cardGrid
    const codeArea = document.getElementById('codeArea')
    const stageIndicator = document.getElementById('stageIndicator') // Add this
    const digitGroups = document.querySelectorAll('.code-digit-group')
    const heading = document.querySelector('h1')

    cardGrid.classList.add('quiz-complete')
    codeArea.classList.add('quiz-complete')
    hint.classList.add('quiz-complete')
    timerElement.classList.add('quiz-complete')

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