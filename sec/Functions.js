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

export default function uploadMap(code) {
    var lat = 0;
    var long = 0; 


    var reference3 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/Location');


    //call location 
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location => {
        lat = location.latitude;
        long = location.longitude;
        console.log(lat, long);
        reference3.set(location);
    })
    .catch(error => {
        //const { code, message } = error;
        //console.warn(code, message);
    })

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

// driver function for automatic call checking
async function checkLogNumber(record) {
  var oldRecord = await AsyncStorage.getItem('myRecord');
    if (oldRecord != record[0].phoneNumber) {
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
      await AsyncStorage.setItem(
        'myRecord', record[0].phoneNumber
      );
      console.log("old record not equal to record! ")
      return record;

    } else{
      console.log("old record = record ")
      return null;
    }
}

function pushCallLog(code, record) {
  console.log('Code: ',code);
  console.log('Record: ',record);
  var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

  // Push call log
  newRef.set(record);
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

// Unfinished
export function downloadLog(code) {
    var listData = [];

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

    newRef.on('value', function (snapshot) {
      console.log(snapshot.val());
      listData = snapshot.val(); 
    });
}