import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)
    var [userCode, setUserCode] = useState(null);

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/Location');

    async function getCode() {
        try {
            var value2 = await AsyncStorage.getItem('Code2');
            if (value2 != null) {
                setUserCode(value2);
            }
        } catch (error) {
            // error
        }
    }

    function getLocation() {
        newRef.on('value', function (snapshot) {
            console.log("[HomeScreen_c] Location updated.");
            if (snapshot.val() != null) {
                setLat(snapshot.val().latitude);
                setLong(snapshot.val().longitude);
            } 
        });
    }

    function onLoad() {
        console.log("[HomeScreen_c] onLoad triggered.")
        getCode();
    }

    function onLoad2() {
        getCode();
        getLocation();
    }

    useEffect (() => {
        onLoad();
        const interval=setInterval(()=>{
            console.log("[HomeScreen_c] Auto Reload Code.")
            getCode();
           },5000)
             
           return()=>clearInterval(interval)
    },[]);

    useEffect (() => {
        getLocation();
        const interval=setInterval(()=>{
            console.log("[HomeScreen_c] Auto Reload location.")
            getLocation();
           },5000)
             
           return()=>clearInterval(interval)
    },[userCode]);

    return (
        
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            <MapView
                style={styles.map}
                region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.0007,
                longitudeDelta: 0.0007,
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
