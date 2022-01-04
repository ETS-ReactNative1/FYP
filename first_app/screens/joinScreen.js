import * as React from 'react';
import {
  Text,
  View,
  Alert,
  SafeAreaView, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
//import Carousel from 'react-native-snap-carousel';


export default class App extends React.Component {
  lastTap = null;
  visible = false;
  styles = StyleSheet.create({
    header: {
      backgroundColor: 'red',
      height: hp('9%'),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
  },
  carousel : {
    flex: 1, flexDirection:'row', justifyContent: 'center'
  },
  arrow: {
      color: 'white',
      fontSize: hp('4%'),
      marginHorizontal: wp('3%')
  },
  menu : {
    color: 'white',
    fontSize: hp('4%'),
    marginLeft: wp('60%')
  },
    menuOpen: {
    fontSize: hp('4%'),
    marginLeft: wp('40%'), 
    marginTop: hp('6.5%'),
    opacity: 0.9, 
    elevation: 2
    
  },
  });
  IMAGES = [
    require("./images/1.jpg"),
    require("./images/2.jpg"),
    require("./images/3.jpg"),
    require("./images/4.jpg"),
    
  ];

 openMenu = () => {
    this.setState({
      visible:  true});
  }
  closeMenu = () => {
    this.setState({
      visible:  false});
  }

  getEvents = () => {

    console.warn('hi')

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
              navigation.navigate('myevents',{allEvents: res, userid: id})

              console.log(res)
      
            }).catch((err) => {
               
                console.log('error: ', err)
            })
  }

  getDirections = (location) => {
    if (location === 'Flora Ho Sports Centre') {
      Linking.openURL('https://www.google.com/maps/place/Flora+Ho+Sports+Centre/@22.2805631,114.1290708,17z/data=!3m1!4b1!4m5!3m4!1s0x3403ff90108ff90d:0xd1d8bbcd136e8c39!8m2!3d22.28055!4d114.1313025')
    }

    else if (location === 'Stanley Ho Sports Centre') {
      Linking.openURL('https://www.google.com.hk/maps/place/Pitch+2,+HKU+Stanley+Ho+Sports+Centre/@22.268357,114.124829,18z/data=!4m5!3m4!1s0x0:0x9f068ffb97d4b8f4!8m2!3d22.2685605!4d114.1239059')
    }
    else if (location === 'Kowloon Tsai Park') {
      Linking.openURL('https://www.google.com/maps/dir/22.2624728,114.132033/Kowloon+Tsai+Park+Hong+Kong+google+maps/@22.2897797,114.1246407,13z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3404072c9e65cb4d:0x82d4433342ca781c!2m2!1d114.1840189!2d22.3321858')
    }
    else {
      Linking.openURL('https://www.google.com/maps/dir/22.2624728,114.132033/Kowloon+Tsai+Park+Hong+Kong+google+maps/@22.2897797,114.1246407,13z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3404072c9e65cb4d:0x82d4433342ca781c!2m2!1d114.1840189!2d22.3321858')
    }
  }

  getImage = (location) => {

    if (location === 'Flora Ho Sports Centre') {
      return this.IMAGES[0]
    }

    else if (location === 'Stanley Ho Sports Centre') {
      return this.IMAGES[2]
    }
    else if (location === 'Kowloon Tsai Park') {
      return this.IMAGES[3]
    }
    else {
      return this.IMAGES[1]
    }

  }

  getCapacity = (filledSpots, maxSpots, eventID) => {
    
   
    
    if (filledSpots.length === maxSpots) {
      return(
        <Text style={{fontSize: 15, color: 'red', paddingTop: 0, paddingLeft: 15}}>This event has already reached maximum capacity!</Text>
      )
    }
    else {
      return(
      <Text style={{fontSize: 15, color: 'red', paddingTop: 0, paddingLeft: 15}}>Available Spots: {maxSpots - (filledSpots).length}/{maxSpots}</Text>
       ) }
  }

    constructor(props){
        super(props);
        //getting database data here
     
        
        
        this.state = {
          activeIndex:0,
          //all events are here
          // allEvents: this.props.navigation.state.params.res,

          // userid: this.props.navigation.state.params.id,
          maxCapEvents: [],
          
        //   carouselItems: 
        //   [
        //   {
        //       name:"Badminton",
        //       location: "Flora Ho Sports Centre",
        //       DandT: "Tue Nov 30 2021 18:00:00 GMT+0800 (HKT)",
        //       Des: "Need 3 people for an hour of Badminton at Flora Ho centre (preferably HKU students)",
        //       image: this.IMAGES[0]
        //   },
        //   {
        //       name:"Football",
        //       location: "Kowloon Tsai Park",
        //       DandT: "Thu Dec 2 2021 12:00:00 GMT+0800 (HKT)",
        //       Des: "14 people needed - friendly matches",
        //       image: this.IMAGES[1]
        //   },
        //   {
        //       name:"Volleyball",
        //       location: "Stanley Ho Sports Centre",
        //       DandT: "Wed Dec 8 2021 07:30:00 GMT+0800 (HKT)",
        //       Des: "Already have 6 people, need 6 more",
        //       image: this.IMAGES[2]
        //   },
        //   {
        //       name:"Tennis",
        //       location: "Jordan Valley Tennis Court",
        //       DandT: "Sat Dec 11 2021 10:00:00 GMT+0800 (HKT)",
        //       Des: "Tennis tournament! Players, Referees etc. needed",
        //       image: this.IMAGES[3]
        //   },
        // ]
      }
    }
    handleDoubleTap=(hostID, eventID, pID, maxSpots)=>{
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
        this.lastTap = null;

    if (pID.length === maxSpots) {
          Alert.alert(
            "Event Registeration Failure",
            "This event has reached its maximum capacity!",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
        }
    else{
        if (hostID === this.state.userid) {
          
          Alert.alert(
                "Event Registeration Failure",
                "You are the host of this event, so you cannot join this one.",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        else if (hostID != this.state.userid){
          //make sure to save participant in event somehow
          //then show joined events and WE ARE DONE

          //send userid, event id to add to database
          //add userid to participant id in string
          // console.log(pIDid)

          axios.post('http://10.0.2.2:3002/add-participants', {
                participantID: pID + this.state.userid,
                eventID: eventID,
            }).then((response) => {

                var res = JSON.parse(JSON.stringify(response.data))

            }).catch((err) => {
                console.log('error: ', err)
            })

            Alert.alert(
              "Event Registeration Successful",
              "You have joined this event!",
              [
                  { text: "OK", onPress: () => this.props.navigation.navigate('homescreen') }
              ]
          );

          this.log();
        }
      }
       
        

      } else {
        this.lastTap = now;
      }
    }
    log(){
      
      console.log("SUCCESS");
    }
    _renderItem = ({item,index}) => {

     


          //   Alert.alert(
          //     "EVENT CREATED",
          //     "Please check 'My Events' in the Navigation bar to view your events",
          //     [
          //         {
          //             text: "Cancel",
          //             onPress: () => console.log("Cancel Pressed"),
          //             style: "cancel"
          //         },
          //         { text: "OK", onPress: () => console.log("OK Pressed") }
          //     ]
          // );
      
      return (
        
        <TouchableOpacity onPress={() => this.handleDoubleTap(item.hostID, item.eventID, item.participantIDs, item.capacity)}>
        <View style={{
            backgroundColor:'#fff0f0',
            borderRadius: 5,
            height: hp('100%'),
            //marginLeft: wp('5%'),
            //marginRight: wp('5%')
}}>
              <Image style={{ width: '100%', height: '45%' }}
              // source={getImage(item.location)}/>
              source = {this.getImage(item.location)} />
              
          <Text style={{fontSize: 25, color: 'black', paddingLeft: 12, paddingTop: 8}}>Event Name: {item.name}</Text>
          {/* <Text style={{fontSize: 15, color: 'red', paddingTop: 0, paddingLeft: 15}}>Available Spots: {(item.participantIDs).length}/{item.capacity}</Text> */}
          {this.getCapacity(item.participantIDs, item.capacity, item.eventID)}
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3, fontWeight: 'bold'}}>Sport: </Text>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3}}>{item.sport}</Text>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3, fontWeight: 'bold'}}>Location: </Text>
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3}}>{item.location}</Text>
          <TouchableOpacity onPress = {() => this.getDirections(item.location)}>
          <Icon style = {{fontSize: hp('3%'), color: 'red', marginLeft: wp('2%')}} name = 'location-arrow'/>
          </TouchableOpacity>
          </View>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3, fontWeight: 'bold'}}>Date and Time: </Text>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3}}>{item.dateTime}</Text>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3, fontWeight: 'bold'}}>Description:</Text>
          <Text style={{color:'black', paddingLeft: 15, paddingTop: 3}}>{item.description}</Text>
        </View>
        </TouchableOpacity>
        
      )
        
  }

    render() {
        return (
          <View style={{flex: 1, backgroundColor:'white'}}>
            <View style={this.styles.header}>
                <TouchableOpacity onPress = {() => this.props.navigation.navigate('homescreen')}>
                <Icon name= 'arrow-left' style = {this.styles.arrow} />
                </TouchableOpacity>
                <Image source={require('./images/logo.png')} />
                {/* <TouchableOpacity onPress = {() => this.props.navigation.navigate('myevents', {userid: this.state.userid, allEvents: this.state.allEvents})} style = {{marginLeft: wp('10%')}}> */}
                {/* <TouchableOpacity onPress = {this.openMenu} >
                  <Icon name = 'bars' style = {this.styles.menu}/></TouchableOpacity> */}
                
                    <Menu style = {this.styles.menuOpen}
                      visible={this.state.visible}
                      onDismiss={this.closeMenu}
                      anchor={<TouchableOpacity onPress = {this.openMenu} >
                      <Icon name= 'bars' style = {this.styles.menu}/>
                      </TouchableOpacity>}>
                      <Menu.Item  onPress={() => {this.setState({visible: false}); this.props.navigation.navigate('eventform', {userid: this.state.userid, allEvents: this.state.allEvents})}} title="My Events" />
                      <Menu.Item  onPress={() => {this.setState({visible: false}); this.props.navigation.navigate('loginScreen')}} title="Log Out" />
                    </Menu>
                 
                
        </View>
            <View style={this.styles.carousel} >
                        
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.allEvents}
                  sliderWidth={200}
                  itemWidth={wp('100%')}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>
          </View>
        );
    }
}
