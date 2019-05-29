import React, {Component} from 'react';
import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';
import CustomKeyPage from '../page/CustomKeyPage';
import SortKeyPage from '../page/SortKeyPage';
import SearchPage from '../page/SearchPage';
import CodePushPage from '../page/CodePushPage';
// import FetchDemoPage from '../page/FetchDemoPage';
// import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage';
// import DataStoreDemoPage from '../page/DateStoreDemoPage';

import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers';

/**
 * 使 react-navigation 与 redux 关联：
 * createReactNavigationReduxMiddleware
 * createReduxContainer
 * createReduxContainer
 */


export const rootCom = 'Init'; // 设置根路由


const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, // 可以通过将 header 设置为 null，禁用 StackNavigator 的导航头部
    }
  }
})

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null,
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null,
    }
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null,
    }
  },
  SortKeyPage: {
    screen: SortKeyPage,
    navigationOptions: {
      header: null,
    }
  },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      header: null,
    }
  },
  CodePushPage: {
    screen: CodePushPage,
    navigationOptions: {
      header: null,
    }
  }
  // FetchDemoPage: {
  //   screen: FetchDemoPage
  // },
  // AsyncStorageDemoPage: {
  //   screen: AsyncStorageDemoPage
  // },
  // DataStoreDemoPage: {
  //   screen: DataStoreDemoPage
  // }
})

export const RootNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
})

// const RootStackContainer = createAppContainer(RootNavigator)


/**
 * 初始化 react-navigation 与 redux 的中间件,
 * 该方法的一个很大的作用就是为 createReduxContainer 的 key 设置 actionSubscribers(行为订阅者)
 * @type Middleware
 */
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
)

/**
 * 将导航器组件传递给 createReduxContainer 函数,
 * 并返回一个将 navigation state 和 dispatch 函数作为 props 的新组件
 * 注意: 要在 createReactNavigationReduxMiddleware 之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
})

/**
 * 连接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);