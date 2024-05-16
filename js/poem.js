// Function to generate a random number within a given range
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to randomize font settings and text content
function randomizeFontAndText() {
    // Define the ranges for weight and width
    const weightMin = 60;
    const weightMax = 150;
    const widthMin = 80;
    const widthMax = 100;

    // Generate random values for weight and width
    const randomWeight = getRandomInRange(weightMin, weightMax).toFixed(2);
    const randomWidth = getRandomInRange(widthMin, widthMax).toFixed(2);

    // Apply the random values to the paragraph's font-variation-settings
    paragraph.style.fontVariationSettings = `'wght' ${randomWeight}, 'wdth' ${randomWidth}`;

    // Get a random sentence from the sentences array
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    // Set the random sentence as the paragraph's text content
    paragraph.textContent = randomSentence;
}

// Load the JSON file and parse it into an array of sentences
function loadSentencesFromJSON(jsonPath) {
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            sentences = data;
            console.log("Sentences loaded:", sentences);
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Select the frame and paragraph elements
const frame = document.getElementById('frame');
const paragraph = document.getElementById('poems');

// Initialize an array to hold the sentences
let sentences = [];

// Load sentences from the JSON file
loadSentencesFromJSON('poems.json');

// Add a click event listener to the frame
frame.addEventListener('click', randomizeFontAndText);
