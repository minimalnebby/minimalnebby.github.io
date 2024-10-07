// Fixed compound word chain
const wordChain = [
    'Starship', 'Shipyard', 'Yardstick', 'Stickman', 'Manpower', 'Powerboat', 'Boathouse'
];

// Number of words in the chain (including start and end)
let currentWordIndex = 1; // Start after the first word
let mistakes = 0;
const maxMistakes = 4;
let revealedLetters = {}; // Track revealed letters per word

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
    startWordSpan.textContent = wordChain[0]; // First word
    endWordSpan.textContent = wordChain[wordChain.length - 1]; // Last word
}

// Create input fields for each word in the chain (except the first and last)
function createWordInputs() {
    for (let i = 1; i < wordChain.length - 1; i++) {
        const span = document.createElement('span');
        span.textContent = '_'.repeat(wordChain[i].length); // Initially hide all letters
        span.setAttribute('data-word', wordChain[i]); // Store the full word as data attribute
        span.classList.add('word'); // Add word class
        wordInputsDiv.appendChild(span);

        // Initialize revealed letters count for each word
        revealedLetters[i] = 0;
    }
}

// Reveal more letters of the word that is two positions ahead when a mistake is made
function revealHint() {
    const revealWordIndex = currentWordIndex + 1; // Reveal letters of the word two positions ahead

    if (revealWordIndex < wordChain.length - 1) { // Ensure we're not revealing beyond the last word
        const revealWord = wordChain[revealWordIndex];
        const span = wordInputsDiv.children[revealWordIndex - 1]; // Get the span for the word two positions ahead

        // Reveal another letter in the word two positions ahead if there are letters left to reveal
        if (revealedLetters[revealWordIndex] < revealWord.length) {
            revealedLetters[revealWordIndex]++;
            span.textContent = revealWord.substring(0, revealedLetters[revealWordIndex]) + '_'.repeat(revealWord.length - revealedLetters[revealWordIndex]); // Reveal more letters
        }
    }
}

// Check if the input word is correct
function checkWord() {
    const userWord = userInput.value.trim();
    if (userWord.toLowerCase() === wordChain[currentWordIndex].toLowerCase()) {
        // Correct word
        wordInputsDiv.children[currentWordIndex - 1].textContent = userWord;
        feedbackDiv.textContent = '';
        currentWordIndex++;
        if (currentWordIndex === wordChain.length - 1) {
            // Player completed the chain
            gameOverMessage.textContent = 'Congratulations! You completed the word chain!';
            gameOverDiv.classList.remove('hidden');
        }
    } else {
        // Incorrect word
        mistakes++;
        feedbackDiv.textContent = 'Incorrect word! Try again.';
        mistakesDiv.textContent = `Mistakes: ${mistakes} / ${maxMistakes}`;
        revealHint(); // Reveal more of the word two positions ahead
        if (mistakes >= maxMistakes) {
            // Player lost
            gameOverMessage.textContent = 'Game over! The correct chain was: ' + wordChain.join(' -> ');
            gameOverDiv.classList.remove('hidden');
        }
    }
    userInput.value = '';
}

// Restart the game
function restartGame() {
    currentWordIndex = 1;
    mistakes = 0;
    revealedLetters = {}; // Reset revealed letters
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
