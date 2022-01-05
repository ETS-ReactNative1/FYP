import * as React from 'react';
import { PermissionsAndroid, Platform, View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import CallLogs from 'react-native-call-record';

export default function DetailsScreen({ navigation }) {
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SafeAreaView>
                <Text
                    style={{ fontSize: 26, fontWeight: 'bold' }}>Welcome to Call log!</Text>
                <ScrollView style={{flex: 1}}>
                    <Text>
                    {"\n"}
                        FlyJJ will do this part :) 
                        {"\n"}
                    {"\n"}
                    </Text>
                    <Text onPress={() => navigation.navigate('Home')}> [Return to Home Page] </Text>
                </ScrollView>
            </SafeAreaView>
            
        </View>
    );
}