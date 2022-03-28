import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet, Button, FlatList, TextInput} from 'react-native';
import CallLogs from 'react-native-call-log';
import notifee, {AndroidGroupAlertBehavior, AndroidImportance} from '@notifee/react-native';
//init
import {initializeApp} from 'firebase/app';
import firestore from '@react-native-firebase/firestore';
export default class Helper{
    static async testing(word, session){

    }
}
import database from '@react-native-firebase/database';
let addItem = item => {
  database().ref('/items').push({
    name: item
  });
};


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
