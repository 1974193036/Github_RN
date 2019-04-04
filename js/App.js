/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './navigator/AppNavigator';
import store from './store';


export default class App extends Component {
  render() {
    // 将 store 传给 App 框架
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    )
  }
}
