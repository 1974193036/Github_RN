import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';


export default class MyPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.MyPage}>MyPage</Text>
        <Text style={styles.MyPage}>MyPage1</Text>
        <Text style={styles.MyPage}>MyPage2</Text>
        <Button
          title="跳转到详情页"
          onPress={() => {
            NavigationUtil.goPage(
              'DetailPage', {}
            )
          }}/>
        <Button
          title="跳转到FetchDemoPage页面"
          onPress={() => {
            NavigationUtil.goPage(
              'FetchDemoPage', {}
            )
          }}/>
        <Button
          title="跳转到AsyncStorageDemoPage页面"
          onPress={() => {
            NavigationUtil.goPage(
              'AsyncStorageDemoPage', {}
            )
          }}/>
        <Button
          title="跳转到DataStoreDemoPage页面(离线缓存框架)"
          onPress={() => {
            NavigationUtil.goPage(
              'DataStoreDemoPage', {}
            )
          }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  MyPage: {
    fontSize: 20
  }
})
