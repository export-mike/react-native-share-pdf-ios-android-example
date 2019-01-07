import React, {Component} from 'react';
import { TouchableHighlight, Text, View, Platform, StyleSheet} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {WebView} from 'react-native-webview';
import Share from 'react-native-share';

async function shareIos(url) {
  const response = await RNFetchBlob.config({
    fileCache: true,
    path: `${RNFetchBlob.fs.dirs.DocumentDir}/TEST 1 2 3.pdf`,
  }).fetch('GET', url);
  const path = response.path();
  await Share.open({
    type: 'application/pdf',
    title: 'title!',
    name: 'test',
    url: path,
  });
  await RNFS.unlink(response.path());
}

async function shareAndroid(url) {
  const configOptions = { fileCache: true };
  const response = await RNFetchBlob.config(configOptions).fetch('GET', url);
  const filePath = response.path();
  const base64Data = await response.readFile('base64');
  await Share.open({
    url: `data:application/pdf;base64,${base64Data}`,
    title: 'PDF!',
  });
  await RNFS.unlink(filePath);
}

function share (url) {
  if (Platform.OS === 'ios') {
    shareIos(url);
  } else {
    shareAndroid(url);
  }
}

export default class App extends Component {
  handleShare = (url) => () => {
    try {
      share(url);
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Share PDF!</Text>
        <TouchableHighlight onPress={this.handleShare("https://www.wilsoncenter.org/sites/default/files/ap_understandingthenorthkoreanregime.pdf")}>
          <Text>Share!</Text>
        </TouchableHighlight>
        <WebView
          style={{
            minHeight: 800,
            minWidth: 300
          }}
          source={{
            uri: "https://www.wilsoncenter.org/sites/default/files/ap_understandingthenorthkoreanregime.pdf"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    marginTop: 40
  }
});
