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

    function getCallLog() {
      newRef.on('value', function (snapshot) {
          setRecord(snapshot.val()); 
      });
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
      if (data == "Malicious") {
        data = "可疑來電"
      }
      else {
        data = "安全來電"
      }
  
      // Display a notification
      await notifee.displayNotification({
        title: '電話號碼查詢',
        body: '電話號碼 '+number+' 已驗證為'+data+'。',
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
            <Text style={styles.safetextStyle}>
              與 {item.name}的通話
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
            height: '1%',
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
                
                  <Text style={{ position: 'relative', top: '2%', height: '7%', fontSize: 26, fontWeight: 'bold', color: '#282828'}}>查詢電話號碼</Text>
                    <Text></Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChangeText}
                      value={text}
                      placeholder='輸入電話號碼'
                    />
                    <Button color='#266C45' title="查詢" onPress={() => infoScrape(text).then((c) => onDisplayNotification(text, c))} />
                    <Text style={{marginTop: '1%', height: '3%' }}>{"電話號碼檢查完成後，將會發送通知提供結果。"}</Text>
              
                    <Text style={{borderBottomColor: 'black', borderBottomWidth: 1, marginBottom:'2%', height:'3%' }}></Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom: '2%', height: '6%' }}>通話記錄</Text>
                    <FlatList nestedScrollEnabled
                            data={record}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: '15%'}}
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
    height: '8%',
    borderWidth: 1,
    padding: 10,
  },
  textStyle: {
    fontSize: 17,
    color: 'black',
    marginVertical: 10,
    paddingLeft: 12,
  },
  safetextStyle: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    marginBottom: 14,
    paddingLeft: 12,
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
    marginBottom: 6,
    paddingRight: 15,
    textAlign: 'right',
  },
  buttonText: {
    fontSize: 18,
    //height: '100%',
    color: '#111',
    alignSelf: 'center'
  }
});