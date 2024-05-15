// Function to generate a random number within a given range
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Select the paragraph element
const paragraph = document.getElementById('random-font');

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
