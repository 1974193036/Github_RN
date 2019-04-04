import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'

/**
 * 欢迎页
 *
 * */

export default class WelcomePage extends Component {

  componentDidMount() {
    this.timer = setTimeout(()=>{
      // const {navigation} = this.props
      // navigation.navigate('Main')

      NavigationUtil.resetToHomePage({
        navigation: this.props.navigation
      })
    },200)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage</Text>
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
  welcome: {
    fontSize: 20
  }
})