import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  DeviceInfo,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import Toast from 'react-native-easy-toast';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import {connect} from 'react-redux';
import actions from '../action/index';
import FavoriteDao from '../expand/dao/FavoriteDao';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import PopularItem from '../common/PopularItem';
import FavoriteUtil from '../util/FavoriteUtil';
import Utils from '../util/Util';

const PAGE_SIZE = 10; // 设为常数, 防止修改

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_dao_key)
    this.isKeyChange = false
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentDidMount()
  }

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation)
    EventBus.getInstance().fireEvent(EventTypes.back)
    this.refs.input.blur()

    // 如果点击了搜索正在请求接口还未响应成功，退出时取消搜索
    if (this.searchToken) {
      this.props.onSearchCancel(this.searchToken)
    }

    // 如果保存了新标签，则重新加载标签
    if (this.isKeyChange) {
      this.props.onLoadLanguage(FLAG_LANGUAGE.flag_dao_key)
    }

    return true
  }

  // 保存标签
  saveKey() {
    const {keys} = this.props
    let key = this.inputKey
    if (Utils.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在')
    } else {
      keys.unshift({
        path: key,
        name: key,
        short_name: this.inputKey,
        checked: true
      })
      this.languageDao.save(keys)
      this.toast.show(key + '保存成功')
      this.isKeyChange = true
    }
  }

  loadData(loadMore) {
    const {onSearch, onLoadMoreSearch, keys, search} = this.props
    if (loadMore) {
      onLoadMoreSearch(++search.pageIndex, PAGE_SIZE, search.items, this.favoriteDao, () => {
        this.toast.show('没有更多了')
      })
    } else {
      this.inputKey = this.inputKey || search.inputKey
      onSearch(this.inputKey, PAGE_SIZE, this.searchToken = new Date().getTime(), this.favoriteDao, keys, (message) => {
        this.toast.show(message)
      })
    }
  }

  // 点击头部搜索
  onRightButtonClick() {
    const {showText} = this.props.search
    if (showText === '搜索') {
      this.loadData()
    } else {
      this.props.onSearchCancel(this.searchToken)
    }
  }

  // 头部搜索栏
  renderNavBar() {
    const {theme} = this.params
    const {showText, inputKey} = this.props.search
    const placeholder = inputKey || '请输入'
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress())
    let inputView = <TextInput
      ref={'input'}
      placeholder={placeholder}
      onChangeText={text => this.inputKey = text}
      style={styles.textInput}
    >
    </TextInput>
    let rightButton =
      <TouchableOpacity
        onPress={() => {
          this.refs.input.blur() // 收起键盘
          this.onRightButtonClick()
        }}
      >
        <View style={{marginRight: 10}}>
          <Text style={styles.title}>{showText}</Text>
        </View>
      </TouchableOpacity>
    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
      height: (Platform.OS === 'ios') ? (DeviceInfo.isIPhoneX_deprecated ? GlobalStyles.nav_bar_height_ios : 70) : GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  // 上拉加载loading效果
  genIndicator() {
    const {theme} = this.params
    const {hideLoadingMore} = this.props.search
    return hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={theme.themeColor} style={styles.indicator}/>
        <Text style={{color: theme.themeColor}}>正在加载更多</Text>
      </View>
    )
  }

  // 列表每一项
  renderItem(data) {
    const item = data.item
    const {theme} = this.params
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
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />)
  }

  render() {
    const {isLoading, showBottomButton, projectModels} = this.props.search
    const {theme} = this.params
    let statusBar = null
    if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {
      statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]}/>
    }
    let listView = !isLoading ? <FlatList
      data={projectModels}
      renderItem={data => this.renderItem(data)}
      keyExtractor={(item, index) => '' + item.item.id}
      contentInset={{
        bottom: 45
      }}
      refreshControl={
        <RefreshControl
          title={'加载中...'}
          titleColor={theme.themeColor} // ios的 '加载中' 文字颜色
          tintColor={theme.themeColor} // ios的 loading 颜色
          colors={[theme.themeColor]} // android的 loading 颜色
          refreshing={isLoading} // 显示下拉刷新loading
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
    /> : null

    // 点击搜索后的loading效果
    let indicatorView = isLoading ? (<ActivityIndicator
      color={theme.themeColor}
      size={'large'}
      style={styles.centering}
    />) : null

    // 搜索结果列表
    let resultView = <View style={{flex: 1}}>
      {indicatorView}
      {listView}
    </View>

    // 底部按钮保存标签
    let bottomButton = showBottomButton ?
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.saveKey()
        }}
      >
        <View>
          <Text style={styles.title}>朕收下了</Text>
        </View>
      </TouchableOpacity> : null

    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast
          ref={toast => this.toast = toast}
          position={'center'}
        />
      </View>
    )
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  search: state.search
})

const mapPopularDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
  onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SearchPage)
// export default SearchPage


const styles = StyleSheet.create({
  statusBar: {
    height: 20
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500'
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: "#fff",
    // alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: '#fff'
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    margin: 10
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0),
    right: 10,
    borderRadius: 3
  }
})