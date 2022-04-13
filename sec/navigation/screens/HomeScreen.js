import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';
import GetLocation from 'react-native-get-location';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';


export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [code, setCode] = useState("");
    var [userCode, setUserCode] = useState("");

    var reference3 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/Location');

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/Location');

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
            setUserCode(value2);
            storeUserCode(value2);
        } catch (error) {
            // error
        }
    }

    async function storeCode(code) {
        try {
            await AsyncStorage.setItem(
                'Code', code
            );
            } catch (error) {
                // Error saving data
            }
    }

    async function storeUserCode(userCode) {
        try {
            await AsyncStorage.setItem(
                'Code2', userCode
            );
            } catch (error) {
                // Error saving data
            }
    }

    async function logPermission() {    
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
          )
        }
    }

    function getLocation() {
        getCode();
        newRef.on('value', function (snapshot) {
            if (snapshot.val() != null) {
                setLat(snapshot.val().latitude);
                setLong(snapshot.val().longitude);
                console.log(snapshot.val());
            } 
        });
    }

    callLocation = async () => {
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
        })
    };

    function onLoad() {
        logPermission();
        getCode();
    }

    // delay helper function
    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect (() => {
        onLoad();
    },[]);

    useEffect (() => {
        callLocation();
        //getLocation();
    },[userCode]);

    return (
        
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            <MapView
                style={styles.map}
                region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
                }}
            >
                
                <Marker
                    coordinate = {{latitude: lat, longitude: long}}
                    title={"Current Location"}
                    description={"Info"}
                />
                
            </MapView>
    

            <Text
                //onPress={() => alert('This is the current location of the Elderly.')}
                onPress={getLocation}//callLocation
                style={{ fontSize: 24, fontWeight: 'bold' }}>UPDATE</Text>
        </View>
    );
}

const styles= StyleSheet.create({
    map: {
        width: '100%',
        height: '95%',
    }

})
