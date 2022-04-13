import React from 'react';
import MainContainer from './navigation/MainContainer';
import BackgroundService from 'react-native-background-actions';
import uploadMap, { uploadLog, downloadLog } from './Functions'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Metro: Ignore log notification by message
import { LogBox } from 'react-native';
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
        AsyncStorage.getItem('Code', (err, item) => uploadMap(item));
        AsyncStorage.getItem('Code', (err, item) => uploadLog(item));
        AsyncStorage.getItem('Code2', (err, item) => downloadLog(item));
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
        delay: 20000, // Set a longer delay when deploy
    },
};

export default App;