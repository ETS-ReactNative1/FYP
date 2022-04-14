import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableHighlight, StyleSheet, TextInput, Alert } from 'react-native';

import {firebase} from '@react-native-firebase/database';

export default function SettingsScreen({ navigation }) {
    const [inputCode, onChangeText] = React.useState("");
    var [userCode, setUserCode] = useState(" 無");

    var reference1 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/Companion');

    let addItem = item => {
        reference1.set(item);
    };

    const handleSubmit = () => {
        addItem(inputCode);
        setUserCode(inputCode);
        storeUserCode(inputCode);
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

    async function getCode() {
      try {
          var value2 = await AsyncStorage.getItem('Code2');
          if (value2 != null) {
              setUserCode(value2);
          }
      } catch (error) {
          // error
      }
    }

    useEffect (() => {
      console.log("[SettingScreen_c] onLoad triggered.")
      getCode();
    },[]);

    return (
        <View style={styles.main}>
        <Text style={styles.codetitle}> 已連結的代碼: {userCode} </Text>
        <Text style={styles.title}>輸入代碼以連結用戶</Text>

        <TextInput style={styles.itemInput} onChangeText={text => onChangeText(text)} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
            onPress={handleSubmit}
        >
        <Text style={styles.buttonText}>連結用戶</Text>
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
    backgroundColor: '#266C45'
  },
 
  codetitle: {
    top: 0,
    left: 0,
    marginBottom: '30%',
    fontSize: 19,
    textAlign: 'left',
    color: 'white'
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 26,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  itemInput: {
    height: 50,
    padding: 10,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#1D4728'
  },
  buttonText: {
    fontSize: 20,
    color: '#1D4728',
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