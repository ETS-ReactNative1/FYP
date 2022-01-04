import * as React from 'react';
import { useState } from 'react';
import {Button, Text, TextInput, View, StyleSheet, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Events = ({ navigation}) => {
  
  // let buttonTxt = 'Welcome to Sportial, ';
   
    return (
      <Button 
        title ={'Welcome'}
        onPress={() =>
          console.log("YES")
        }
        color = 'red'
      />
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
      backgroundColor: '#FFB3B3',
      height: 80,
    },
  });

  export default HomeScreen;