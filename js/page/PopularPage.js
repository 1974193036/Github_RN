import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  DeviceInfo,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

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
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularContent extends Component {
  constructor(props) {
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
    this.isFavoriteChanged = false
  }

  componentDidMount() {
    this.loadData()
    /**
     * 监听收藏页面列表项点击收藏按钮事件
     * 监听底部导航栏切换的事件，从其他页面切换到当前页面，to=0，索引值
     * */
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true
    })

    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      // 上拉加载更多
      onLoadMorePopular(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, () => {
        this.refs.toast.show('没有更多了')
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao)
    } else {
      // 下拉刷新
      onRefreshPopular(this.storeName, url, PAGE_SIZE, favoriteDao)
    }
  }

  _store() {
    const {popular} = this.props
    let store = popular[this.storeName]
    // 避免一些tab项对应的数据未加载完成而报错
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
    const {theme} = this.props
    // item = {
    //   item: [{...}, {...}, {...}],
    //   isFavorite: false
    // }

    // return (
    //   <View style={{marginBottom: 10}}>
    //     <Text style={{backgroundColor: '#faa'}}>{item.name}</Text>
    //   </View>
    // )

    /**
     * callback被两个地方使用
     * 1.在PopularItem（BaseItem）内，callback作为一个函数指针，但不执行
     * 2.等到跳转进入详情页面后，callback被当作参数传入详情页面，详情页的收藏按钮点击后，执行callback()，即执行了 PopularItem（BaseItem）内 的那个函数指针，
     *   使得改变详情页面的收藏状态，返回到列表页面也产生了变化
     * */
    return (<PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage('DetailPage', {
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        })
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />)
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
    const {theme}=this.props
    let store = this._store()
    return (
      <View style={styles.container}>
        {/*<Text style={styles.PopularPage}>{this.storeName}</Text>*/}
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'加载中...'}
              titleColor={theme.themeColor} // ios的 '加载中' 文字颜色
              tintColor={theme.themeColor} // ios的 loading 颜色
              colors={[theme.themeColor]} // android的 loading 颜色
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
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => {
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
  }
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
    // this.tabNames = ['Java', 'Android', 'ios', 'React', 'React Native', 'PHP']
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_dao_key)
  }


  /**
   * _genTabs：动态配置生成tabs
   *
   * 动态设置切换的内容：
   * screen: props => <PopularContent {...props} tabLabel={item}/>,
   * */
  _genTabs() {
    const {keys} = this.props
    const {theme} = this.props
    const tabs = {}
    keys.map((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabContent {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  _tabNavigator() {
    // const topTab = createMaterialTopTabNavigator(TABS)
    const {theme} = this.props
    const {keys} = this.props
    const topTab = keys.length > 0 ? createMaterialTopTabNavigator(this._genTabs(), {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false, // 是否使标签大写，默认true
        scrollEnabled: true, // 选项卡滚动，默认false
        style: {
          backgroundColor: theme.themeColor, // TabBar的背景色
          height: 30, // 解决开启 scrollEnabled 后在android上初次加载时闪烁问题
        },
        indicatorStyle: styles.indicatorStyle, // 标签指示器颜色，切换滑动的那条线
        labelStyle: styles.labelStyle, // 文字的样式
      },
      lazy: true // 懒加载，只渲染一个tab，当点击某个tab栏目时候才加载这个tab下的数据
    }) : null
    return keys.length > 0 ? createAppContainer(topTab) : null
  }

  // 自定义状态栏，导航栏
  _customNavigationBar() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navgiationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    return navgiationBar
  }

  render() {
    const Top = this._tabNavigator()
    const customNavigationBar = this._customNavigationBar()
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 0 : 0}}>
        {/*<View style={{backgroundColor: 'gold', height: 32}}>*/}
        {/*<StatusBar barStyle = 'light-content' hidden="false"></StatusBar>*/}
        {/*</View>*/}
        {/*<View style={{backgroundColor: 'yellow', height: 40, justifyContent:'center',alignItems:'center'}}>*/}
        {/*<Text>最热</Text>*/}
        {/*</View>*/}
        {customNavigationBar}
        {Top && <Top/>}
        {/*<Top></Top>*/}
      </View>
    )
  }
}

/**
 * 针对标签tab的管理控制
 * */
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)
// export default PopularPage


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  PopularPage: {
    fontSize: 20
  },
  tabStyle: {
    // minWidth: 50,
    // height: 40
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
    // marginTop: 6,
    // marginBottom: 6
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    margin: 10
  }
})
