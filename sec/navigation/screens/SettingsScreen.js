import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


import messaging from '@react-native-firebase/messaging';
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert,
  Button
} from 'react-native';

import {firebase} from '@react-native-firebase/database';

export default function SettingsScreen({ navigation }) {
    const [inputCode, onChangeText] = React.useState("");
    var [code, setCode] = useState("none");
    var [userCode, getUserCode] = useState("");

    var reference1 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/testingText');

    let addItem = item => {
        reference1.set(item);
    };

    const  handleSubmit = () => {
        addItem(inputCode);
        getUserCode(inputCode);
        storeUserCode(inputCode)
        Alert.alert('Item saved successfully');
    };
 
    async function storeUserCode(userCode) {
        try {
            await AsyncStorage.setItem(
                'Code2', userCode
            );
            } catch (error) {
                // Error saving data
            }
    }

    async function storeCode(code) {
      try {
          await AsyncStorage.setItem(
              'Code', code
          );
          } catch (error) {
              // Error saving data
          }
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

            var value2 = await AsyncStorage.getItem('Code2');
            if (value2 == null) {
              value2 = value;
            }
            getUserCode(value2);
            } catch (error) {
                // Error
            }
    }

    function genCode() {
        var text = ""
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        storeCode(text);
    }

    // Automatically check for pairing code when the app is launched
    useEffect (() => {
        getCode();
    },[]);

    return (
        <View style={styles.main}>
        <Text style={styles.codetitle0}> My User Code: {code} </Text>
        <Text style={styles.codetitle}> My Parent Code: {userCode} </Text>
        <Text style={styles.title}>Add Parent Code</Text>

        <TextInput style={styles.itemInput} onChangeText={text => onChangeText(text)} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
            onPress={handleSubmit}
        >
        <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    //justifyContent: 'center',
    backgroundColor: '#6565fc'
  },
  codetitle0: {
    top: 0,
    left: 0,
    marginBottom: 5,
    fontSize: 18,
    textAlign: 'left',
    color: 'lightgrey'
  },
  codetitle: {
    top: 0,
    left: 0,
    marginBottom: '30%',
    fontSize: 18,
    textAlign: 'left',
    color: 'lightgrey'
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontStyle: 'bold'
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});