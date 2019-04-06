/**
 * fetch 网络技术的demo
 *
 * */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

class FetchDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
  }

  loadData2() {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text()
        }
        throw new Error('Net work response not ok')
      })
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
      .catch(e => {
        this.setState({
          showText: e.toString()
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.FetchDemoPage}>FetchDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text
            }}
          />
          <Button
            title="获取"
            onPress={() => {
              this.loadData2()
            }}
          />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    )
  }
}

export default FetchDemoPage


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
