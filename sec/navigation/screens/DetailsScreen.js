import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, FlatList, TextInput, TouchableHighlight, Alert} from 'react-native';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsScreen({ navigation }) {
    // Global variables
    var [listData, setListData] = useState([]);
    const [text, onChangeText] = useState(null);
    const cheerio = require('react-native-cheerio');

    var [record, setRecord] = useState([]);
    var [code, setCode] = useState("");
    var [userCode, setUserCode] = useState("");

    var reference2 = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/callRecord');

    let addItem = item => {
      reference2.set(item);
    };

    function getMyCallLog() {
      reference2.on('value', function (snapshot) {
          setListData(snapshot.val()); 
      });
    }

    function getCallLog() {
      newRef.on('value', function (snapshot) {
          setListData(snapshot.val()); 
      });
    }

    function pushCallLog() {
        addItem(record);
        Alert.alert('Item saved successfully');
    };

    function genCode() {
      var text = ""
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      for (var i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      storeCode(text);
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
          setUserCode(value2);  
          } catch (error) {
              // error
          }
          return Promise.resolve();
    }

    // Loading Call Log
    async function loadCallLog() {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    'title': 'Call Log',
                    'message': 'Access your call logs',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            ).then(() => {
                CallLogs.load(10,isDistinct=true).then((c) => setListData(c));
                CallLogs.load(10,isDistinct=true).then((c) => setRecord(c));
            })
        } else {
            console.log("iOS device, no call log available");
        }
    }

    // Web-scraping function for call type identification
    async function infoScrape(number) {
      const keywords = ['假冒','騙案','詐騙','自稱']

      // Web Scraping
      var type = "Safe";
      //setData("Safe");
      const response = await fetch('https://hkjunkcall.com/?ft='+number);
      const text = await response.text();
      const $ = cheerio.load(text);
      const res = $('meta[property="og:title"]').attr('content');
        
      // Data manipulation & checking
      const resArr = (res.slice(3)).split(" ");
      resArr.forEach(element => {
        keywords.forEach(element2 => {
          if (element.includes(element2)){
            //setData("Malicious");
            type = "Malicious";
          }
        });
      }); 
      console.log(type);
      return type;
    }

    // driver function for automatic call checking
    async function checkLogNumber() {
      for (var i=0; i < record.length; i++) {
        if (!record[i].name) {
          // Not in call log
          var data = await infoScrape(record[i].phoneNumber);
          record[i]["callType"] = data;
        }
        else {
          record[i]["callType"] = "In Contact List";
        }
      }
    }

    // Delivers dummy notification when called
    async function onDisplayNotification(number, data) {
      // Create a channel
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: 'Phone Number Checking',
        body: 'The phone number '+number+' is found to be '+data+'.',
        android: {
          channelId,
        },
      });
    }

    // delay helper function
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function onLoad() {
      await loadCallLog();
      await getCode();  
      //checkLogNumber();
      //await delay(2000);
      //await pushCallLog();
    }

    async function checkAndPush() {
      await checkLogNumber();
      pushCallLog();
    }

    // Formatting for call log display
    // render format for Call logs
    const ItemView = ({item}) => {
        return (
          // FlatList Item
          <View style={styles.logStyle}>
            <Text style={styles.textStyle}>
              Name : {item.name ? item.name : 'NA'}
              {'\n'}
              DateTime : {item.dateTime}
              {'\n'}
              Duration : {item.duration}
              {'\n'}
              PhoneNumber : {item.phoneNumber}
              {'\n'}
              Type : {item.type}
              {'\n'}
              CallType : {item.callType}
            </Text>
          </View>
        );
    };

    // Item separator for Call log
    const ItemSeparatorView = () => {
      return (
        // FlatList Item Separator
        <View
          style={{
            height: 5,
            width: '100%',
            //backgroundColor: '#C8C8C8',
          }}
        />
      );
    };
    
    // Automatically load call log when the app is launched
    useEffect (() => {
        onLoad();
    },[]);

    useEffect (() => {
      checkAndPush();
    },[record]);

    //useEffect (() => {
      
    //}, [record])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <SafeAreaView style={{height: '120%' }}>
                
                  <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom:10 }}>Phone Number Checker</Text>
                    {/*<Text>{"\n"}</Text>*/}
                    <TextInput
                      style={styles.input}
                      onChangeText={onChangeText}
                      value={text}
                      placeholder='Enter phone number'
                    />
                    <Button color='tomato' title="Check!" onPress={() => infoScrape(text)} />
                    <Text>{"A notification will be delivered once the checking is done."}</Text>

                    <TouchableHighlight
                      underlayColor="white"
                        onPress={getCallLog}
                    >
                    <Text style={styles.buttonText}>Pull Call Log</Text>
                    </TouchableHighlight>
                    <Text>{"\n"}</Text>

                    <TouchableHighlight
                      underlayColor="white"
                        onPress={checkLogNumber}
                    >
                    <Text style={styles.buttonText}>Check current call log</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      underlayColor="white"
                        onPress={pushCallLog}
                    >
                    <Text style={styles.buttonText}>Manually Push Local call log</Text>
                    </TouchableHighlight>

                    <Text style={{borderBottomColor: 'black', borderBottomWidth: 1, marginBottom:10 }}>{"\n"}</Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom:10 }}>Call log</Text>
                    <FlatList nestedScrollEnabled
                            data={record}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                            //style={{backgroundColor: 'white'}}
                    />
                    <Text>{"\n"}</Text>                
                
            </SafeAreaView>
            
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
    container: {
     flex: 1,
     padding: 10,
     flexDirection: 'column',
     paddingTop: 22,
     //height: '100%',
     width: '100%'
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: '50%',
      width: '100%',
    },
    input: {
      height: 40,
      //margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    textStyle: {
      fontSize: 16,
      marginVertical: 10,
      paddingLeft: 10,
    },
    logStyle: {
      backgroundColor: 'white',
      borderRadius: 20,
    },
    buttonText: {
      fontSize: 18,
      //height: '100%',
      color: '#111',
      alignSelf: 'center'
    }
});