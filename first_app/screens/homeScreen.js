import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Button, Provider, Menu, ScrollView, Text, TextInput, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableHighlight } from 'react-native-gesture-handler';
import axios from 'axios';
import { Divider } from 'react-native-paper';

const HomeScreen = ({ navigation, route }) => {
  
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  
  // const {id, name} = navigation.state.params
  const id = 1
  const name = 'Areeb'

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
              navigation.navigate('joinscreen',{res: res, id: id})

      
            }).catch((err) => {
               
                console.log('error: ', err)
            })
  }

  // console.warn(id)
  // console.warn(name)
  //console.warn(name)

    return (
      <ScrollView contentContainerStyle ={{alignItems: 'center'}} >
        <View style={styles.header}>
                <TouchableOpacity onPress = {() => navigation.navigate('loginScreen')}>
                <Icon name= 'arrow-left' style = {styles.arrow} />
                </TouchableOpacity>
                <Image source={require('./images/logo.png')} />
                    <Menu style = {styles.menuOpen}
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={<TouchableOpacity onPress = {openMenu}>
                      <Icon name= 'bars' style = {styles.menu}/> 
                      </TouchableOpacity>}>
                      <Menu.Item onPress={() => {setVisible(false); navigation.navigate('joinscreen')}} title="My Events" />
                      <Divider />
                      <Menu.Item onPress={() => {setVisible(false); navigation.navigate('loginScreen')}} title="Log Out" />
                    </Menu>
        </View>
        <Text style={styles.bigT}> Welcome To Sporcial, {name} </Text> 
        <SafeAreaView style = {{marginBottom: hp('3%')}} >
        <TouchableOpacity
         onPress = {()=>
          // navigation.navigate('eventform', {id: id, name: name})
          navigation.navigate('eventform')
      }
         >
            <Image style={styles.imagestyle}
            source={require('./images/hostImage.png')} />

               
        </TouchableOpacity>
        </SafeAreaView>

        <SafeAreaView >
         <TouchableOpacity
         onPress = {()=>
          navigation.navigate('joinscreen')
          // getEvents()
      }
         >
            <Image style={styles.imagestyle}
            source={require('./images/joinImage.png')} />
               
        </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
   menu : {
      color: 'white',
      fontSize: hp('4%'),
      marginLeft: wp('60%'), 
    },
    menuOpen: {
      fontSize: hp('4%'),
      marginLeft: wp('40%'), 
      marginTop: hp('6.5%'),
      opacity: 0.9, 
      elevation: 2
      
    },
    input: {
      height: 40,
      margin: 12,
      borderColor: '#FFB3B3',
      backgroundColor: '#FFB3B3',
      borderWidth: 1,
      padding: 10,
    },
    container: {
      flex: 1,
      alignItems: 'center'

  },
  imagestyle: {
    justifyContent: 'center',
    height: 200,
    width: 200
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
    alignItems: 'center',
    elevation: 1
},
bigT: {
    textAlign: 'center',
    textShadowRadius: 5,
    color: 'red',
    fontStyle: 'italic',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 75
},
  });
  export default HomeScreen;
