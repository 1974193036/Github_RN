/**
 * 关于作者
 * */

import React, {Component} from 'react';
import {
  Button,
  Clipboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import myconfig from '../../res/data/myconfig';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import Toast from 'react-native-easy-toast';


const THEME_COLOR = '#678';


export default class AboutMePage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    }, data => this.setState({...data}))
    this.state = {
      data: myconfig,
      showTurtorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    }
  }

  onClick(tab) {
    if (!tab) return
    if (tab.url) {
      NavigationUtil.goPage('WebViewPage', {
        title: tab.title,
        url: tab.url
      })
      return
    }
    if (tab.account && tab.account.indexOf('@') > -1) {

      // Linking.openURL('http://www.baidu.com') // 打开网页
      // Linking.openURL('tel:10086') // 拨打电话
      // Linking.openURL('smsto:13800138000') // 发送短信
      /**
       * 发邮件，真机上有效，模拟器（没有邮箱）有点问题
       * */
      let url = 'mailto://' + tab.account
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log('Can\'t handle url:' + url)
          } else {
            Linking.openURL(url)
          }
        })
        .catch(err => console.error('An error occurred', err))
      return
    }
    if (tab.account) {
      /**
       * setString: 内容复制到剪切板
       * getString: 获取剪切板内容
       * */
      Clipboard.setString(tab.account)
      this.toast.show(tab.account + '已复制到剪切板')
    }
  }

  _item(menu, isShow, key) {
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, menu.name, THEME_COLOR, Ionicons, menu.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }

  renderItems(dic, isShowAccout) {
    if (!dic) return null
    let views = []
    for (let i in dic) {
      let title = isShowAccout ? dic[i].title + ':' + dic[i].account : dic[i].title
      views.push(
        <View
          key={i}
        >
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, THEME_COLOR)}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }

  render() {
    const content = <View>
      {/*教程*/}
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTurtorial, 'showTurtorial')}
      <View style={GlobalStyles.line}/>
      {this.state.showTurtorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items, false) : null}

      {/*技术博客*/}
      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items, false) : null}

      {/*联系方式*/}
      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}

      {/*技术交流群*/}
      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}
    </View>
    return (<View style={{flex: 1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast
        ref={toast => this.toast = toast}
        position={'center'}
      />
    </View>)
  }
}
