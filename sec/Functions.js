import { PermissionsAndroid, Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';

export default function uploadMap(code) {
    var reference3 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/Location');

    //call location 
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location2 => {
        console.log("[Background]: ",location2);
        reference3.set(location2);
    })
    .catch(error => {
        //const { code, message } = error;
        //console.warn(code, message);
    })
    
}

export function uploadLog(code) {    
  // Loading Call Log
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
            'title': 'Call Log',
            'message': 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }
    ).then(() => {
        CallLogs.load(10,isDistinct=true).then((c) => checkLogNumber(c).then((c2) => {if (c2 != null) {pushCallLog(code, c2)}}));
    })
  } else {
      console.log("iOS device, no call log available");
  }    
}

export function downloadLog(code) {
  var newRef = firebase
    .app()
    .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
    .ref('/'+code+'/callRecord');

  newRef.on('value', function (snapshot) {
    //console.log("[Background] Call log from firebase: ", snapshot.val());
    // Check if the latest log time and phone number are same or not
    AsyncStorage.getItem("myDateTime").then(
      (c) => {
        if (c != snapshot.val()[0].dateTime) {
          AsyncStorage.getItem("myRecord").then(
            (c2) => {
              if (c2 != snapshot.val()[0].phoneNumber) {
                console.log("Call log has changed");
                notiCheck(snapshot.val());
              }
            });
        }
      });
    // Save to local storage for reference
    AsyncStorage.setItem("myRecord", snapshot.val()[0].phoneNumber);
    AsyncStorage.setItem("myDateTime", snapshot.val()[0].dateTime);
  });
}

// -------------------------------------
// Helper functions
// -------------------------------------


const cheerio = require('react-native-cheerio');

// Web-scraping function for call type identification
async function infoScrape(number) {
  const keywords = ['假冒','騙案','詐騙','自稱']

  // Web Scraping
  var type = "Safe";
  //setData("Safe");
  const response = await fetch('https://hkjunkcall.com/?ft='+number);
  const text = await response.text();
  const $ = cheerio.load(text);
  const res = $('meta[property="og:title"]').attr('content');
    
  // Data manipulation & checking
  const resArr = (res.slice(3)).split(" ");
  resArr.forEach(element => {
    keywords.forEach(element2 => {
      if (element.includes(element2)){
        //setData("Malicious");
        type = "Malicious";
      }
    });
  }); 
  console.log(type);
  return type;
}

// Driver function for call checking
async function checkLogNumber(record) {
  var oldRecord = await AsyncStorage.getItem('myRecord');
  var oldDateTime = await AsyncStorage.getItem('myDateTime');
    if ((oldRecord != record[0].phoneNumber) || (oldDateTime != record[0].dateTime)) {
      for (var i=0; i < record.length; i++) {
        if (!record[i].name) {
          // Not in call log
          var data = await infoScrape(record[i].phoneNumber);
          record[i]["callType"] = data;
        }
        else {
          record[i]["callType"] = "In Contact List";
        }
      }
      await AsyncStorage.setItem('myRecord', record[0].phoneNumber);
      await AsyncStorage.setItem('myDateTime', record[0].dateTime);

      console.log("old record not equal to record! ")
      // Record updated, should upload to firebase
      return record;
    } else {
      console.log("old record = record ")
      // No changes, skip this upload
      return null;
    }
}

function pushCallLog(code, record) {
  //console.log('Code: ',code);
  //console.log('Record: ',record);
  var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

  // Push call log
  newRef.set(record);
}


// Delivers notification when called
async function onDisplayNotification() {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Scam Tracker',
    body: '長者最近接到了可疑來電，請提高警覺。',
    android: {
      channelId,
    },
  });
}

// Deliver notifications if needed
function notiCheck(listData) {
  if (listData.length > 3) {
    for (var i=0; i<3; i++) {
      if (listData[i].callType == "Malicious") {
        // Send warning
        console.log("Should send warning.")
        onDisplayNotification();
        break;
      }
    }
  } else {
    for (var i=0; i<listData.length; i++) {
      if (listData[i].callType == "Malicious") {
        // Send warning
        console.log("Should send warning.")
        onDisplayNotification();
        break;
      }
    }
  }
}