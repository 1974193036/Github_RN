/**
 * 离线缓存框架设计
 *
 * */


import React, {Component} from 'react';
import {AsyncStorage, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import DataStore from '../expand/dao/DataStore';


export default class DataStoreDemoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showText: 'default'
    }
    this.dataStore = new DataStore()
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.value}`
    this.dataStore.fetchData(url)
      .then(data => {
        let showData = `初次数据加载时间: ${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
        this.setState({
          showText: showData
        })
      })
      .catch(error => {
        error && console.log(error.toString());
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.dataStoreDemoPage}>离线缓存框架设计</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text
          }}
        />
        <View style={styles.inputContainer}>
          <Text onPress={() => {this.loadData()}}>获取</Text>
          <Text>{this.state.showText}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  dataStoreDemoPage: {
    fontSize: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
  }
})
