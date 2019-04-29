import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import {NavigationActions} from "react-navigation";
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678';

export default class WebViewPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const {title, url} = this.params

    this.state = {
      title: title,
      url: url,
      canGoBack: false
    }

    /**
     * 处理安卓的物理返回键
     * */
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓的物理返回键
   * */
  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    // 从列表页 进入 webview页面时：canGoBack=false
    // webview页面内，首页跳转到下一级页面时：canGoBack=true
    // 一直回退到 webview 首页时，此时：canGoBack=true ??????????????????
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  // webview内的导航状态发生变化触发
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }


  render() {
    let navgiationBar = <NavigationBar
      title={this.state.title}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
    />
    return (
      <View style={styles.container}>
        {navgiationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  HomePage: {
    fontSize: 20
  }
})
