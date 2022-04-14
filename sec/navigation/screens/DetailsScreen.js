import React, {useEffect, useState} from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, FlatList, TextInput, TouchableHighlight } from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CallLogs from 'react-native-call-log';
import { PermissionsAndroid } from 'react-native';


export default function DetailsScreen({ navigation }) {
    // Global variables
    const [text, onChangeText] = useState(null);
    const cheerio = require('react-native-cheerio');

    var [record, setRecord] = useState([]);
    var [code, setCode] = useState(null);
    var [newRecord, setNewRecord] = useState([]);

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+code+'/callRecord');

    function getCallLog() {
      AsyncStorage.getItem("recentLog", (err, item) => {
        if (item != null) {
          // Only update display when changes prominent; avoid flashing
          console.log("loaded from local storage.");
          setRecord(JSON.parse(item));
        }
        else {
          console.log("Need checking first");
          loadCallLog();
        } 
      });
    }

    function genCode() {
      var text = ""
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      for (var i = 0; i < 8; i++)
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
      } catch (error) {
          // error
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

    // Driver function for call checking
    async function checkLogNumber(record) {
      var oldRecord = await AsyncStorage.getItem('myRecord');
      var oldDateTime = await AsyncStorage.getItem('myDateTime');
        if ((oldRecord != record[0].phoneNumber) || (oldDateTime != record[0].dateTime)) {
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
          await AsyncStorage.setItem('myRecord', record[0].phoneNumber);
          await AsyncStorage.setItem('myDateTime', record[0].dateTime);
          // Record updated, should upload to firebase
          return record;
        } else {
          // No changes, skip this upload
          return null;
        }
    }

    function loadCallLog() { 
      // Get permission
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
          )
      }
      // Loading Call Log 
      CallLogs.load(10,isDistinct=true).then((c) => setNewRecord(c));
      checkLogNumber(newRecord).then(
        (c) => {
          if (c != null) {
            // Changes prominent
            console.log("[DetailScreen]: will upload to server", c);
            newRef.set(c);
            // Safe to local storage for read
            AsyncStorage.setItem("recentLog", JSON.stringify(c));
          }
        }
      );
      // Pull edited call log from local storage
      AsyncStorage.getItem("recentLog", (err, item) => {
        if (record != JSON.parse(item)) 
          // Only update display when changes prominent; avoid flashing
          setRecord(JSON.parse(item));
      });
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

    // Render format for Call logs
    const ItemView = ({item}) => {
      if (item.callType == "In Contact List" ) {
        return (
          // FlatList Item
          <View style={styles.contactStyle}>
            <Text style={styles.textStyle}>
              與 {item.name}的通話
              {'\n'}
            </Text>
            <Text style = {styles.typeStyle}>
              通訊錄聯絡人
            </Text>
          </View>
        );
      }else if (item.callType == "Safe" ){
        return (
          // FlatList Item
          <View style={styles.safeStyle}>
            <Text style={styles.textStyle}>
              電話號碼 : {item.phoneNumber}
              {'\n'}
              日期 : {item.dateTime}
              {'\n'}
              類型 : {item.type}
            </Text>
            <Text style = {styles.typeStyle}>
              安全
            </Text>
          </View>
        );

      }else{
        return (
          // FlatList Item
          <View style={styles.mStyle}>
            <Text style={styles.textStyle}>
              電話號碼 : {item.phoneNumber}
              {'\n'}
              日期 : {item.dateTime}
              {'\n'}
              類型 : {item.type}
            </Text>
            <Text style = {styles.typeStyle}>
              可疑電話
            </Text>
          </View>
        );

      }
        
    };

    // Item separator for Call log
    const ItemSeparatorView = () => {
      return (
        // FlatList Item Separator
        <View
          style={{
            height: 5,
            width: '100%',
          }}
        />
      );
    };

    useEffect (() => {
      console.log("[DetailScreen] onLoad triggered.")
      getCode();
    },[]);

    useEffect (() => {
      getCallLog();
      const interval=setInterval(()=>{
        console.log("[DetailScreen] Auto Reload log.")
        getCallLog();
       },10000)
       return()=>clearInterval(interval)
    },[code]);

    return (
        <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20, width: '100%'}}>
            <SafeAreaView style={{height: '105%' }}>
                
                  <Text style={{ position: 'relative', top: 15, fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom:10 }}>查詢電話號碼</Text>
                    <Text></Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChangeText}
                      value={text}
                      placeholder='輸入電話號碼'
                    />
                    <Button color='#266C45' title="查詢" onPress={() => infoScrape(text).then((c) => onDisplayNotification(text, c))} />
                    <Text>{"電話號碼檢查完成後，將會發送通知提供結果。"}</Text>

                    <TouchableHighlight
                      underlayColor="white"
                        onPress={getCallLog}
                    >
                    <Text style={styles.buttonText}>Pull Call Logs</Text>
                    </TouchableHighlight>
              
                    <Text style={{borderBottomColor: 'black', borderBottomWidth: 1, marginBottom:10 }}></Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom:10 }}>通話記錄</Text>
                    <FlatList nestedScrollEnabled
                            data={record}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                    />
                    <Text></Text>                
                
            </SafeAreaView>
            
        </View>
    );
}

const styles = StyleSheet.create({
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
      color: 'black',
      marginVertical: 10,
      paddingLeft: 10,
    },
    contactStyle: {
      backgroundColor: 'lightgreen',
      borderRadius: 20,
    },
    safeStyle: {
      backgroundColor: 'lightyellow',
      borderRadius: 20,
    },
    mStyle: {
      backgroundColor: '#F58B70',
      borderRadius: 20,
    },
    typeStyle: {
      fontSize: 22,
      color: 'black',
      marginVertical: 5,
      paddingRight: 10,
      textAlign: 'right',
    },
    buttonText: {
      fontSize: 18,
      //height: '100%',
      color: '#111',
      alignSelf: 'center'
    }
});