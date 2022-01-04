import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const DashBoard = () => {
    dologout = () => {
        AsyncStorage.removeItem("token")
        .then(
            res => {
                this.props.navigation.navigate("Auth");
            }
        )
    }
    
        return (
            <View style = {styles.container}>
                <Text style = {styles.text}>
                    Hey User
                </Text>
                <TouchableOpacity style = {styles.logoutBtn} onPress = {() => {
                    this.dologout();
                }}>
                    <Text style = {styles.btnText}>
                        LogOut
                    </Text>
                </TouchableOpacity>
            </View>
        )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        fontSize: 25,
        fontWeight: 'bold'
    },

    logoutBtn: {
        marginTop: 10,
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 10

    },

    btnText: {
        color: 'white'
    }
})

export default DashBoard;

