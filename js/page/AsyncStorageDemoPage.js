/**
 * AsyncStorage 的demo
 *
 * */

import React, {Component} from 'react';
import {AsyncStorage, Button, StyleSheet, Text, TextInput, View} from 'react-native';

const KEY = 'save_key'

class AsyncStorageDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }

  async doSave() {
    // 用法1
    AsyncStorage.setItem(KEY, this.value, error => {
      error && console.log(error.toString())
    })
    // 用法2
    // AsyncStorage.setItem(KEY, this.value).catch(error => {
    //   error && console.log(error.toString())
    // })
    // 用法3
    // try {
    //   await AsyncStorage.setItem(KEY, this.value)
    // } catch (error) {
    //   error && console.log(error.toString())
    // }
  }

  async doRemove() {
    // 用法1
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString())
    })
    // 用法2
    // AsyncStorage.removeItem(KEY).catch(error => {
    //   error && console.log(error.toString())
    // })
    // 用法3
    // try {
    //   await AsyncStorage.removeItem(KEY)
    // } catch (error) {
    //   error && console.log(error.toString())
    // }
  }

  async getData() {
    // 用法1
    AsyncStorage.getItem(KEY, (error, value) => {
      this.setState({
        showText: value
      })
      console.log(value)
      error && console.log(error.toString())
    })
    // 用法2
    // AsyncStorage.getItem(KEY).then(value => {
    //   this.setState({
    //     showText : value
    //   })
    //   console.log(value)
    // }).catch(error => {
    //   error && console.log(error.toString())
    // })
    // 用法3
    // try {
    //   const value = await AsyncStorage.getItem(KEY)
    //   this.setState({
    //     showText : value
    //   })
    //   console.log(value)
    // } catch (error) {
    //   error && console.log(error.toString())
    // }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.FetchDemoPage}>AsyncStorageDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.value = text
            }}
          />
          <Text onPress={() => {this.doSave()}}>存储</Text>
          <Text onPress={() => {this.doRemove()}}>删除</Text>
          <Text onPress={() => {this.getData()}}>获取</Text>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    )
  }
}

export default AsyncStorageDemoPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  FetchDemoPage: {
    fontSize: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    height: 30,
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10
  }
})
