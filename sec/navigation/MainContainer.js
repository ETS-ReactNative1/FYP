import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';



//give names
const homeName = "Location";
const detailsName = "Logs";
const settingsName = "Settings";
const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return(
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
        
                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
        
                    } else if (rn === detailsName) {
                        iconName = focused ? 'list' : 'list-outline';
        
                    } else if (rn === settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
        
                    // personalize settings, size color .......
                    return <IonIcons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#00FFBC',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 0, fontSize: 15, height: 25 },
                style: { padding: 10, height: 70}
            }}> 
    
            <Tab.Screen name={homeName} component={HomeScreen} />
            <Tab.Screen name={detailsName} component={DetailsScreen} />
            <Tab.Screen name={settingsName} component={SettingsScreen} />
            
    
            </Tab.Navigator>
        </NavigationContainer>
    )
}