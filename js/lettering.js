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

// Function to load SVG file names from the JSON file
function loadSVGFilesFromJSON(jsonPath) {
    return fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

// Function to display the next SVG in the shuffled array
function displayNextSVG() {
    if (currentSVGIndex >= svgFiles.length) {
        currentSVGIndex = 0;
        shuffleArray(svgFiles);
        leonardoFrame.innerHTML = `<p>${leonardoTitleCard}</p>`;
    } else {
        const randomSVG = svgFiles[currentSVGIndex];
        leonardoFrame.innerHTML = `<img src="img/lettering/${randomSVG}" alt="${randomSVG}">`;
        currentSVGIndex++;
    }
}

// Select the frame element
const leonardoFrame = document.getElementById('leonardo3');

// Initialize variables
let svgFiles = [];
let currentSVGIndex = 0;
const leonardoTitleCard = "Leonardo da Vinci wrote that poetry is an image felt not seen, however, a poet who abandons true nature for fancy words is unable to make anyone feel";

// Load SVG file names from the JSON file and shuffle them
loadSVGFilesFromJSON('json/lettering.json').then(files => {
    svgFiles = files;
    shuffleArray(svgFiles);
    leonardoFrame.innerHTML = `<p>${leonardoTitleCard}</p>`;  // Display the title card initially
    leonardoFrame.addEventListener('click', displayNextSVG);  // Add event listener to cycle through SVGs
}).catch(error => console.error('Error loading SVG files:', error));
