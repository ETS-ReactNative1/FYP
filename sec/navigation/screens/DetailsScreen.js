import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, FlatList, TextInput} from 'react-native';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidImportance} from '@notifee/react-native';
/*
//init
import {initializeApp} from 'firebase/app';
import {} from 'firebase/firestore';
FirebaseFirestore db = FirebaseFirestore.getInstance();
//write
DatabaseReference myRef = database.getReference("message");
myRef.setValue("Hello, World!");
//Read from the database
myRef.addValueEventListener(new ValueEventListener() {
  @Override
  public void onDataChange(DataSnapshot dataSnapshot) {
      // This method is called once with the initial value and again
      // whenever data at this location is updated.
      String value = dataSnapshot.getValue(String.class);
      Log.d(TAG, "Value is: " + value);
  }
  @Override
  public void onCancelled(DatabaseError error) {
      // Failed to read value
      Log.w(TAG, "Failed to read value.", error.toException());
  }
});
//end~~~~~~~~~~~~~~~~~~~~
*/


export default function DetailsScreen({ navigation }) {
    // Global variables
    const [data, setData] = useState("loading");
    const [arr, setArr] = useState([]);
    const [listData, setListData] = useState([]);
    const [text, onChangeText] = useState(null);
    const cheerio = require('react-native-cheerio');

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
            })
        } else {
            console.log("iOS device, no call log available");
        }
    }

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
        loadCallLog();
    },[]);

    // Web-scraping function for call type identification
    async function infoScrape(number) {
        const keywords = ['假冒','騙案','詐騙','自稱']

        // Web Scraping
        setData("loading");
        const response = await fetch('https://hkjunkcall.com/?ft='+number);
        const text = await response.text();
        const $ = cheerio.load(text);
        const res = $('meta[property="og:title"]').attr('content');
        var type = 'unidentified';
          
        // Data manipulation & checking
        const resArr = (res.slice(3)).split(" ");
        resArr.forEach(element => {
          keywords.forEach(element2 => {
            if (element.includes(element2)){
              //setData("Malicious");
              type = 'Malicious';
            }
          });
        }); 
        if (data == "loading") {
          //setData("Safe");
          type = 'Safe';
      }

      // Deliver notification
      onDisplayNotification(number, type);
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

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', }}>
            <SafeAreaView>
                
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
                    <Text style={{borderBottomColor: 'black', borderBottomWidth: 1, marginBottom:10 }}>{"\n"}</Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#282828', marginBottom:10 }}>Call log</Text>
                    <FlatList nestedScrollEnabled
                            data={listData}
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
      paddingLeft: 10,
    },
    logStyle: {
      backgroundColor: 'white',
      borderRadius: 20,
    }
});