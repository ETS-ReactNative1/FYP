import React, {useEffect, useState} from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, FlatList, TextInput, TouchableHighlight } from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {firebase} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsScreen({ navigation }) {
    // Global variables
    const [text, onChangeText] = useState(null);
    const cheerio = require('react-native-cheerio');

    var [record, setRecord] = useState([]);
    var [code, setCode] = useState("");
    var [userCode, setUserCode] = useState("");

    var newRef = firebase
      .app()
      .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
      .ref('/'+userCode+'/callRecord');

    function getCallLog() {
      console.log('[DetailScreen] Code & userCode: ', code, userCode);
      newRef.on('value', function (snapshot) {
          setRecord(snapshot.val()); 
      });
    }

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
      const interval=setInterval(()=>{
        console.log("[DetailScreen] Auto Reload Code.")
        getCode();
       },10000)
         
       return()=>clearInterval(interval)
    },[]);

    useEffect (() => {
      getCallLog();
      const interval=setInterval(()=>{
        console.log("[DetailScreen] Auto Reload log.")
        getCallLog();
       },10000)
         
       return()=>clearInterval(interval)
    }, [userCode])

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