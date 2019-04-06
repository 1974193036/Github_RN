import React, {Component} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'

// export default class PopularPage extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.PopularPage}>PopularPage</Text>
//       </View>
//     )
//   }
// }


class PopularContent extends Component {
  render() {
    const {tabLabel} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.PopularPage}>{tabLabel}</Text>
        <Button
          title="跳转到详情页"
          onPress={() => {
            NavigationUtil.goPage(
              'DetailPage', {}
            )
          }}/>
        <Button
          title="跳转到FetchDemoPage页面"
          onPress={() => {
            NavigationUtil.goPage(
              'FetchDemoPage', {}
            )
          }}/>
        <Button
          title="跳转到AsyncStorageDemoPage页面"
          onPress={() => {
            NavigationUtil.goPage(
              'AsyncStorageDemoPage', {}
            )
          }}/>
        <Button
          title="跳转到DataStoreDemoPage页面(离线缓存框架)"
          onPress={() => {
            NavigationUtil.goPage(
              'DataStoreDemoPage', {}
            )
          }}/>
      </View>
    )
  }
}

// const TABS = {
//   tab0: {
//     screen: PopularContent,
//     navigationOptions: {
//       title: 'Tab1'
//     }
//   },
//   tab1: {
//     screen: PopularContent,
//     navigationOptions: {
//       title: 'Tab2'
//     }
//   },
//   tab2: {
//     screen: PopularContent,
//     navigationOptions: {
//       title: 'Tab3'
//     }
//   }
// }

// const PopularPage = createAppContainer(TopNavigator)
class PopularPage extends Component {
  constructor(props) {
    super(props)
    this.tabNames = ['Java', 'Android', 'ios', 'React', 'React Native', 'PHP']
  }

  /**
   * _genTabs：动态配置生成tabs
   *
   * 动态设置切换的内容：
   * screen: props => <PopularContent {...props} tabLabel={item}/>,
   * */
  _genTabs() {
    const tabs = {}
    this.tabNames.map((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularContent {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }

  _tabNavigator() {
    // const topTab = createMaterialTopTabNavigator(TABS)
    const topTab = createMaterialTopTabNavigator(this._genTabs(), {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false, // 是否使标签大写，默认true
        scrollEnabled: true, // 选项卡滚动，默认false
        style: {
          backgroundColor: '#678' // TabBar的背景色
        },
        indicatorStyle: styles.indicatorStyle, // 标签指示器颜色，切换滑动的那条线
        labelStyle: styles.labelStyle, // 文字的样式
      }
    })
    return createAppContainer(topTab)
  }

  render() {
    const Top = this._tabNavigator()
    return (
      <View style={{flex: 1, marginTop: 30}}>
        <Top></Top>
      </View>
    )
  }
}

export default PopularPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  }
})
