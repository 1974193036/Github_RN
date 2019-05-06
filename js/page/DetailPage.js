import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, WebView, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import { NavigationActions } from "react-navigation";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';
import {FLAG_STORAGE} from '../expand/dao/DataStore';

const THEME_COLOR = '#678';
const TRENDING_URL ='https://github.com/';

export default class DetailPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { projectModel, flag } = this.params

    const url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
    const title = projectModel.item.full_name || projectModel.item.fullName

    this.favoriteDao = new FavoriteDao(flag)

    this.state = {
      title: title,
      url: url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
    }

    /**
     * 处理安卓的物理返回键
     * */
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓的物理返回键
   * */
  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    // 从列表页 进入 webview页面时：canGoBack=false
    // webview页面内，首页跳转到下一级页面时：canGoBack=true
    // 一直回退到 webview 首页时，此时：canGoBack=true ??????????????????
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
    // NavigationUtil.goBack(this.props.navigation)
  }

  // webview内的导航状态发生变化触发
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
      canGoForward: navState.canGoForward
    })
  }

  onFavoriteButtonClick() {
    const { projectModel, callback, whoGo, flag } = this.params
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite

    // 更新 item 收藏信息
    callback(isFavorite)

    // 改变页面收藏图标
    this.setState({
      isFavorite: isFavorite
    })

    // 收藏入库操作
    // FavoriteUtil.onFavorite(this.favoriteDao, projectModel.item, isFavorite, FLAG_STORAGE.flag_popular)
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }

    /**
     * 发送事件，被其他页面监听
     *  */
    if(whoGo) {
      if (flag === FLAG_STORAGE.flag_popular) {
        EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
      } else {
        EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
      }
    }
  }

  renderRightButton() {
    return (<View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => this.onFavoriteButtonClick()}
      >
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{color: '#fff', marginRight: 10}}
        />
      </TouchableOpacity>
      {ViewUtil.getShareButton(() => {

      })}
    </View>)
  }

  render() {
    const {theme} = this.params
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navgiationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={this.renderRightButton()}
      titleLayoutStyle={titleLayoutStyle}
      style={theme.styles.navBar}
    />
    return (
      <View style={styles.container}>
        {navgiationBar}
        {/*<Text style={styles.HomePage}>DetailPage</Text>*/}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  HomePage: {
    fontSize: 20
  }
})
