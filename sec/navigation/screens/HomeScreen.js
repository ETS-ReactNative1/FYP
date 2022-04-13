import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';


export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [userCode, setUserCode] = useState("");

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/Location');

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
        //getCode();
        console.log("[HomeScreen] userCode:", userCode);
        newRef.on('value', function (snapshot) {
            console.log("[HomeScreen] snapshot.val(): ", snapshot.val());
            if (snapshot.val() != null) {
                setLat(snapshot.val().latitude);
                setLong(snapshot.val().longitude);
                console.log("[HomeScreen]: ",snapshot.val());
            } 
        });
    }

    function onLoad() {
        logPermission();
        getCode();
    }

    function onLoad2() {
        getCode();
        getLocation();
    }

    useEffect (() => {
        onLoad();
    },[]);

    useEffect (() => {
        //callLocation();
        onLoad2();
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
                    title={"目前位置"}
                    description={"已連線用戶的位置"}
                />
            </MapView>

            <Text
                onPress={onLoad2} //callLocation
                style={{ fontSize: 24, fontWeight: 'bold' }}>更新位置</Text>
        </View>
    );
}

const styles= StyleSheet.create({
    map: {
        width: '100%',
        height: '95%',
    }

})
