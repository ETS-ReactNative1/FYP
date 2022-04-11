import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import BackgroundService from 'react-native-background-actions';
import uploadMap from './Functions'


function App() {
  BackgroundService.start(veryIntensiveTask, options);
  // BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'}); // Only Android, iOS will ignore this call
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
        await new Promise( async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log(i);
                uploadMap;
                await sleep(delay);
            }
        });
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
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 5000,
        },
    };

export default App;