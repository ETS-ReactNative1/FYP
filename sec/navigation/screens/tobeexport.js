import * as React from 'react';
import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, 
    StyleSheet, Button, FlatList, TextInput, TouchableHighlight, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';
import GetLocation from 'react-native-get-location';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';

export function uploadMap() {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [code, setCode] = useState("");
    var [userCode, getUserCode] = useState("");

    var reference3 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/Location');

    try {
        var value = await AsyncStorage.getItem('Code');
        if (value == null) {
            // No code yet, generate a code
            //gen code
            var text = ""
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            //store code
            try {
                await AsyncStorage.setItem(
                    'Code', text
                );
            } catch (error) {
                // Error saving data
            }
        }
        // Always try to display a code
        value = await AsyncStorage.getItem('Code');
        setCode(value);
        var value2 = await AsyncStorage.getItem('Code2');
        if (value2 == null) {
            value2 = value;
        }
        getUserCode(value2);  
    } catch (error) {
        // error
    }

    //call location 
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location => {
        setLat(location.latitude);
        setLong(location.longitude);
        reference3.set(location);
        console.log(lat, long);
    })
    .catch(error => {
        const { code, message } = error;
        //console.warn(code, message);
    })


    return (null);
}

export function downloadMap() {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [code, setCode] = useState("");
    var [userCode, getUserCode] = useState("");

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/Location');

    try {
        var value = await AsyncStorage.getItem('Code');
        if (value == null) {
            // No code yet, generate a code
            //gen code
            var text = ""
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            //store code
            try {
                await AsyncStorage.setItem(
                    'Code', text
                );
            } catch (error) {
                // Error saving data
            }
        }
        // Always try to display a code
        value = await AsyncStorage.getItem('Code');
        setCode(value);
        var value2 = await AsyncStorage.getItem('Code2');
        if (value2 == null) {
            value2 = value;
        }
        getUserCode(value2);  
    } catch (error) {
        // error
    }

    //get location 
    newRef.on('value', function (snapshot) {
        setLong(snapshot.val().longitude);
        setLat(snapshot.val().latitude);
        console.log(snapshot.val());
    });


    return (null);
}





//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




export function uploadLogs() {
    // Global variables
    var [listData, setListData] = useState([]);
    const [text, onChangeText] = useState(null);
    const cheerio = require('react-native-cheerio');

    var [record, setRecord] = useState([]);
    var [code, setCode] = useState("");
    var [userCode, getUserCode] = useState("");

    var reference2 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/callRecord');

    let addItem = item => {
      reference2.set(item);
    };

    function getMyCallLog() {
      reference2.on('value', function (snapshot) {
          setListData(snapshot.val()); 
      });
    }

    function getCallLog() {
      newRef.on('value', function (snapshot) {
          setListData(snapshot.val()); 
      });
    }

    async function pushCallLog() {
        addItem(record);
        Alert.alert('Item saved successfully');
    };

    function genCode() {
      var text = ""
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      for (var i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      storeCode(text);
    }

    async function getCode() {
      try {
          var value = await AsyncStorage.getItem('Code');
          if (value == null) {
              // No code yet, generate a code
              genCode();
          }
          // Always try to display a code
          value = await AsyncStorage.getItem('Code');
          setCode(value);
          var value2 = await AsyncStorage.getItem('Code2');
          if (value2 == null) {
            value2 = value;
          }
          getUserCode(value2);  
          } catch (error) {
              // error
          }
    }

    // Loading Call Log
    async function loadCallLog() {
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
                CallLogs.load(10,isDistinct=true).then((c) => setListData(c));
                CallLogs.load(10,isDistinct=true).then((c) => setRecord(c));
            })
        } else {
            console.log("iOS device, no call log available");
        }
    }

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

    // driver function for automatic call checking
    async function checkLogNumber() {
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
    }

    // Delivers dummy notification when called
    async function onDisplayNotification(number, data) {
      // Create a channel
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: 'Phone Number Checking',
        body: 'The phone number '+number+' is found to be '+data+'.',
        android: {
          channelId,
        },
      });
    }

    // delay helper function
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function onLoad() {
        await loadCallLog();
        await getCode();
        await checkLogNumber();
        await delay(2000);
        pushCallLog();
    }

    // Formatting for call log display
    // render format for Call logs
    const ItemView = ({item}) => {
        return (
          // FlatList Item
          <View style={styles.logStyle}>
            <Text style={styles.textStyle}>
              Name : {item.name ? item.name : 'NA'}
              {'\n'}
              DateTime : {item.dateTime}
              {'\n'}
              Duration : {item.duration}
              {'\n'}
              PhoneNumber : {item.phoneNumber}
              {'\n'}
              Type : {item.type}
              {'\n'}
              CallType : {item.callType}
            </Text>
          </View>
        );
    };

    // Item separator for Call log
    const ItemSeparatorView = () => {
      return (
        // FlatList Item Separator
        <View
          style={{
            height: 5,
            width: '100%',
            //backgroundColor: '#C8C8C8',
          }}
        />
      );
    };
    
    // Automatically load call log when the app is launched
    useEffect (() => {
        onLoad();
    },[]);

    return (null);
}


