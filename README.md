# FYP21027 Codebase

Welcome to FYP21027 codebase.  
This will guide you on how to use our codebase and install the required dependencies.
  
# sec is the project code folder.
This folder contains all the code reuqired for both of our applications.  
More details on how to run different apps will be explained later.  
  
# Setting up & Installing dependencies
## Setting up the environment
Our app is written with React Native.  
Please make sure you have React Native installed and configured before your proceed any further.  
Installtion of React Native can be found [here](https://reactnative.dev/docs/environment-setup).  
  
This set of apps are made for Android devices.  
Please make sure you have an emulator configured or connect an Android device.  
For device connection, please enable "USB Debugging Mode" on your device.  
  
## Installing dependencies
Our app make use of various APIs/ dependencies.  
Installation of dependencies are required to run or build the application.  
The project team suggest using `yarn add` over `npm i` for installing the dependencies.  
You can refer to the following list for installation:  
~~~console
1. cd sec, or use any other way to ensure you're in the project folder.
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
~~~
  
Alternatively, you can run `npm i` or `yarn add` in the project folder, where the package manager does all the work.  
The project team do NOT suggest to install dependencies with this approach. Proceed with your own risk.  
In addition, the `expo` modules are still required to be installed manually if you take this approach.  
  
# Using the App & Configuring which app to run
## Running our app
If you have setup React Native environment and installed required dependencies, the App should run right away.  
To Run the application:  
1. Open a 2 terminals on the project folder (sec).
2. Run `npx react-native start` on the first terminal.
3. Run `npx react-native run-android` on the other terminal.
4. The application should be loaded to your device/ emulator.
  

#IMPORTANT
## Configuring which app to run
The project folder consists of 2 apps. By default, the main app will run.  
In order to run different variants of the App, some code needs to be changed.  
Specifically, `App.js` and `MainContainer.js`.  
  
##Case 1
## Run Main Application (Elderly App):  
Step(1)  
In `App.js` (Line 25-34),  
keep the Companion App part in commented:  
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
Step(2)
In `MainContainer.js` (Line 6-14),
keep the Companion App part in commented:  
~~~javascript
// Main App pages
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Companion App pages
//import HomeScreen from './screens/HomeScreen_c';
//import DetailsScreen from './screens/DetailsScreen_c';
//import SettingsScreen from './screens/SettingsScreen_c';
~~~
  
##Case 2
## Run Companion Application (Family App):   
Step(1)
In `App.js` (Line 25-34),  
keep the Main App part in commented:  
~~~
for (let i = 0; BackgroundService.isRunning(); i++) {
        // Main App
        //AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadLog(item)}});
        //AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadMap(item)}});

        // Companion App
        AsyncStorage.getItem('Code2', (err, item) => {if (item != null) {downloadLog(item)}});
        
        await sleep(delay);
    }
~~~
Step(2) 
In `MainContainer.js` (Line 6-14),
keep the Main App part in commented:  
~~~javascript
// Main App pages
//import HomeScreen from './screens/HomeScreen';
//import DetailsScreen from './screens/DetailsScreen';
//import SettingsScreen from './screens/SettingsScreen';

// Companion App pages
import HomeScreen from './screens/HomeScreen_c';
import DetailsScreen from './screens/DetailsScreen_c';
import SettingsScreen from './screens/SettingsScreen_c';
~~~


End.