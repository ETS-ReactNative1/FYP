import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import BackgroundService from 'react-native-background-actions';
import uploadMap from './Functions'
import AsyncStorage from '@react-native-async-storage/async-storage';


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
            var code = '';
            var userCode = '';
            if (userCode == '') {
                code = AsyncStorage.getItem('Code');
                userCode = AsyncStorage.getItem('Code2');
            }
            if (userCode == '') {
                try {
                    userCode = AsyncStorage.getItem('Code');
                }catch(error){}
            }
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log('before',i);
                try {
                    var value = AsyncStorage.getItem('Code');
                    if (value == null) {
                        // No code yet, generate a code
                        //gen code
                        var text = ""
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        for (var j = 0; j < 6; j++)
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        //store code
                        try {
                            AsyncStorage.setItem(
                                'Code', text
                            );
                        } catch (error) {
                            // Error saving data
                        }
                    }
                    // Always try to display a code
                    value =  AsyncStorage.getItem('Code');
                    code = value;
                    console.log('code', code);
                    var value2 =  AsyncStorage.getItem('Code2');
                    if (value2 == null) {
                        value2 = value;
                    }
                    userCode = value2;  
                } catch (error) {
                    // error
                }
                uploadMap(code);
                console.log('after',i);
                sleep(5000);
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