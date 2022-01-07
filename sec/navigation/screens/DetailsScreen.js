import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, FlatList} from 'react-native';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';

export default function DetailsScreen({ navigation }) {
    // Global variables
    const [data, setData] = useState("Normal");
    const [arr, setArr] = useState([]);
    const [listData, setListData] = useState([]);

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
                CallLogs.loadAll().then((c) => setListData(c));
            })
        } else {
            console.log("iOS device, no call log available");
        }
    }

    // render format for Call logs
    const ItemView = ({item}) => {
        return (
          // FlatList Item
          <View>
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
            </Text>
          </View>
        );
    };
    
    // Automatically load call log when the app is launched
    useEffect (() => {
        loadCallLog();
    },[]);

    // Web-scraping function for call type identification
    async function infoScrape() {
        const cheerio = require('react-native-cheerio');
        const keywords = ['假冒','騙案','詐騙','自稱','+']

        // Web Scraping
        const response = await fetch('https://hkjunkcall.com/?ft=94097792');
        const text = await response.text();
        const $ = cheerio.load(text);
        const res = $('meta[property="og:title"]').attr('content');
        
        // Data manipulation & checking
        const resArr = (res.slice(3)).split(" ");
        setArr(resArr);
        resArr.forEach(element => {
          keywords.forEach(element2 => {
            if (element.includes(element2)){
              setData("Malicious");
            }
          });
        });  
    }

    // Delivers dummy notification when called
    async function onDisplayNotification() {
        // Create a channel
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: 'Notification Title',
          body: 'Main body content of the notification',
          android: {
            channelId,
          },
        });
      }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SafeAreaView>
                <Button title="Display Notification" onPress={() => onDisplayNotification()} />
                <Button title="Test scraping" onPress={() => infoScrape()} />
                <Text
                    style={{ fontSize: 26, fontWeight: 'bold' }}>Welcome to Call log!</Text>
                <ScrollView style={{flex: 1}}>
                    <Text>
                    {"\n"}
                        FlyJJ will do this part :) 
                        {"\n"}
                    {"\n"}
                    </Text>
                    <Text>{data}</Text>
                    <FlatList nestedScrollEnabled
                            data={arr}
                            renderItem={({item}) => <Text>{item}</Text>}
                    />
                    <Text nestedScrollEnabled>{"\n"}</Text>
                    <FlatList nestedScrollEnabled
                            data={listData}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                    />
                    <Text onPress={() => navigation.navigate('Home')}> [Return to Home Page] </Text>
                </ScrollView>
                
            </SafeAreaView>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
});