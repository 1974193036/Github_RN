import React, {Component} from 'react';
// import {createAppContainer, createBottomTabNavigator} from 'react-navigation';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Entypo from 'react-native-vector-icons/Entypo';
import {BackHandler, StyleSheet, View} from 'react-native';
// import PopularPage from './PopularPage';
// import TrendingPage from './TrendingPage';
// import FavoritePage from './FavoritePage';
// import MyPage from './MyPage';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from "../navigator/NavigationUtil"
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";
import BackPressComponent from "../common/BackPressComponent";
import CustomTheme from '../page/CustomTheme';
import actions from "../action";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

/**
 * NavigationActions：处理安卓的物理返回键
 * BackHandler：处理安卓的物理返回键
 *
 * */

/**
 * 首页
 *
 * */

// export default class HomePage extends Component {
//   _tabNavigator() {
//     const TabNavigator = createBottomTabNavigator({
//       Popular: {
//         screen: PopularPage
//       },
//       Trending: {
//         screen: TrendingPage
//       },
//       Favorite: {
//         screen: FavoritePage
//       },
//       My: {
//         screen: MyPage
//       }
//     })
//     return createAppContainer(TabNavigator)
//   }
//
//   render() {
//     const Tab = this._tabNavigator()
//     return <Tab/>
//   }
// }


// const TABS = {
//   Popular: {
//     screen: PopularPage,
//     navigationOptions: {
//       tabBarLabel: '最热',
//       tabBarIcon: ({focused, horizontal, tintColor}) => {
//         return <MaterialIcons name={'whatshot'} size={26} color={tintColor}/>
//       }
//     }
//   },
//   Trending: {
//     screen: TrendingPage,
//     navigationOptions: {
//       tabBarLabel: '趋势',
//       tabBarIcon: ({focused, horizontal, tintColor}) => {
//         return <MaterialIcons name={'trending-up'} size={26} color={tintColor}/>
//       }
//     }
//   },
//   Favorite: {
//     screen: FavoritePage,
//     navigationOptions: {
//       tabBarLabel: '收藏',
//       tabBarIcon: ({focused, horizontal, tintColor}) => {
//         return <MaterialIcons name={'favorite'} size={26} color={tintColor}/>
//       }
//     }
//   },
//   My: {
//     screen: MyPage,
//     navigationOptions: {
//       tabBarLabel: '我的',
//       tabBarIcon: ({focused, horizontal, tintColor}) => {
//         return <Entypo name={'user'} size={26} color={tintColor}/>
//       }
//     }
//   }
// }

// const HomePage = createAppContainer(TabNavigator)
class HomePage extends Component {
  constructor(props) {
    super(props)
    console.disableYellowBox = true // 禁止黄色的警告语

    /**
     * 处理安卓的物理返回键
     * */
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓的物理返回键
   * */
  onBackPress() {
    const {dispatch, nav} = this.props
    // 根据 redux：
    // index === 0 为 home 页面
    // index === 1 为 home 页面直接跳转到的 detail 页面
    // index不等于0，为 home 页面跳转后的其他页面
    // nav.routes[0] 为 导航 Init
    // nav.routes[1] 为 导航 Main
    if (nav.routes[1].index === 0) {
      return false
    }
    dispatch(NavigationActions.back())
    return true
  }

  //
  // _tabNavigator() {
  //   const bottomTab = createBottomTabNavigator(TABS)
  //   return createAppContainer(bottomTab)
  // }
  //
  // render() {
  //   /** 让内层嵌套的路由跳转到外层路由，在外层保存下跳转对象
  //    *  NavigationUtil.navigation 即外层保存的跳转对象
  //    * */
  //   NavigationUtil.navigation = this.props.navigation
  //   const Tab = this._tabNavigator()
  //   return <Tab></Tab>
  // }
  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props
    return (<CustomTheme
      visible={customThemeViewVisible}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }

  render() {
    const {theme} = this.props
    /** 让内层嵌套的路由跳转到外层路由，在外层保存跳转对象
     *  NavigationUtil.navigation 即外层保存的跳转对象
     * */
    NavigationUtil.navigation = this.props.navigation
    return (
      <SafeAreaViewPlus topColor={theme.themeColor}>
        <DynamicTabNavigator/>
        {this.renderCustomThemeView()}
      </SafeAreaViewPlus>
    )
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible,
})

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
})

// export default HomePage
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
