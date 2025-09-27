// Get the theme toggle button
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Function to apply the saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // If 'dark' is saved, add the dark-mode class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        // Otherwise, ensure dark-mode is removed (for light mode)
        document.body.classList.remove('dark-mode');
    }
}

// Add an event listener to the button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the .dark-mode class on the body element
    document.body.classList.toggle('dark-mode');

    // Save the current theme preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Call the function to apply the theme when the page first loads
applySavedTheme();

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
        return unit < 10 ? '00' + unit : unit < 100 ? '0' + unit : unit;
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
        // Use setInterval to call runTimer every 10 milliseconds
        timerInterval = setInterval(runTimer, 10); 
        isRunning = true;
        // Optionally disable/enable buttons
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline';
    }
}

function stopStopwatch() {
    if (isRunning) {
        // Clear the interval to stop the timer
        clearInterval(timerInterval);
        isRunning = false;
        // Optionally disable/enable buttons
        stopBtn.style.display = 'none';
        startBtn.style.display = 'inline';
    }
}

function resetStopwatch() {
    // 1. Stop the timer first
    stopStopwatch();

    // 2. Reset all time variables to zero
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    // 3. Reset the display text content
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '000';
    
    // 4. Clear the laps list
    lapsList.innerHTML = '';
    lapCounter = 0;
    
    // 5. Ensure the start button is visible
    startBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
}

function recordLap() {
    if (isRunning) {
        lapCounter++;
        // Get the current time string
        const currentTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
        
        // Create a new list item for the lap
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapCounter}: ${currentTime}`;
        
        // Add the new lap to the top of the list
        lapsList.prepend(lapItem);
    }
}


// --- 5. Event Listeners ---

startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Initial display setup (Hides the stop button at start)
stopBtn.style.display = 'none';