
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
            quizContent.classList.remove('quiz-hidden')
            quizContent.classList.add('fade-in')
        }, 100)
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

// array for the 4-digit code
const code = [5, 9, 0, 4]

// get each cirlce element
const circle1 = document.getElementById('circle1')
const circle2 = document.getElementById('circle2')
const circle3 = document.getElementById('circle3')
const circle4 = document.getElementById('circle4')
const circle5 = document.getElementById('circle5')
const circle6 = document.getElementById('circle6')
const circle7 = document.getElementById('circle7')
const circle8 = document.getElementById('circle8')
const circle9 = document.getElementById('circle9')
const circle10 = document.getElementById('circle10')
const circle11 = document.getElementById('circle11')
const circle12 = document.getElementById('circle12')

// varaibles to hold the digits
const digit1 = document.getElementById('digit1')
const digit2 = document.getElementById('digit2')
const digit3 = document.getElementById('digit3')
const digit4 = document.getElementById('digit4')

digit1.textContent = code[0]
digit2.textContent = code[1]
digit3.textContent = code[2]
digit4.textContent = code[3]

digit1.style.visibility = 'hidden'
digit2.style.visibility = 'hidden'
digit3.style.visibility = 'hidden'
digit4.style.visibility = 'hidden'

// Variables holding the images
const img1 = document.querySelector('.img1')
const img2 = document.querySelector('.img2')
img1.addEventListener('click', () => handleAnswer(true))
img2.addEventListener('click', () => handleAnswer(false))

// Create image buckets

const correct = []
const incorrect = []

// Populate the correct buckets with file paths to each image in the Instagram/Hers folder
correct.push('./photos/real/0-club.png')
correct.push('./photos/real/1-flower-picking.png')
correct.push('./photos/real/2-run.png')
correct.push('./photos/real/3-stairs.png')
correct.push('./photos/real/4-padel.png')
correct.push('./photos/real/5-selfie.png')
correct.push('./photos/real/6-lunch.png')
correct.push('./photos/real/7-thailand.png')
correct.push('./photos/real/8-car-selfie.png')
correct.push('./photos/real/9-mirror-selfie.png')
correct.push('./photos/real/10-tennis.png')
correct.push('./photos/real/11-new-car.png')

// Populate the incorrect buckets with file paths to each image in the Instagram/Him folder
incorrect.push('./photos/ai/0-beach.png')
incorrect.push('./photos/ai/1-couch.png')
incorrect.push('./photos/ai/2-dinner.png')
incorrect.push('./photos/ai/3-club.png')
incorrect.push('./photos/ai/4-proposal.png')
incorrect.push('./photos/ai/5-run.png')
incorrect.push('./photos/ai/6-kissing.png')
incorrect.push('./photos/ai/7-car.png')
incorrect.push('./photos/ai/8-thailand.png')
incorrect.push('./photos/ai/9-flower-picking.png')
incorrect.push('./photos/ai/10-stairs.png')
incorrect.push('./photos/ai/11-mirror.png')

// Function to choose a random index in the correct and incorrect buckets
let currentCorrectIndex = 0
let currentIncorrectIndex = 0

function getNextCorrectImage() {
    if (correct.length > 0) {
        currentCorrectIndex = Math.floor(Math.random() * correct.length)
    }
}

function getNextIncorrectImage() {
    if (incorrect.length > 0) {
        currentIncorrectIndex = Math.floor(Math.random() * incorrect.length)
    }
}

let isLeftCorrect = true

function updateImages() {
    getNextCorrectImage()
    getNextIncorrectImage()

    // choose a random boolean to determine which image goes where
    const showCorrectOnLeft = Math.random() < 0.5
    if (showCorrectOnLeft) {
        img1.src = correct[currentCorrectIndex]
        img2.src = incorrect[currentIncorrectIndex]
        isLeftCorrect = true
    }
    else {
        img1.src = incorrect[currentIncorrectIndex]
        img2.src = correct[currentCorrectIndex]
        isLeftCorrect = false
    }
}

// Counter for correct answers
let correctCount = 0

