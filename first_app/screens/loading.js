import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

class Loading extends React.Component {

    constructor() {
        super();
        this.checkToken();
    }

    checkToken = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            this.props.navigation.navigate("App")
        }
    }
    render() {
        return (
            <View style = {styles.container}>
               <ActivityIndicator animating = {true} size="large" color="#0000ff"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loading;

