import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';

export default function HomeScreen({ navigation }) {
    state={
        location: {},
        errorMessage:''

    };
    componentWillMount=()=>{
        this._getLocation();
    }

    _getLocation = async()=>{
        const {status} = await Permissions.askAsync(permissions.Location);

        if (status !== 'granted'){
            console.log('No permission of getting location');

            this.setState({
                errorMessage: 'Permission not granted'
            })
        }
        const userLocation = await Location.getCurrentPositionAsync();
        this.setState({
            location: userLocation
        })
    }
    
    {/*constructor(props){
        super(props);
        this.stats = {
            latitude: 22.3,
            longitude: 114.1,
            error: null
        };
    }
    componentDidMount(){
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
            });
        }, 
        error => this.setState({error: error.message}),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000}
        );
    }*/}

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 22.28312,    //location of HKU CB313
                longitude: 114.13592,  //change this location using state.location after present
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
                }}
            >
                
                <Marker
                    coordinate = {{latitude: 22.28312,longitude: 114.13592}} //change this location using state.location after present
                    title={"Current Location"}
                    description={"Info"}
                />
                
            </MapView>
    

            <Text
                onPress={() => alert('This is the current location of the Elderly.')}
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