// function to reveal digits when the count reaches certain thresholds
function checkDigits() {
    if (correctCount == 3) { // 0, 1, 2
        revealDigit(digit1)
    }
    if (correctCount == 6) { // 3, 4, 5
        revealDigit(digit2)
    }
    if (correctCount == 9) { // 6, 7, 8
        revealDigit(digit3)
    }
    if (correctCount == 12) { // 9, 10, 11
        revealDigit(digit4)
        setTimeout(triggerQuizComplete, 400)
    }
}

// function to trigger completion animation
function triggerQuizComplete() {
    const imgContainer = document.getElementById('imgContainer')
    const codeArea = document.getElementById('codeArea')
    const digitGroups = document.querySelectorAll('.code-digit-group')
    const hint = document.getElementById('hint')
    const circleRows = document.querySelectorAll('.circle-row')
    const digitLines = document.querySelectorAll('.digit-line')
    const digitPlaceholders = document.querySelectorAll('.digit-placeholder')
    const heading = document.querySelector('h1')

    imgContainer.classList.add('quiz-complete')
    codeArea.classList.add('quiz-complete')
    hint.classList.add('quiz-complete')
    digitGroups.forEach(group => group.classList.add('centered'))
    circleRows.forEach(row => row.classList.add('quiz-complete'))
    digitLines.forEach(line => line.classList.add('quiz-complete'))
    digitPlaceholders.forEach(digit => digit.classList.add('quiz-complete'))
    if (heading) heading.classList.add('quiz-complete')
}

// function to fill a cirlcle
function fillCircle(index) {
    switch (index) {
        case 1:
            fill(circle1)
            break
        case 2:
            fill(circle2)
            break
        case 3:
            fill(circle3)
            break
        case 4:
            fill(circle4)
            break
        case 5:
            fill(circle5)
            break
        case 6:
            fill(circle6)
            break
        case 7:
            fill(circle7)
            break
        case 8:
            fill(circle8)
            break
        case 9:
            fill(circle9)
            break
        case 10:
            fill(circle10)
            break
        case 11:
            fill(circle11)
            break
        case 12:
            fill(circle12)
            break
    }
}

function fill(circleElement) {
    // fade the inside of the circle to green with a black checkmark
    const fillDiv = circleElement.querySelector('.c-fill')
    const iconDiv = circleElement.querySelector('.c-icon')
    const dotDiv = circleElement.querySelector('.c-dot')

    if (fillDiv && !fillDiv.classList.contains('active')) {
        fillDiv.classList.add('active')
        if (iconDiv) {
            iconDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`
        }
        if (dotDiv) dotDiv.style.display = 'none'
    }
}

// Create a reveal digit animation
function revealDigit(digitElement) {
    if (digitElement.classList.contains('revealed')) return
    digitElement.classList.add('revealed')
    digitElement.style.animation = 'fadeReveal 0.4s ease forwards'
    digitElement.style.visibility = 'visible'
}

// Create click functions for each image
function handleAnswer(isLeft) {
    if (isLeft) {
        clickLeft()
    }
    else {
        clickRight()
    }
}

function clickLeft() {
    if (correctCount >= 12) return

    if (!isLeftCorrect) {
        correctCount++
        correct.splice(currentCorrectIndex, 1)
        incorrect.splice(currentIncorrectIndex, 1)
        fillCircle(correctCount)
        document.getElementById('hint').classList.remove('show')
        if (correctCount < 12) {
            updateImages()
        }
        checkDigits()
    } else {
        // Wrong answer - shake the image and show hint
        img1.classList.add('wrong-shake')
        document.getElementById('hint').classList.add('show')
        setTimeout(() => {
            img1.classList.remove('wrong-shake')
            if (correctCount < 12) {
                updateImages()
            }
            checkDigits()
        }, 700)
    }
}

function clickRight() {
    if (correctCount >= 12) return

    if (isLeftCorrect) {
        correctCount++
        correct.splice(currentCorrectIndex, 1)
        incorrect.splice(currentIncorrectIndex, 1)
        fillCircle(correctCount)
        document.getElementById('hint').classList.remove('show')
        if (correctCount < 12) {
            updateImages()
        }
        checkDigits()
    } else {
        // Wrong answer - shake the image and show hint
        img2.classList.add('wrong-shake')
        document.getElementById('hint').classList.add('show')
        setTimeout(() => {
            img2.classList.remove('wrong-shake')
            if (correctCount < 12) {
                updateImages()
            }
            checkDigits()
        }, 500)
    }
}

updateImages()