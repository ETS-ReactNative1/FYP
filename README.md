# FYP21027 Codebase

Welcome to FYP21027 codebase.

## sec is the project code folder
The project folder consists of 2 apps.  
In order to run different variants of the App, some code needs to be changed.  
  
To run the main application:  
  
In App.js (Line 25-34), keep the Companion App part commented:
~~~
for (let i = 0; BackgroundService.isRunning(); i++) {
        // Main App
        AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadLog(item)}});
        AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadMap(item)}});

        // Companion App
        //AsyncStorage.getItem('Code2', (err, item) => {if (item != null) {downloadLog(item)}});
        
        await sleep(delay);
    }
~~~
  
In MainContainer.js (Line 6-14), also keep the Companion App part commented:
~~~
// Main App pages
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Companion App pages
//import HomeScreen from './screens/HomeScreen_c';
//import DetailsScreen from './screens/DetailsScreen_c';
//import SettingsScreen from './screens/SettingsScreen_c';
~~~

~~~~~~~~~~~~~~~~~~~~~~~
STARTING GUIDLINES
To use <sec>, you should:
1) unzip the project folder
2) start a emulator
 cd  xxxx(your file location)\Android\Sdk\emulator
 emulator -avd YourEmulatorName
3) cd the project folder and enter the following commands:
 npm i
 npx react-native start
 npx react-native run-android

~~~~~~~~~~~~~~~~~~~~~~~
## SET UP GUIDLINES
In case it does not work, you may manually install the following dependencies: \
We suggest using `yarn add` over `npm i` for installing the dependencies.

~~~~
1. cd sec
2. yarn add @react-navigation/native
3. expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
4. yarn add @react-navigation/stack
5. yarn add @react-navigation/bottom-tabs
6. yarn add @notifee/react-native
7. npm i react-native-call-log OR yarn add react-native-call-log
8. npm install react-native-maps --save-exact
9. npm i react-native-get-location
10. yarn add @react-native-async-storage/async-storage
11. yarn add @react-native-firebase/database
12. yarn add react-native-background-actions

After installation, you may restart the app.
~~~~~~~~~~~~~~~~~~~~~~~
