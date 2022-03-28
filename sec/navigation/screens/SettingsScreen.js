import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function SettingsScreen({ navigation }) {
    return (  
        //connection setting is in progress
        //which makes the entire App not runable
        
        //This page is a dummy page
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Settings Screen</Text>
            <Text>return to HOME</Text>
            <Button
                title="Add an Item"
                onPress={() => navigation.navigate('AddItem')}
            />
        </View>
    );
}