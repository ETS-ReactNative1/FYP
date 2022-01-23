# <sec> is the project code folder;
After starting the App, you can check the device location at the "home screen". 
Get your call log at "detail screen" bottom section, and check if a telephone number is malicious by putting it in the box above (message will pop up as well) .
Setting screen is currently a dummy screen. No workable features are there.

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
SET UP GUIDLINES
In case it does not work, you may manually install the following:
1. cd sec
2. yarn add @react-navigation/native
3. expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
4. yarn add @react-navigation/stack
5. yarn add @react-navigation/bottom-tabs
6. yarn add @notifee/react-native
7. npm i react-native-call-log
After installation, you may restart the app.

~~~~~~~~~~~~~~~~~~~~~~~



