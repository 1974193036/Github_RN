/**
 * 自定义顶部的 状态栏 和 导航栏（标题栏）
 * 状态栏是在导航栏上面的部分，在ios中特别明显
 * 导航栏一般分为左（返回按钮），中（标题栏）右（状态按钮），也有可能只有一个 中（标题栏）
 *
 * */

import React, {Component} from 'react';
import {DeviceInfo, Platform, StatusBar, StyleSheet, Text, View, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';


const NAV_BAR_HEIGHT_IOS = 44; // 导航在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50; // 导航在Android中的高度
const STATUS_BAR_HEIGHT = 20; // 状态栏的高度

// 设置状态栏属性
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']), // 状态栏文字样式，iOS专用属性，oneOf：某个特定值之一，
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string, // Android专用属性
}

export default class NavigationBar extends Component {
  // 属性检查
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape), // 检测对象
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  }

  // 设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content', // 状态栏文字样式，iOS专用属性：light-content：白色文字，default：黑色文字（默认）
      hidden: false,
    }
  }

  render() {
    let statusBar = !this.props.statusBar.hidden ?
      (<View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar}/>
      </View>) : null

    // ellipsizeMode , 最新版本推出的属性, 显示不完全省略的位置, 一般配合numberOfLines 使用，head："...wxyz"
    let titleView = this.props.titleView ? this.props.titleView :
      (<Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>
        {this.props.title}
      </Text>)

    let content = this.props.hide ? null :
      (<View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>)

    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    )
  }

  getButtonElement(data) {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3'
  },
  navBarButton: {
    alignItems: 'center'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 0 : STATUS_BAR_HEIGHT) : 0,
  }
})