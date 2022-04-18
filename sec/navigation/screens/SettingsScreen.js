import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Alert } from 'react-native';

import {firebase} from '@react-native-firebase/database';

export default function SettingsScreen({ navigation }) {
    var [code, setCode] = useState(null);

    var reference1 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/testingText');

    let addItem = item => {
        reference1.set(item);
    };

    const handleSubmit = () => {
        addItem(inputCode);
        setUserCode(inputCode);
        storeUserCode(inputCode)
        Alert.alert('已儲存用戶代碼');
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
      } catch (error) {
          // error
      }
    }

    function genCode() {
        var text = ""
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
        
        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        storeCode(text);
    }

    useEffect (() => {
      console.log("[SettingScreen] onLoad triggered.")
      getCode();
    },[]);

    return (
        <View style={styles.main}>
        <Text style={styles.mainAPP1}> 用戶代碼 </Text>
        <Text style={styles.mainAPP2}> {code} </Text>
        <Text style={styles.lowerTest}>使用輔助程式輸入此代碼以追蹤用戶的動態</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    //justifyContent: 'center',
    backgroundColor: '#266C45'
  },
  codetitle0: {
    top: 0,
    left: 0,
    marginBottom: 5,
    fontSize: 18,
    textAlign: 'left',
    color: 'lightgrey'
  },
  mainAPP1: {
    marginTop: '35%',
    fontSize: 35,
    textAlign: 'center',
    color: 'lightgrey'
  },
  mainAPP2: {
    marginTop: '5%',
    fontSize: 45,
    textAlign: 'center',
    color: '#1D4728',
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'lightgrey',
  },
  
  lowerTest: {
    top: '2%',
    fontSize: 17,
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
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#266C45'
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