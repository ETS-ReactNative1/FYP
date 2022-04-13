import React, {useEffect, useState} from 'react';
import MainContainer from './navigation/MainContainer';
import BackgroundService from 'react-native-background-actions';
import uploadMap, { uploadLog, downloadLog } from './Functions'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Metro: Ignore log notification by message
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

function App() {
    BackgroundService.start(veryIntensiveTask, options);
    // iOS will also run everything here in the background until .stop() is called

    return (  // navigation>screens
        <MainContainer/>  
    );
}

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).



const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;

    for (let i = 0; BackgroundService.isRunning(); i++) {
        //console.log('before',i);
        AsyncStorage.getItem('Code', (err, item) => uploadMap(item));
        AsyncStorage.getItem('Code', (err, item) => uploadLog(item));
        //AsyncStorage.getItem('Code2', (err, item) => downloadLog(item));
        //console.log('after',i);
        await sleep(delay);
    }
};


const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 10000, // Set a longer delay when deploy
    },
};

export default App;