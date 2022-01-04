import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Button, Text, TextInput, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import {Menu, Divider, Provider } from 'react-native-paper';

const HostScreen = ({ navigation, route }) => {

  // const {userID, username} = navigation.state.params

  const getEvents = () => {
    axios.post('http://10.0.2.2:3002/get-event', {

            }).then((response) => {

              //EVENTS FROM DATABASE ARE STORED IN RES
              var res = JSON.parse(JSON.stringify(response.data))
              console.log('event 1: ')
              console.log(res[0])
              console.log('event 2: ')
              console.log(res[1])
              console.log('event 3: ')
              console.log(res[2])
              navigation.navigate('joinscreen',{res: res, userId: userID})

      
            }).catch((err) => {
               
                console.log('error: ', err)
            })

            
  }

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

    return (
      <View style ={styles.container}>
        <View style={styles.header}>
                <TouchableOpacity onPress = {() => navigation.navigate('homescreen')}>
                <Icon name= 'arrow-left' style = {styles.arrow} />
                </TouchableOpacity>
                <Image source={require('./images/logo.png')} />
                <TouchableOpacity onPress = {openMenu} style = {{marginLeft: 260}}>
                <Icon name= 'bars' style = {styles.arrow}/>
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
        <SafeAreaView style = {styles.butt}>
             <Button 
            title = "Host an event!"
            onPress = {()=>
                navigation.navigate('eventform', {id: userID, name: username})
            }
            color = '#FFB3B3'
            
        />
        </SafeAreaView>
        <SafeAreaView style = {styles.butt}>
         <Button 
            title = "Join an event!"
            onPress = {()=>
                getEvents()
            }
            color = '#FFB3B3'
        />
        </SafeAreaView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderColor: '#FFB3B3',
      backgroundColor: '#FFB3B3',
      borderWidth: 1,
      padding: 10,
    },
    butt: {
      marginTop: 60,
      backgroundColor: '#FFB3B3',
      height: 200,
      width: 150,
    },
    container: {
      flex: 1,
      alignItems: 'center'

  },
  arrow: {
    color: 'white',
    fontSize: hp('4%'),
    marginHorizontal: wp('3%')
  },
  header: {
    backgroundColor: 'red',
    height: hp('9%'),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
},
  });
  export default HostScreen;