import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Location, Permissions} from 'expo';
import { Component } from 'react/cjs/react.production.min';

import GetLocation from 'react-native-get-location';

export default function HomeScreen({ navigation }) {
    const callLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location => {
            //state.location.latitude = location.latitude;
            //state.location.longitude = location.longitude;
            state.location = location;
            console.log("Hello there, location: ", location);
            console.log("State location: ", state);
            console.log(state.location.latitude, state.location.longitude);
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    };
    state={
        location: {latitude: 22.3, longitude: 114.1, latitudeDelta: 0.0, longitudeDelta: 0.0,},
        errorMessage:''
    };




    {/*
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
*/}

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
                //region={this.state.location}
                initialRegion={{
                latitude: 22.28312,
                longitude: 114.13592,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
                }}
            //    initialRegion={{
            //    latitude: this.state.location.latitude,//22.28312,    //location of HKU CB313
            //    longitude: this.state.location.longitude,//114.13592,  //change this location using state.location after present
            //    latitudeDelta: 0.0,
            //    longitudeDelta: 0.0,
            //    }}
            >
                
                <Marker
                    coordinate = {{latitude: 22.28312, longitude: 114.13592}} //change this location using state.location after present
                    //coordinate = {{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
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
        height: '80%',//95
    }

})
