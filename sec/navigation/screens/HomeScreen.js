import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';


export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [code, setCode] = useState(null);

    function genCode() {
        var text = ""
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for (var i = 0; i < 8; i++)
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

    function callLocation() {
        //call location 
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location2 => {
            setLat(location2.latitude);
            setLong(location2.longitude);
            console.log("[HomeScreen] Location get.")
            AsyncStorage.setItem("recentLocation", JSON.stringify(location2));
        })
        .catch(error => {
            console.log(error);
        }) 
    }

    function onLoad() {
        console.log("[HomeScreen] onLoad triggered.")
        //logPermission();
        getCode();
    }

    useEffect (() => {
        onLoad();
    },[]);

    useEffect (() => {
        callLocation();
        const interval=setInterval(()=>{
            console.log("[HomeScreen] Auto Reload location.")
            callLocation();
           },5000)
             
           return()=>clearInterval(interval)
    },[code]);

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
                    title={"目前位置"}
                    description={"已連線用戶的位置"}
                />
            </MapView>
        </View>
    );
}

const styles= StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    }

})
