## Let's Meditate App
A simple meditation app built with Cordova.
Let's Meditate is an easy-to-use, friendly meditation app to bring relaxation and inner peace to users. It a customizable timer with vibration notifications, and a geolocation feature to find nearby calm places like parks and beaches. Users can also listen to their favorite music by selecting tracks from their local storage. With its clean interface, offline mode, and personalization options, "Let's Meditate" makes the meditation experience complete and accessible to all.

### Folder Structure
- www/: Contains all web assets (HTML, CSS, JS, images).
- res/: Contains platform-specific resources (icons, splash screens).
- config.xml: Cordova configuration file.
- platforms/: Platform-specific builds.

### Build and Run
1. Install dependencies: npm install
2. Add platforms: cordova platform add android
3. Build the app: cordova build android
4. Emulate the app : cordova emulate android
5. Run the app: cordova run android

### Cordova Plugins 
1. Vibration : cordova plugin add cordova-plugin-vibration
2. Geolocation : cordova plugin add cordova-plugin-geolocation
3. Splash Screen : cordova plugin add cordova-plugin-splashscreen

### API used
Overpass API : The Overpass API is an open and free alternative to Google Places. We can use it to query OpenStreetMap (OSM) data for near-by places like parks, beaches, etc.
 

### References:
1. cordova : https://cordova.apache.org/docs/en/latest/
2. cordova plugins : https://cordova.apache.org/plugins/
3. offline functionality : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
4. CSS Tricks : https://css-tricks.com/the-little-triangle-in-the-tooltip/
5. https://www.w3schools.com/
6. GFG cordova : https://www.geeksforgeeks.org/building-apps-with-apache-cordova/
7. Overpass API Doc : https://wiki.openstreetmap.org/wiki/Overpass_API
8. Overpass turbo : https://overpass-turbo.eu/
