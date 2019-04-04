import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';


export default class DetailPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.HomePage}>DetailPage</Text>
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
  HomePage: {
    fontSize: 20
  }
})
