import React, { useState } from 'react';
import { View, Text, TextInput,Image, Alert, StyleSheet, ImageBackground, TouchableOpacity, Touchable, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { withSpring } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Login = ({ navigation }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {

        if (username && password) {
            axios.post('http://10.0.2.2:3002/login', {
                username: username,
                password: password,
            }).then((response) => {

                var res = JSON.parse(JSON.stringify(response.data))

                if (res.length == 0) {
                    // console.warn('heree')

                    //show error alert
                    Alert.alert(
                        "Invalid username",
                        "Please check your username for errors",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                }
                else {
                    // merge with Saharsh code
                    
                    // console.warn(res)
                   
                    //navigation.navigate('homescreen', {id: res[0].id, name: res[0].username})

                }
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
            <Image source={require('./images/logo.png')}  />
            </View>
            <ImageBackground source={require('./images/sporcial.png')} style={styles.image}>
                <Text style={styles.sporcial_txt}>
                    Sporcial
                </Text>
                <Text style={styles.bttgt}>
                    Better Together
                </Text>

                <View style={styles.formRow}>
                    <TextInput value={username} onChangeText={(value) => setUsername(value)} style={styles.textInput} placeholder='Enter username'
                        placeholderTextColor='#333' />
                </View>

                <View style={styles.formRow}>
                    <TextInput value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput} placeholder='Enter password'
                        secureTextEntry={true} placeholderTextColor='#333' />
                </View>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: 'red' }]} onPress={() => {
                    // login()
                    navigation.navigate('homescreen')
                }}>
                    <Text style={styles.btnText}>
                        Log in
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('signUpScreen')}>
                    <Text style={styles.signup_txt}>Don't have an Account? Sign up here</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: 'red',
        height: hp('9%'),
        width: '100%'
    },
    sporcial_txt: {
        fontSize: 50,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'red',
        textShadowColor: 'black', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 12,
        alignSelf: 'center',
        marginTop: hp('33%'),
        marginBottom: 0,
        fontWeight: 'bold'
      },
    bttgt: {
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'red',
        textShadowColor: '#3F3F3F', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 4,
        marginLeft: hp('20%'),
        marginTop: -hp('2%'),
        marginBottom: hp('10%'),
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    textInput: {
        backgroundColor: "#ddd",
        top: 10,
        paddingTop: 10

    },

    formRow: {
        width: wp('80%'),
        alignSelf: 'center',
        marginBottom: hp('1%')

    },

    image: {
        flex: 1,
        justifyContent: "center",
        width: '100%',
        height: '100%'
    },

    loginBtn: {
        backgroundColor: 'red',
        height: hp('7%'),
        justifyContent: 'center',
        marginTop: hp('3%'),
        width: wp('55%'),
        alignSelf: 'center'
    },

    btnText: {
        textAlign: 'center',
        color: 'white'
    },
    signup_txt: {
        color: 'white',
        fontSize: hp('2.4%'),
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: hp('2%'),
        textDecorationLine: 'underline',
        marginBottom: hp('20%')


    }

})

export default Login;