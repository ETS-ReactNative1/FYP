import * as React from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert,
  Button
} from 'react-native';

import {firebase, database} from '@react-native-firebase/database';

const reference = firebase
  .app()
  .database('https://fyp-project-337408-default-rtdb.asia-southeast1.firebasedatabase.app/')
  .ref('/items');

let addItem = item => {
    reference.push({
        name: item
  });
};

export default function SettingsScreen({ navigation }) {
    const [name, onChangeText] = React.useState("");
    const  handleSubmit = () => {
        addItem(name);
        Alert.alert('Item saved successfully');
    };
    return (
        <View style={styles.main}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput style={styles.itemInput} onChangeText={text => onChangeText(text)} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
            onPress={handleSubmit}
        >
        <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#6565fc'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center'
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});