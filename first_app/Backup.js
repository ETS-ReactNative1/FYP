import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, 
    FlatList,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import CallLogs from 'react-native-call-record';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list: []
    };
}
  async loadGraphicCards(page = 1) {
    const searchUrl = `https://www.amazon.de/s/?page=${page}&keywords=graphic+card`;
    const response = await fetch(searchUrl);   // fetch page
  
    const htmlString = await response.text();  // get response text
    const $ = cheerio.load(htmlString);           // parse HTML string
    return $("#s-results-list-atf > li")             // select result <li>s
    .map((_, li) => ({                      // map to an list of objects
      asin: $(li).data("asin"),                   
      title: $("h2", li).text(),                
      price: $("span.a-color-price", li).text(),
      rating: $("span.a-icon-alt", li).text(),
      imageUrl: $("img.s-access-image").attr("src")
    }));
   
  }


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});