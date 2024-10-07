// Object storing different word chains by version or date
const wordChainsByVersion = {
    "1": ['Starship', 'shipyard', 'yardstick', 'stickman', 'manpower', 'powerboat', 'Boathouse'],
    "2": ['Notebook', 'bookstore', 'storefront', 'frontline', 'lineup', 'upstream', 'Streamline'],
    "3": ['Rainbow', 'bowtie', 'tieback', 'backpack', 'packhorse','horsepower','Powerline']
};

// This will hold the currently selected word chain
let wordChain = [];

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
const versionSelect = document.getElementById('version-select');

// Populate the versions dropdown menu with available versions
function populateVersionSelect() {
    const sortedVersions = Object.keys(wordChainsByVersion).sort().reverse(); // Sort the versions in descending order
    for (const version of sortedVersions) {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = `Version: ${version}`;
        versionSelect.appendChild(option);
    }
}

// Function to set the word chain based on the selected version
function loadWordChain() {
    const selectedVersion = versionSelect.value;
    wordChain = wordChainsByVersion[selectedVersion];
    restartGame(); // Restart the game whenever a new version is selected
}

// Populate the start and end words
function setStartAndEndWords() {
    startWordSpan.textContent = wordChain[0]; // First word
    endWordSpan.textContent = wordChain[wordChain.length - 1]; // Last word
}

// Create input fields for each word in the chain (except the first and last)
function createWordInputs() {
    // Clear previous inputs to prevent blank lines
    wordInputsDiv.innerHTML = ''; 
    
    for (let i = 1; i < wordChain.length - 1; i++) {
        const span = document.createElement('span');
        // Create a dashed line based on the length of the word (e.g., "- - -")
        const dashedLine = '- '.repeat(wordChain[i].length).trim(); // Ensure no trailing space
        span.textContent = dashedLine; // Initially hide all letters with dashes
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
            const revealedPart = revealWord.substring(0, revealedLetters[revealWordIndex]);
            const remainingDashes = '- '.repeat(revealWord.length - revealedLetters[revealWordIndex]).trim();
            span.textContent = revealedPart + ' ' + remainingDashes; // Show revealed letters and remaining dashes
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
    setStartAndEndWords(); // Set the start and end words based on the new version
    createWordInputs(); // Create input fields for the new version
}

// Automatically load the latest version when the game starts
function loadLatestVersion() {
    const sortedVersions = Object.keys(wordChainsByVersion).sort(); // Sort the versions
    const latestVersion = sortedVersions[sortedVersions.length - 1]; // Get the latest version
    versionSelect.value = latestVersion; // Set the dropdown to the latest version
    loadWordChain(); // Load the word chain for the latest version
}

// Event listeners
submitBtn.addEventListener('click', checkWord);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkWord();
    }
});
restartBtn.addEventListener('click', restartGame);
versionSelect.addEventListener('change', loadWordChain); // Reload the game when a different version is selected

// Initialize game
populateVersionSelect(); // Populate the version dropdown
loadLatestVersion(); // Load the latest version by default