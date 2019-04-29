/**
 * 关于
 * */


import React, {Component} from 'react';
import {Button, Linking, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {MORE_MENU} from '../../common/MORE_MENU';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import myconfig from '../../res/data/myconfig';
import NavigationUtil from '../../navigator/NavigationUtil';


const THEME_COLOR = '#678';


export default class AboutPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}))
    this.state = {
      data: myconfig
    }
  }

  onClick(menu) {
    let RouteName, params = {}
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://www.baidu.com/'
        break
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        // params.title = '关于作者'
        break
      case MORE_MENU.Feedback:
        const url = 'app-settings:'
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('can\'t handle url:' + url);
            } else {
              Linking.openURL(url)
            }
          })
          .catch(e => {
            console.error('an error occor');
          })
        break
      default:
        break
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, params)
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
  }

  render() {
    const content = <View>
      {/*教程*/}
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>

      {/*关于作者*/}
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>

      {/*反馈*/}
      {this.getItem(MORE_MENU.Feedback)}
    </View>
    // return content
    return this.aboutCommon.render(content, this.state.data.app)
  }
}
