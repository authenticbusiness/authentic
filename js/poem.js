// Function to generate a random number within a given range using Web Crypto API
function getRandomInRange(min, max) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
    return Math.floor(randomNumber * (max - min) + min);
}

// Function to shuffle an array using Web Crypto API for randomness
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInRange(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to load sentences from the JSON file
function loadSentencesFromJSON(jsonPath) {
    return fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

// Function to display the next sentence in the shuffled array and randomize font settings
function displayNextSentence() {
    if (currentIndex >= sentences.length) {
        currentIndex = 0;
        shuffleArray(sentences);
        paragraph.textContent = titleCard;
        paragraph.style.fontVariationSettings = `'wght' 90, 'wdth' 100`; // Fixed font settings for the title card
    } else {
        const randomWeight = getRandomInRange(weightMin, weightMax).toFixed(2);
        const randomWidth = getRandomInRange(widthMin, widthMax).toFixed(2);
        paragraph.style.fontVariationSettings = `'wght' ${randomWeight}, 'wdth' ${randomWidth}`;
        
        paragraph.textContent = sentences[currentIndex];
        currentIndex++;
    }
}

// Select the frame and paragraph elements
const frame = document.getElementById('frame1');
const paragraph = document.getElementById('poems');

// Initialize variables
let sentences = [];
let currentIndex = 0;
const titleCard = "Leonardo da Vinci wrote that a poet would be overcome by sleep and hunger before being able to describe with words what a painter is able to depict in an instant";

// Define the ranges for weight and width
const weightMin = 60;
const weightMax = 150;
const widthMin = 80;
const widthMax = 100;

// Load sentences from the JSON file and shuffle them
loadSentencesFromJSON('json/poems.json').then(data => {
    sentences = data;
    shuffleArray(sentences);
    paragraph.textContent = titleCard;  // Display the title card initially
    paragraph.style.fontVariationSettings = `'wght' 90, 'wdth' 100`; // Fixed font settings for the title card
    frame.addEventListener('click', displayNextSentence);  // Add event listener to cycle through sentences
}).catch(error => console.error('Error loading sentences:', error));
