import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Touchable, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';

const SignUp = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const register = () => {

        if (username && password) {
            axios.post('http://10.0.2.2:3002/register', {
                username: username,
                password: password,
            }).then((response) => {
                console.log('hi')
                console.log(JSON.stringify(response.data));
            }).catch((err) => {
                console.log('error: ', err)
            })

        }

        else {
            // console.warn('pls dont leave username and password blank')
        }

    }
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress = {() => navigation.navigate('loginScreen')}>
                <Icon name= 'arrow-left' style = {styles.arrow} />
                </TouchableOpacity>
                <Image source={require('./images/logo.png')} />
            </View>

            <Text style = {styles.swoop_txt}>SWOOP IN!</Text>

            <View style = {styles.form}>

                <View style={styles.formRow}>
                    <TextInput value={username} onChangeText={(value) => setUsername(value)} style={styles.textInput} placeholder='Enter username'
                        placeholderTextColor='#333' />
                </View>

                <View style={styles.formRow}>
                    <TextInput value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput} placeholder='Enter email address'
                        secureTextEntry={true} placeholderTextColor='#333' />
                </View>

                <View style={styles.formRow}>
                    <TextInput value={username} onChangeText={(value) => setUsername(value)} style={styles.textInput} placeholder='Enter password'
                        placeholderTextColor='#333' />
                </View>

                <View style={styles.formRow}>
                    <TextInput value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput} placeholder='Re-enter password'
                        secureTextEntry={true} placeholderTextColor='#333' />
                </View>

                <TouchableOpacity style={styles.signupBtn} onPress={() => {
                    register()
                }}>
                    <Text style={styles.btnText}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'

    },
    header: {
        backgroundColor: 'red',
        height: hp('9%'),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrow: {
        color: 'white',
        fontSize: hp('4%'),
        marginHorizontal: wp('3%')
    },

    form: {
        marginTop: hp('5%')
    },
    swoop_txt: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: hp('10%'),


    },
    textInput: {
        backgroundColor: "peachpuff",
        // top: 10,
        // paddingTop: 10
        paddingLeft: 20,
        height: hp('7%'),
        width: wp('70%'),
        borderRadius: hp('3%')

    },

    formRow: {
        height: hp('9%')

    },

    signupBtn: {
        backgroundColor: 'red',
        width: wp('30%'),
        height: hp('6%'),
        borderRadius: hp('3%'),
        justifyContent: 'center',
        marginTop: hp('3%'),
        alignSelf: 'center'
    },

    btnText: {
        textAlign: 'center',
        color: 'white'
    }

})

export default SignUp;