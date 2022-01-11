import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, FlatList, TextInput} from 'react-native';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';

export default function DetailsScreen({ navigation }) {
    // Global variables
    const [data, setData] = useState("loading");
    const [arr, setArr] = useState([]);
    const [listData, setListData] = useState([]);
    const [text, onChangeText] = useState(null);

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

    // Item separator for Call log
    const ItemSeparatorView = () => {
      return (
        // FlatList Item Separator
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#C8C8C8',
          }}
        />
      );
    };
    
    // Automatically load call log when the app is launched
    useEffect (() => {
        loadCallLog();
    },[]);

    // Web-scraping function for call type identification
    async function infoScrape(number) {
        const cheerio = require('react-native-cheerio');
        const keywords = ['假冒','騙案','詐騙','自稱']

        // Web Scraping
        setData("loading");
        const response = await fetch('https://hkjunkcall.com/?ft='+number);
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
        if (data == "loading") {
          setData("Safe");
        } 
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
          title: 'Test Notification',
          body: 'Main body content of the notification',
          android: {
            channelId,
          },
        });
      }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', }}>
            <SafeAreaView>
                <ScrollView style={{flex: 1}}>
                  <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Test Functions</Text>
                    <Text>{"\n"}</Text>
                    <Button title="Test Notification" onPress={() => onDisplayNotification()} />
                    <Text>{"\n"}</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChangeText}
                      value={text}
                      placeholder='Enter phone number'
                    />
                    <Button title="Test scraping" onPress={() => infoScrape(text)} />
                    
                    <Text>
                      {"Call type: "+data}
                      {"\n"}{"\n"}
                      {"Info scraped:"}
                    </Text>
                    <FlatList nestedScrollEnabled
                            data={arr}
                            renderItem={({item}) => <Text>{item}</Text>}
                    />
                    <Text>{"\n"}</Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Call log</Text>
                    <FlatList nestedScrollEnabled
                            data={listData}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                    />
                    <Text>{"\n"}</Text>
                    <Text onPress={() => navigation.navigate('Home')}> Return to Home Page </Text>
                </ScrollView>
                
            </SafeAreaView>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     padding: 10,
     paddingTop: 22,
     width: '100%'
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
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
    },
});