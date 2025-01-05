console.log("helloooooo");
let timer;
let timeLeft = 0;
let isRunning = false;

function showSplashScreen() {
    const splash = document.createElement('div');
    splash.className = 'splash-screen';
    splash.innerHTML = `
        <div class="splash-content">
            <div class="splash-logo">
                <div class="splash-logo-inner"></div>
            </div>
            <h1>Let's Meditate</h1>
        </div>
    `;
    document.body.appendChild(splash);

    // Remove splash screen after 3 seconds
    setTimeout(() => {
        splash.remove();
    }, 3000);
}
function onDeviceReady() {
    // Show splash screen
    showSplashScreen();
    console.log('Cordova is ready');
    // Initialize buttons
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('locationsBtn').addEventListener('click', findNearbyPlaces);
    document.getElementById('timeSelect').addEventListener('change', updateSelectedTime);
}
document.addEventListener('DOMContentLoaded', onDeviceReady, false);

function startTimer() {
    console.log('Start button clicked');
    if (isRunning) {
        alert('Timer is already running!');
        return;
    }
    console.log('Timer is not running, starting now'); // Debug log
    isRunning = true;
    if (timeLeft === 0) {
        const selectedTime = document.getElementById('timeSelect').value;
        console.log('Selected time:', selectedTime); // Debug log
        timeLeft = selectedTime * 60;
    }
    navigator.vibrate(500); // Vibrate when session starts
    timer = setInterval(updateTimer, 1000);
    document.getElementById('startBtn').textContent = 'Running...';
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        endSession();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.querySelector('.timer-display').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('startBtn').textContent = 'Resume';
        navigator.vibrate(200);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 0;
    updateTimerDisplay();
    document.getElementById('startBtn').textContent = 'Start Session';
    navigator.vibrate([100, 100, 100]);
}

function endSession() {
    clearInterval(timer);
    isRunning = false;
    document.getElementById('startBtn').textContent = 'Start Session';
    navigator.vibrate([500, 200, 500]);
}

function findNearbyPlaces() {
    // Show loading message
    const placesList = document.getElementById('placesList');
    placesList.innerHTML ='<div class="loading-spinner"></div>';

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            searchNearbyPlaces(latitude, longitude);
            console.log('Latitude:', position.coords.latitude);
            console.log('Longitude:', position.coords.longitude);
            searchNearbyPlaces(position.coords.latitude, position.coords.longitude);
        },
        function (error) {
            console.error('Geolocation Error:', error);
            const errorMessage = {
            1: 'Location access denied. Please enable it in your settings.',
            2: 'Location information is unavailable.',
            3: 'Location request timed out. Try again.',
            }[error.code] || 'An unknown error occurred.';
               placesList.innerHTML = `<p class="error">${errorMessage}</p>`;
               navigator.vibrate(100); // Short vibration for error
           },
        {
            enableHighAccuracy: true, timeout: 5000, maximumAge: 0
        }
    );
}

function searchNearbyPlaces(latitude, longitude) {
    const radius = 3000; // 3 km radius
    const query = `
        [out:json];
        (
          node["leisure"="park"](around:${radius},${latitude},${longitude});
          node["natural"="beach"](around:${radius},${latitude},${longitude});
          node["leisure"="garden"](around:${radius},${latitude},${longitude});
          node["amenity"="library"](around:${radius},${latitude},${longitude});
          node["amenity"="place_of_worship"](around:${radius},${latitude},${longitude});
        );
        out body;
    `;
    const apiUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    console.log('Fetching places from:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const placesList = document.getElementById('placesList');
            placesList.innerHTML = '';

            if (data.elements && data.elements.length > 0) {
                data.elements.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'place-card';
                    card.innerHTML = `
                        <div class="place-category">
                            <h4>${place.tags.name || 'Unnamed Place'}</h4>
                        </div>
                        <p class="location-info">Type: ${place.tags.leisure || place.tags.natural || place.tags.amenity}</p>
                        <button class="direction-btn" onclick="openDirections(${place.lat}, ${place.lon})">
                            Get Directions
                        </button>
                    `;
                    placesList.appendChild(card);
                });
            } else {
                placesList.innerHTML = '<p>No places found nearby.</p>';
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            document.getElementById('placesList').innerHTML = `<p class="error">Error fetching places: ${error.message}</p>`;
        });
}

function openDirections(lat, lon) {
    const url = `https://www.openstreetmap.org/directions?from=&to=${lat},${lon}`;
    window.open(url, '_blank');
}

function getRandomDistance() {
    return (Math.random() * 3).toFixed(1) + ' km';
}

function vibrateFeedback() {
    navigator.vibrate(50);
}

function updateSelectedTime() {
    if (!isRunning) {
        timeLeft = document.getElementById('timeSelect').value * 60;
        updateTimerDisplay();
    }
}
window.onerror = function ( message, source, lineno, colno, error ) {
    console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
    alert('An unexpected error occurred. Please try again.');
};

if ('serviceWorker'  in navigator) {
         navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('Service Worker registered.'))
        .catch(error => console.error('Service Worker registration failed:', error));
}

const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');
const filePicker = document.getElementById('filePicker');

filePicker.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audioSource.src = fileURL;
        audioPlayer.load();
        audioPlayer.play();
        console.log('Playing:', file.name);
    } else {
        console.log('No file selected');
    }
});