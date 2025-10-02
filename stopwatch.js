// --- 1. Variable Declarations (Global Scope) ---

// Timer elements
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');

// Button elements
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

// Theme toggle button (Declared only once)
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Time variables
let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;

// State variables
let timerInterval = null; // Holds the ID returned by setInterval
let isRunning = false;
let lapCounter = 0;


// --- 2. Helper Function for Formatting ---

// Adds a leading zero for single-digit numbers (e.g., 5 becomes 05)
function formatTime(unit) {
    // Milliseconds need special handling for 3 digits
    if (unit === milliseconds) {
        // Correcting the logic to ensure 3 digits are displayed
        return unit.toString().padStart(3, '0');
    }
    // Hours, minutes, seconds
    return unit < 10 ? '0' + unit : unit;
}

// --- 3. The Core Timer Function ---

function runTimer() {
    milliseconds += 10; // Increment by 10ms (1/100th of a second)

    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;

            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }
    }

    // Update the display with the new formatted values
    millisecondsDisplay.textContent = formatTime(milliseconds);
    secondsDisplay.textContent = formatTime(seconds);
    minutesDisplay.textContent = formatTime(minutes);
    hoursDisplay.textContent = formatTime(hours);
}

// --- 4. Button Logic Functions ---

function startStopwatch() {
    if (!isRunning) {
        timerInterval = setInterval(runTimer, 10); 
        isRunning = true;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline';
    }
}

function stopStopwatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        stopBtn.style.display = 'none';
        startBtn.style.display = 'inline';
    }
}

function resetStopwatch() {
    stopStopwatch();
    
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '000'; // Reset to 3 digits
    
    lapsList.innerHTML = '';
    lapCounter = 0;
    
    startBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
}

// Add a function to save the current lap data to localStorage
function saveLaps() {
    // Get all the <li> HTML content from the lapsList
    const lapItems = lapsList.innerHTML;
    localStorage.setItem('stopwatchLaps', lapItems);
    localStorage.setItem('lapCounter', lapCounter);
}

function recordLap() {
    if (isRunning) {
        lapCounter++;
        
        const currentTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;

        const lapItem = document.createElement('li');
        lapItem.textContent = `${lapCounter.toString().padStart(2, '0')} - ${currentTime}`;

        lapsList.prepend(lapItem);
        
        // NEW: Save the updated laps list after adding a new one
        saveLaps(); 
    }
}

// Function to load laps from localStorage when the page loads
function loadLaps() {
    const savedLaps = localStorage.getItem('stopwatchLaps');
    const savedCounter = localStorage.getItem('lapCounter');

    if (savedLaps) {
        // Restore the saved HTML directly to the list
        lapsList.innerHTML = savedLaps;
    }
    
    if (savedCounter) {
        // Restore the lap counter to the last saved value
        lapCounter = parseInt(savedCounter);
    }
}

// Ensure loadLaps() runs once at the beginning of the script
// (Place this near your initial variable declarations)
loadLaps();

function resetStopwatch() {
    // 1. Stop the timer
    stopStopwatch();
    
    // 2. Reset time variables
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    // 3. Reset the display text content
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '000';
    
    // 4. Clear the laps list in the DOM
    lapsList.innerHTML = '';
    lapCounter = 0;
    
    // 5. Clear the stored data from localStorage (The important new step)
    localStorage.removeItem('stopwatchLaps');
    localStorage.removeItem('lapCounter');
    
    // 6. Ensure the start button is visible
    startBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
}

// --- 5. Event Listeners ---

startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Theme Toggle Click Handler in stopwatch.js
themeToggleBtn.addEventListener('click', () => {
    // Change body to document.documentElement
    document.documentElement.classList.toggle('dark-mode');

    // Save the current theme preference to localStorage
    if (document.documentElement.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
