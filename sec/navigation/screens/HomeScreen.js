import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';
import GetLocation from 'react-native-get-location';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [code, setCode] = useState("");

    var reference3 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/Location');

    let addItem = item => {
      reference3.set(item);
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
            } catch (error) {
                // error
            }
    }

    async function onLoad() {
        await getCode();
        callLocation();
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
            //console.warn(code, message);
        })
    };

    useEffect (() => {
        //callLocation();
        onLoad();
    },[]);

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
                onPress={callLocation}
                style={{ fontSize: 24, fontWeight: 'bold' }}>Current Location</Text>
        </View>
    );
}

const styles= StyleSheet.create({
    map: {
        width: '100%',
        height: '95%',
    }

})
