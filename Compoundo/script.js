const words = ['Starship', 'Shipyard', 'Yardstick', 'Stickman', 'Manpower', 'Powerboat', 'Boathouse']; // Correct word chain
let currentWordIndex = 1; // Start after the first word
let mistakes = 0;
const maxMistakes = 4;
let revealedLetters = 1; // Number of revealed letters (starts with 1)

// HTML Elements
const wordInputsDiv = document.getElementById('word-inputs');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackDiv = document.getElementById('feedback');
const mistakesDiv = document.getElementById('mistakes');
const gameOverDiv = document.getElementById('game-over');
const gameOverMessage = document.getElementById('game-over-message');
const restartBtn = document.getElementById('restart-btn');
const startWordSpan = document.getElementById('start-word');
const endWordSpan = document.getElementById('end-word');

// Populate the start and end words
function setStartAndEndWords() {
    startWordSpan.textContent = words[0]; // First word
    endWordSpan.textContent = words[words.length - 1]; // Last word
}

// Create input fields for each word in the chain (except the first and last)
function createWordInputs() {
    for (let i = 1; i < words.length - 1; i++) {
        const span = document.createElement('span');
        span.textContent = words[i][0]; // Start by showing the first letter only
        span.setAttribute('data-word', words[i]); // Store the full word as data attribute
        wordInputsDiv.appendChild(span);
    }
}

// Reveal more letters of the current word when a mistake is made
function revealHint() {
    const currentWord = words[currentWordIndex];
    const span = wordInputsDiv.children[currentWordIndex - 1]; // Get the span for the current word
    if (revealedLetters < currentWord.length) {
        revealedLetters++;
        span.textContent = currentWord.substring(0, revealedLetters); // Reveal more letters
    }
}

// Check if the input word is correct
function checkWord() {
    const userWord = userInput.value.trim();
    if (userWord.toLowerCase() === words[currentWordIndex].toLowerCase()) {
        // Correct word
        wordInputsDiv.children[currentWordIndex - 1].textContent = userWord;
        feedbackDiv.textContent = '';
        currentWordIndex++;
        revealedLetters = 1; // Reset revealed letters for the next word
        if (currentWordIndex === words.length - 1) {
            // Player completed the chain
            gameOverMessage.textContent = 'Congratulations! You completed the word chain!';
            gameOverDiv.classList.remove('hidden');
        }
    } else {
        // Incorrect word
        mistakes++;
        feedbackDiv.textContent = 'Incorrect word! Try again.';
        mistakesDiv.textContent = `Mistakes: ${mistakes} / ${maxMistakes}`;
        revealHint(); // Reveal more of the current word
        if (mistakes >= maxMistakes) {
            // Player lost
            gameOverMessage.textContent = 'Game over! The correct chain was: ' + words.join(' -> ');
            gameOverDiv.classList.remove('hidden');
        }
    }
    userInput.value = '';
}

// Restart the game
function restartGame() {
    currentWordIndex = 1;
    mistakes = 0;
    revealedLetters = 1; // Reset revealed letters
    feedbackDiv.textContent = '';
    mistakesDiv.textContent = `Mistakes: 0 / ${maxMistakes}`;
    gameOverDiv.classList.add('hidden');
    wordInputsDiv.innerHTML = '';
    createWordInputs();
}

// Event listeners
submitBtn.addEventListener('click', checkWord);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkWord();
    }
});
restartBtn.addEventListener('click', restartGame);

// Initialize game
setStartAndEndWords(); // Set the start and end words dynamically
createWordInputs();