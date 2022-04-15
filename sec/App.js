import React from 'react';
import MainContainer from './navigation/MainContainer';
import BackgroundService from 'react-native-background-actions';
import uploadMap, { uploadLog, downloadLog } from './Functions'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Metro: Ignore log notification by message
import { Alert, LogBox } from 'react-native';
LogBox.ignoreAllLogs();

function App() {
    BackgroundService.start(veryIntensiveTask, options);
    return (  // navigation>screens
        <MainContainer/>  
    );
}

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// Background Task
const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;

    for (let i = 0; BackgroundService.isRunning(); i++) {
        // Main App
        //AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadLog(item)}});
        //AsyncStorage.getItem('Code', (err, item) => {if (item != null) {uploadMap(item)}});

        // Companion App
        AsyncStorage.getItem('Code2', (err, item) => {if (item != null) {downloadLog(item)}});
        
        await sleep(delay);
    }
};


const options = {
    taskName: 'Example',
    taskTitle: 'Scam Tracker',
    taskDesc: '此應用程式正在背景運作中。',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 15000, // Main: TBC
        //delay: 1800000, // Companion: 30mins
    },
};

export default App;