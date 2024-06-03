// Function to shuffle an array using Web Crypto API for randomness
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInRange(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to generate a random number within a given range using Web Crypto API
function getRandomInRange(min, max) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
    return Math.floor(randomNumber * (max - min) + min);
}

// Function to get all SVG files from the directory
function loadSVGFiles() {
    return fetch('img/lettering')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const svgFiles = Array.from(doc.querySelectorAll('a'))
                                  .map(a => a.getAttribute('href'))
                                  .filter(href => href.endsWith('.svg'));
            return svgFiles;
        });
}

// Function to randomize SVG display in the frame
function randomizeSVG() {
    if (svgFiles.length === 0) {
        svgFiles = [...usedSvgFiles];
        usedSvgFiles = [];
        shuffleArray(svgFiles);

        // Ensure the first SVG of the new cycle is not the same as the last one of the previous cycle
        if (svgFiles[svgFiles.length - 1] === lastSVG) {
            [svgFiles[0], svgFiles[svgFiles.length - 1]] = [svgFiles[svgFiles.length - 1], svgFiles[0]];
        }
    }
    const randomSVG = svgFiles.pop();
    usedSvgFiles.push(randomSVG);
    lastSVG = randomSVG;

    // Update the content of the frame with the random SVG
    leonardoFrame.innerHTML = `<img src="img/lettering/${randomSVG}" alt="${randomSVG}">`;
}

// Select the frame element
const leonardoFrame = document.getElementById('leonardo3');

// Initialize arrays to hold the SVG file names and track the last displayed SVG
let svgFiles = [];
let usedSvgFiles = [];
let lastSVG = '';

// Load SVG file names from the directory and shuffle them
loadSVGFiles().then(files => {
    svgFiles = files;
    shuffleArray(svgFiles);
    // Add a click event listener to the frame
    leonardoFrame.addEventListener('click', randomizeSVG);
}).catch(error => console.error('Error loading SVG files:', error));
