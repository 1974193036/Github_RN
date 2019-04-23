/**
 * 动态添加导航器，底部导航
 * */

import React, {Component} from 'react';
import {BottomTabBar, createAppContainer, createBottomTabNavigator} from 'react-navigation';
// import {BottomTabBar} from 'react-navigation-tabs'; /** 自定义底部导航栏 */
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Button, StyleSheet, Text, View} from 'react-native';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
// import NavigationUtil from "./navigator/NavigationUtil"
import {connect} from 'react-redux';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

const TABS = {
  Popular: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        return <MaterialIcons name={'whatshot'} size={26} color={tintColor}/>
      }
    }
  },
  Trending: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        return <MaterialIcons name={'trending-up'} size={26} color={tintColor}/>
      }
    }
  },
  Favorite: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        return <MaterialIcons name={'favorite'} size={26} color={tintColor}/>
      }
    }
  },
  My: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        return <Entypo name={'user'} size={26} color={tintColor}/>
      }
    }
  }
}

class DynamicTabNavigator extends Component {
  // constructor(props) {
  //   super(props)
  //   console.disableYellowBox = true // 禁止黄色的警告语
  // }

  _tabNavigator() {
    /** redux 的 this.props.theme改变时，会重新执行render函数，改变主题时，会切回到第一个tab页
     * 为了避免这种情况，用 if 判断
     * */
    if (this.bottomTab) {
      return this.bottomTab
    }


    const {Popular, Trending, Favorite, My} = TABS

    /** 动态配置导航器文字 */
    Popular.navigationOptions.tabBarLabel = '最热'

    /** 动态配置4个底部导航 */
    const tabs = {Popular, Trending, Favorite, My}

    /** 动态配置底部导航栏样式 */
    this.bottomTab = createAppContainer(createBottomTabNavigator(tabs, {
      tabBarComponent: props => {
        return <TabBarComponent {...props} theme={this.props.theme}/>
      }
    }))
    return this.bottomTab
  }

  render() {
    // /** 让内层嵌套的路由跳转到外层路由，在外层保存下跳转对象
    //  *  NavigationUtil.navigation 即外层保存的跳转对象
    //  * */
    // NavigationUtil.navigation = this.props.navigation
    const Tab = this._tabNavigator()
    // return <Tab></Tab>
    /**
     * onNavigationStateChange：监听底部导航栏切换
     * 发送事件，被其他页面监听
     *  */
    return (
      <Tab
        onNavigationStateChange={(prevState, newState, action) => {
          EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
            from: prevState.index,
            to: newState.index
          })
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme
})

export default connect(mapStateToProps)(DynamicTabNavigator);

// export default DynamicTabNavigator


class TabBarComponent extends Component {
  constructor(props) {
    super(props)
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }

  /**
   * BottomTabBar: 自定义底部导航栏
   * */
  render() {
    // const {routes, index} = this.props.navigation.state
    // if(routes[index].params) {
    //   const {theme} = routes[index].params
    //   // 以最新的更新时间为主，防止被其他tab之前的修改覆盖掉
    //   if(theme && theme.updateTime > this.theme.updateTime) {
    //     this.theme = theme
    //   }
    // }
    return <BottomTabBar
      {...this.props}
      // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
      activeTintColor={this.props.theme}
    />
  }
}