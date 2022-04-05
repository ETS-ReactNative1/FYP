import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';

import GetLocation from 'react-native-get-location';

export default function HomeScreen({ navigation }) {
    var [lat, setLat] = useState(0)
    var [long, setLong] = useState(0)

    const callLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location => {
            setLat(location.latitude);
            setLong(location.longitude);
            console.log(lat, long);
        })
        .catch(error => {
            const { code, message } = error;
            //console.warn(code, message);
        })
    };

    useEffect (() => {
        callLocation();
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
