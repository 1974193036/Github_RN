import React, {Component} from 'react';
import {ActivityIndicator, Button, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';

// export default class PopularPage extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.PopularPage}>PopularPage</Text>
//       </View>
//     )
//   }
// }
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const PAGE_SIZE = 10; // 设为常数, 防止修改

class PopularContent extends Component {
  constructor(props) {
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
  }

  componentDidMount() {
    this.loadData()
  }

  loadData(loadMore) {
    const {onRefreshPopular, onLoadMorePopular} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      // 上拉加载更多
      onLoadMorePopular(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, () => {
        this.refs.toast.show('没有更多了')
      })
    } else {
      // 下拉刷新
      onRefreshPopular(this.storeName, url, PAGE_SIZE)
    }
  }

  _store() {
    const { popular } = this.props
    let store = popular[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
        hideLoadingMore: true // 默认隐藏加载更多
      }
    }
    return store
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR
  }

  renderItem(data) {
    const item = data.item
    // return (
    //   <View style={{marginBottom: 10}}>
    //     <Text style={{backgroundColor: '#faa'}}>{item.name}</Text>
    //   </View>
    // )
    return <PopularItem item={item} onSelect={() => {}}/>
  }

  // 上拉加载loading效果
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={'red'} style={styles.indicator}/>
        <Text style={{color: 'red'}}>正在加载更多</Text>
      </View>
    )
  }

  render() {
    let store = this._store()
    return (
      <View style={styles.container}>
        {/*<Text style={styles.PopularPage}>{this.storeName}</Text>*/}
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => '' + item.id}
          refreshControl={
            <RefreshControl
              title={'加载中...'}
              titleColor={'red'} // ios的 '加载中' 文字颜色
              tintColor={'red'} // ios的 loading 颜色
              colors={['green']} // android的 loading 颜色
              refreshing={store.isLoading} // 显示下拉刷新loading
              onRefresh={() => this.loadData()} // 下拉刷新回调
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReachedThreshold={0.1} // 距离底部还有多少距离
          onEndReached={() => {
            setTimeout(() => { // 节流，延迟，保证 onScrollBeginDrag 先出现，然后再执行 onEndReached 内的判断
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onScrollBeginDrag={() => { // 初始化滚动，避免多次（一般会调用2次）调用 onEndReached
            this.canLoadMore = true
          }}
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback)),
})

const PopularTabContent = connect(mapStateToProps, mapDispatchToProps)(PopularContent)

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
        screen: props => <PopularTabContent {...props} tabLabel={item}/>,
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
    flex: 1
  },
  PopularPage: {
    fontSize: 20
  },
  tabStyle: {
    minWidth: 50,
    height: 40
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    margin: 10
  }
})
