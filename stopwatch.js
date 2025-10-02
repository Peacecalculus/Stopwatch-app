document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Variable Declarations ---
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    const resetBtn = document.getElementById('reset');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let lapCounter = 0;

    // --- 2. Time Formatting and Display Update ---
    function formatTime(timeInMs) {
        const date = new Date(timeInMs);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
        
        hoursDisplay.textContent = hours;
        minutesDisplay.textContent = minutes;
        secondsDisplay.textContent = seconds;
        millisecondsDisplay.textContent = milliseconds;
    }

    // --- 3. The Core Timer Loop (Optimized with requestAnimationFrame) ---
    function timerLoop() {
        elapsedTime = Date.now() - startTime;
        formatTime(elapsedTime);
        timerInterval = requestAnimationFrame(timerLoop);
    }

    // --- 4. Button Logic Functions ---
    function startStopwatch() {
        if (!isRunning) {
            isRunning = true;
            startTime = Date.now() - elapsedTime; // Resume from where we left off
            timerInterval = requestAnimationFrame(timerLoop);
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline';
        }
    }

    function stopStopwatch() {
        if (isRunning) {
            isRunning = false;
            cancelAnimationFrame(timerInterval);
            stopBtn.style.display = 'none';
            startBtn.style.display = 'inline';
        }
    }

    function resetStopwatch() {
        stopStopwatch();
        elapsedTime = 0;
        formatTime(0);
        
        lapsList.innerHTML = '';
        lapCounter = 0;
        localStorage.removeItem('stopwatchLaps');
        localStorage.removeItem('lapCounter');
    }

    function recordLap() {
        if (isRunning) {
            lapCounter++;
            const date = new Date(elapsedTime);
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
            
            const currentTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
            const lapItem = document.createElement('li');
            lapItem.textContent = `${lapCounter.toString().padStart(2, '0')} - ${currentTime}`;
            lapsList.prepend(lapItem);
            saveLaps();
        }
    }

    // --- 5. Persistence (localStorage for Laps & Theme) ---
    function saveLaps() {
        localStorage.setItem('stopwatchLaps', lapsList.innerHTML);
        localStorage.setItem('lapCounter', lapCounter);
    }

    function loadLaps() {
        const savedLaps = localStorage.getItem('stopwatchLaps');
        const savedCounter = localStorage.getItem('lapCounter');
        if (savedLaps) {
            lapsList.innerHTML = savedLaps;
        }
        if (savedCounter) {
            lapCounter = parseInt(savedCounter, 10);
        }
    }
    
    // Theme Toggle Logic
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // --- 6. Initial Setup ---
    startBtn.addEventListener('click', startStopwatch);
    stopBtn.addEventListener('click', stopStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);

    loadLaps(); // Load laps on page startup
});