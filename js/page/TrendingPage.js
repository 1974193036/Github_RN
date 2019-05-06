import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  DeviceEventEmitter,
  DeviceInfo,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationUtil from '../navigator/NavigationUtil';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';

// export default class PopularPage extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.PopularPage}>PopularPage</Text>
//       </View>
//     )
//   }
// }
const URL = 'https://github.com/trending/';
const PAGE_SIZE = 10; // 设为常数, 防止修改
const THEME_COLOR = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

class TrendingContent extends Component {
  constructor(props) {
    super(props)
    const {tabLabel, timeSpan} = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
    this.isFavoriteChanged = false
  }

  componentDidMount() {
    this.loadData()
    /**
     * 父组件点击选择时间后，父组件未重新渲染并且传过来的props的timeSpan也未发生变化，这个子组件也不会重新渲染
     * 监听点击事件强制重新渲染
     * */
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan
      this.loadData()
    })


    /**
     * 监听收藏页面列表项点击收藏按钮事件
     * 监听底部导航栏切换的事件，从其他页面切换到当前页面，to=0，索引值
     * */
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
  }

  componentWillUnmount() {
    this.timeSpanChangeListener && this.timeSpanChangeListener.remove()

    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      // 上拉加载更多
      onLoadMoreTrending(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, favoriteDao, () => {
        this.refs.toast.show('没有更多了')
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao)
    } else {
      // 下拉刷新
      onRefreshTrending(this.storeName, url, PAGE_SIZE, favoriteDao)
    }
  }

  _store() {
    const {trending} = this.props
    let store = trending[this.storeName]
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
    return URL + key + '?' + this.timeSpan.searchText
    // return URL + key + '?' + 'since=daily'
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
    return (<TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage('DetailPage', {
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        })
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
    console.log(this.timeSpan.searchText)
    return (
      <View style={styles.container}>
        {/*<Text style={styles.PopularPage}>{this.storeName}</Text>*/}
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => '' + (item.item.id || item.item.fullName)}
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
  trending: state.trending
})

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => {
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
  }
})

const TrendingTabContent = connect(mapStateToProps, mapDispatchToProps)(TrendingContent)

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
class TrendingPage extends Component {
  constructor(props) {
    super(props)
    // this.tabNames = ['All', 'Objective-c', 'Swift', 'C++']
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_dao_language)
    this.preLanguages = [] // 保存上一次的tab项内容
    this.state = {
      timeSpan: TimeSpans[0],
    }
  }

  /**
   * _genTabs：动态配置生成tabs
   *
   * 动态设置切换的内容：
   * screen: props => <PopularContent {...props} tabLabel={item}/>,
   * */
  _genTabs() {
    const {languages} = this.props
    const {theme} = this.props
    const tabs = {}
    this.preLanguages = languages
    languages.map((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabContent {...props} tabLabel={item.name} timeSpan={this.state.timeSpan} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  // 弹窗组件
  renderTrendingDialog() {
    return (<TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />)
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss()
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
  }

  _tabNavigator() {
    // const topTab = createMaterialTopTabNavigator(TABS)

    const {theme} = this.props
    const {languages} = this.props

    /**
     * 优化效果：
     * 根据需要选择，并且tab项内容是否改变，来重新创建 tabNavigator
     * */
    if (theme === this.theme && this.topTab && ArrayUtil.isEqual(languages, this.preLanguages)) {
      this.theme = theme
      return this.topTab
    }

    this.topTab = languages.length > 0 ? createAppContainer(createMaterialTopTabNavigator(this._genTabs(), {
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
    })) : null
    return this.topTab
  }

  _titleView() {
    // console.log(this.state.timeSpan.showText)
    return <TouchableOpacity
      underlayColor='transparent'
      onPress={() => this.dialog.show()}
    >
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{
          fontSize: 18,
          color: '#FFFFFF',
          fontWeight: '400'
        }}>
          趋势 {this.state.timeSpan.showText}
          <MaterialIcons
            name={'arrow-drop-down'}
            size={14}
            color={'white'}
          />
        </Text>
      </View>
    </TouchableOpacity>
  }

  // 自定义状态栏，导航栏
  _customNavigationBar() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navgiationBar = <NavigationBar
      titleView={this._titleView()}
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
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

/**
 * 针对标签tab的管理控制
 * */
const mapTrendingStateToProps = state => ({
  languages: state.language.languages,
  theme: state.theme.theme
})

const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)
// export default TrendingPage


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
