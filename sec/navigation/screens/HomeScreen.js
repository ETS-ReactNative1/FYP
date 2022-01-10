import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 22.28312,    //location of HKU CB313
                longitude: 114.13592,  //change this location if have time
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
                }}
            >
                <Marker
                    coordinate={{ latitude : 22.28312 , longitude : 114.13592 }} //change this location if have time
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
