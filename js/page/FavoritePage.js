import React, {Component} from 'react';
import {Button, DeviceInfo, FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

const THEME_COLOR = '#678';

// class FavoriteTabPage extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.PopularPage}>{this.props.tabLabel}页面</Text>
//       </View>
//     )
//   }
// }
class FavoriteTab extends Component {
  constructor(props) {
    super(props)
    const {flag} = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(flag)
  }

  componentDidMount() {
    this.loadData()
    /**
     * 监听底部导航栏切换的事件
     * 从其他页面切换到当前收藏页面，to=2，索引值
     * */
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 2) {
        this.loadData()
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener)
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  _store() {
    const {favorite} = this.props
    let store = favorite[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
      }
    }
    return store
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag) // 删库操作
    /**
     * 发送事件，被其他页面监听
     *  */
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
    }
  }

  renderItem(data) {
    const {item} = data
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage('DetailPage', {
          projectModel: item,
          flag: this.storeName,
          whoGo: 'favorite_go',
          callback
        })
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }

  render() {
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'加载中...'}
              titleColor={'red'} // ios的 '加载中' 文字颜色
              tintColor={'red'} // ios的 loading 颜色
              colors={['green']} // android的 loading 颜色
              refreshing={store.isLoading} // 显示下拉刷新loading
              onRefresh={() => this.loadData(true)} // 下拉刷新回调
            />
          }
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite
})

const mapDispatchToProps = disptch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => disptch(actions.onLoadFavoriteData(storeName, isShowLoading))
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)


export default class FavoritePage extends Component {
  constructor(props) {
    super(props)
    this.tabNames = [
      {name: '最热', flag: FLAG_STORAGE.flag_popular},
      {name: '趋势', flag: FLAG_STORAGE.flag_trending}
    ]
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <FavoriteTabPage {...props} tabLabel={item.name} flag={item.flag}/>,
        navigationOptions: {
          title: item.name
        }
      }
    })
    return tabs
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    }
    let navgiationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: false,
          style: {
            backgroundColor: '#678',
            height: 30
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器颜色，切换滑动的那条线
          labelStyle: styles.labelStyle // 文字的样式
        }
      }
    ))
    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 0 : 0}}>
      {navgiationBar}
      <TabNavigator/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabStyle: {
    // minWidth: 30
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  PopularPage: {
    fontSize: 20
  }
})