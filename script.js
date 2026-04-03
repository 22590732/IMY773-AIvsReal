
// array for the 4-digit code
const code = [1, 7, 6, 3];

// get each cirlce element
const circle1 = document.getElementById('circle1');
const circle2 = document.getElementById('circle2');
const circle3 = document.getElementById('circle3');
const circle4 = document.getElementById('circle4');
const circle5 = document.getElementById('circle5');
const circle6 = document.getElementById('circle6');
const circle7 = document.getElementById('circle7');
const circle8 = document.getElementById('circle8');
const circle9 = document.getElementById('circle9');
const circle10 = document.getElementById('circle10');
const circle11 = document.getElementById('circle11');
const circle12 = document.getElementById('circle12');

// varaibles to hold the digits
const digit1 = document.getElementById('digit1');
const digit2 = document.getElementById('digit2');
const digit3 = document.getElementById('digit3');
const digit4 = document.getElementById('digit4');

digit1.textContent = code[0];
digit2.textContent = code[1];
digit3.textContent = code[2];
digit4.textContent = code[3];

digit1.style.visibility = 'hidden';
digit2.style.visibility = 'hidden';
digit3.style.visibility = 'hidden';
digit4.style.visibility = 'hidden';

// Variables holding the images
const img1 = document.querySelector('.img1');
const img2 = document.querySelector('.img2');
img1.addEventListener('click', () => handleAnswer(true));
img2.addEventListener('click', () => handleAnswer(false));

// Create image buckets

const correct = [];
const incorrect = [];

// Populate the correct buckets with file paths to each image in the Instagram/Hers folder
correct.push('./Instagram/Her insta/1 half-marathon.png');
correct.push('./Instagram/Her insta/2 night-club.png');
correct.push('./Instagram/Her insta/3 lunch.png');
correct.push('./Instagram/Her insta/4 mirror-selfie.png');
correct.push('./Instagram/Her insta/5 new-selfie.png');
correct.push('./Instagram/Her insta/6 matcha.png');
correct.push('./Instagram/Her insta/7 bestie.png');
correct.push('./Instagram/Her insta/8 tennis-post.png');
correct.push('./Instagram/Her insta/9 padel.png');
correct.push('./Instagram/Her insta/10 flower-picking.png');
correct.push('./Instagram/Her insta/11 new-car.png');

// Populate the incorrect buckets with file paths to each image in the Instagram/Him folder
incorrect.push('./Instagram/His insta/1 half-marathon.png');
incorrect.push('./Instagram/His insta/2 night-club.png');
incorrect.push('./Instagram/His insta/3 lunch.png');
incorrect.push('./Instagram/His insta/4 mirror-selfie.png');
incorrect.push('./Instagram/His insta/5 new-selfie.png');
incorrect.push('./Instagram/His insta/6 matcha.png');
incorrect.push('./Instagram/His insta/7 bestie.png');
incorrect.push('./Instagram/His insta/8 tennis-post.png');
incorrect.push('./Instagram/His insta/9 padel.png');
incorrect.push('./Instagram/His insta/10 flower-picking.png');
incorrect.push('./Instagram/His insta/11 new-car.png');

// Function to choose a random index in the correct and incorrect buckets
let currentCorrectIndex = 0;
let currentIncorrectIndex = 0;

function getNextCorrectImage() {
    if (correct.length > 0) {
        currentCorrectIndex = Math.floor(Math.random() * correct.length);
    }
}

function getNextIncorrectImage() {
    if (incorrect.length > 0) {
        currentIncorrectIndex = Math.floor(Math.random() * incorrect.length);
    }
}

let isLeftCorrect = true;

function updateImages() {
    getNextCorrectImage();
    getNextIncorrectImage();

    // choose a random boolean to determine which image goes where
    const showCorrectOnLeft = Math.random() < 0.5;
    if (showCorrectOnLeft) {
        img1.src = correct[currentCorrectIndex];
        img2.src = incorrect[currentIncorrectIndex];
        isLeftCorrect = true;
    }
    else {
        img1.src = incorrect[currentIncorrectIndex];
        img2.src = correct[currentCorrectIndex];
        isLeftCorrect = false;
    }
}

// Counter for correct answers
let correctCount = 0;

// function to reveal digits when the count reaches certain thresholds
function checkDigits() {
    if (correctCount == 3) { // 0, 1, 2
        revealDigit(digit1);
    }
    if (correctCount == 6) { // 3, 4, 5
        revealDigit(digit2);
    }
    if (correctCount == 9) { // 6, 7, 8
        revealDigit(digit3);
    }
    if (correctCount == 12) { // 9, 10, 11
        revealDigit(digit4);
    }
}

// function to fill a cirlcle
function fillCircle(index) {
    switch (index) {
        case 1:
            fill(circle1);
            break;
        case 2:
            fill(circle2);
            break;
        case 3:
            fill(circle3);
            break;
        case 4:
            fill(circle4);
            break;
        case 5:
            fill(circle5);
            break;
        case 6:
            fill(circle6);
            break;
        case 7:
            fill(circle7);
            break;
        case 8:
            fill(circle8);
            break;
        case 9:
            fill(circle9);
            break;
        case 10:
            fill(circle10);
            break;
        case 11:
            fill(circle11);
            break;
        case 12:
            fill(circle12);
            break;
    }
}

function fill(circleElement) {
    // fade the inside of the circle to green with a black checkmark
    const fillDiv = circleElement.querySelector('.c-fill');
    const iconDiv = circleElement.querySelector('.c-icon');
    const dotDiv = circleElement.querySelector('.c-dot');

    if (fillDiv && !fillDiv.classList.contains('active')) {
        fillDiv.classList.add('active');
        if (iconDiv) {
            iconDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`;
        }
        if (dotDiv) dotDiv.style.display = 'none';
    }
}

// Create a reveal digit animation
function revealDigit(digitElement) {
    if (digitElement.classList.contains('revealed')) return;
    digitElement.classList.add('revealed');
    digitElement.style.animation = 'fadeReveal 0.4s ease forwards';
    digitElement.style.visibility = 'visible';
}

// Create click functions for each image
function handleAnswer(isLeft) {
    if (isLeft) {
        clickLeft();
    }
    else {
        clickRight();
    }
}

function clickLeft() {
    if (!isLeftCorrect) {
        correctCount++;
        correct.splice(currentCorrectIndex, 1);
        incorrect.splice(currentIncorrectIndex, 1);
        fillCircle(correctCount);
    }

    updateImages();
    checkDigits();
}

function clickRight() {
    if (isLeftCorrect) {
        correctCount++;
        correct.splice(currentCorrectIndex, 1);
        incorrect.splice(currentIncorrectIndex, 1);
        fillCircle(correctCount);
    }

    updateImages();
    checkDigits();
}

updateImages();