import React, { useState } from 'react';
import { View, ScrollView, Linking, Text, TextInput, Image, StyleSheet, TouchableOpacity, Touchable, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';


const MyEvents = ({navigation, route}) => {

    const userId = navigation.state.params.userid
    const events = navigation.state.params.allEvents
    console.log(events)
    // console.log(events)
    

    const [eventsJoined, setEventsJoined] = useState(false)
    const [eventsHosted, setEventsHosted] = useState(true)
    const[eventData, setEventData] = useState(events)

    const setEventBtn = (command) => {
        if (command == 'join') {
            setEventsHosted(false)
            setEventsJoined(true)

            //add events to this
            setEventData(events)
        }
        else{
            setEventsHosted(true)
            setEventsJoined(false)

            setEventData(events)

        //     axios.post('http://10.0.2.2:3002/show-hostevents', {userID: id}).then((response) => {

        //         var res = JSON.parse(JSON.stringify(response.data))

        //         if (res == 'no') {

        //         }
        //         else {
        //             console.warn(res)
        //             setEventData(res)
        //         }

        //         console.warn(res)
               
        //     }).catch((err) => {
        //         console.log('error: ', err)
        //     })
        }

    }

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const sendWhatsappMsg = (number) => {
        let url = "whatsapp://send?text=" +
          'Hello Host' +
          "&phone=852" +
          number;
        Linking.openURL(url)
          .then(data => {
            console.log("WhatsApp Opened successfully " + data);  //<---Success
          })
          .catch(() => {
            alert("Make sure WhatsApp installed on your device");  //<---Error
          });
    }

    return(
        <ScrollView >
        <View style={styles.header}>
                <TouchableOpacity onPress = {() => navigation.navigate('joinscreen')}>
                <Icon name= 'arrow-left' style = {styles.arrow} />
                </TouchableOpacity>
                <Image source={require('./images/logo.png')} />
                <TouchableOpacity onPress = {() => navigation.navigate('loginScreen')} >
                {/* <Icon name= 'bars' style = {styles.arrow}/> */}
                <Text style = {{color: 'white', marginLeft: wp('50%'), fontSize: hp('3%')}}>Logout</Text>
                </TouchableOpacity>
                <Provider>
                  <View
                    style={{
                      paddingTop: 50,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Menu
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={<TouchableOpacity onPress = {openMenu} >
                      <Icon name= 'bars' style = {styles.arrow}/>
                      </TouchableOpacity>}>
                      <Menu.Item onPress={() => {}} title="My Events" />
                      <Menu.Item onPress={() => {}} title="Log Out" />
                    </Menu>
                  </View>
                </Provider> 
            </View>
            <View style = {{flexDirection: 'row', flex: 1}}>
                <TouchableOpacity  onPress = {() => setEventBtn('join')}style = {eventsJoined ? [styles.event_btns, {borderRightWidth: 1, borderRightColor: 'white', backgroundColor: 'orange'}] : [styles.event_btns, {borderRightWidth: 1, borderRightColor: 'white'}]}>
                <View>
                    <Text> Events Joined</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => setEventBtn()} style = {eventsHosted ? [styles.event_btns, {backgroundColor: 'orange'}] : styles.event_btns}>
                <View >
                    <Text> Events Hosted</Text>
                </View>
                </TouchableOpacity>
            </View>

            <View style = {{marginTop: hp('5%')}}>

                    {eventData.map((i) => {
                        if (eventsHosted) {

                            if (i.hostID == userId) {
                            return(
                                <View style = {styles.event_box}>
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Event Name:</Text><Text> {i.name}</Text></View>
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Sport:</Text><Text> {i.sport}</Text></View>
                                    
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Location:</Text><Text> {i.location}</Text></View>
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text> {i.dateTime}</Text></View>
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Description:</Text><Text> {i.description}</Text></View>
                                    
                                    {/* <Text style = {{textDecorationLine: 'underline', marginLeft: wp('1%')}}>Contact host at +852-{i.hostContact} on Whatsapp</Text> */}

                                </View>
                            )
                            }
                        }
                        else if (eventsJoined) {
                            
                            let ids = i.participantIDs;
                            console.log(ids)
                            console.log(userId)
                            
                            
                            for (let x = 0; x < ids.length; x++) {
                                 if (parseInt(ids[x]) === userId) {
                                    return(
                                        <View style = {styles.event_box}>
                                            <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Event Name:</Text><Text> {i.name}</Text></View>
                                            <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Sport:</Text><Text> {i.sport}</Text></View>
                                            <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Location:</Text><Text> {i.location}</Text></View>
                                            <Text> {i.dateTime}</Text>
                                            <View style = {{flexDirection: 'row', alignItems: 'center'}}><Text style = {{fontWeight: 'bold'}}> Description:</Text><Text> {i.description}</Text></View>
                                           
                                           <TouchableOpacity onPress = {() => {sendWhatsappMsg(i.hostContact)}}>
                                            <Text style = {{textDecorationLine: 'underline', marginLeft: wp('1%')}}>Contact host at +852-{i.hostContact} on Whatsapp</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                    break
                                 }
                            }
                        }
                        })}
           
            </View>

            </ScrollView>

    )
}

const styles = StyleSheet.create({
    
    header: {
        backgroundColor: 'red',
        height: hp('9%'),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    event_btns: {
        flex: 0.5, 
        height: hp('7%'), 
        alignItems: 'center',
         justifyContent: 'center',
          backgroundColor: 'lightgrey'
    },
    arrow: {
        color: 'white',
        fontSize: hp('4%'),
        marginHorizontal: wp('3%')
    },

    event_box: {
        backgroundColor: 'pink',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginBottom: hp('2%'),
        width: wp('90%'),
        marginLeft: wp('5%'),
        borderRadius: wp('3%'),
        padding: 15,
    },


})

export default MyEvents;