import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text, TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  menu: {
    width: wp('30%'),
    height: window.height,
    //backgroundColor: 'red',
    padding: 20,
    flex: 1,
    marginLeft: 155
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
    alignSelf: 'flex-end'
  },
});

export default function Menu({ onItemSelected, navigation }) {
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
      <TouchableOpacity onPress = {console.log("YES")} style={styles.item}>
        <Text>My Events</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};