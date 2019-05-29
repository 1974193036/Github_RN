import React, {Component} from 'react';
import {Button, Linking, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';
import {MORE_MENU} from '../common/MORE_MENU';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {connect} from 'react-redux';
import actions from '../action';


const THEME_COLOR = '#678';

class MyPage extends Component {
  getRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {
        }}>
          <View style={{padding: 5, marginRight: 8}}>
            <Feather
              name={'search'}
              size={24}
              color={'#fff'}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  getLeftButton(callback) {
    return (
      <TouchableOpacity style={{padding: 8, paddingLeft: 12, marginTop: -2}} onPress={callback}>
        <View style={{padding: 5, marginRight: 8}}>
          <Ionicons
            name={'ios-arrow-back'}
            size={24}
            color={'#fff'}
          />
        </View>
      </TouchableOpacity>
    )
  }

  onClick(menu) {
    let RouteName, params = {}
    const {theme} = this.props
    // params.theme = theme
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://www.baidu.com/'
        break
      case MORE_MENU.About:
        RouteName = 'AboutPage'
        break
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        params.title = '关于作者'
        break
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage'
        params.flag = menu === MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_dao_language : FLAG_LANGUAGE.flag_dao_key
        params.isRemoveKey = menu === MORE_MENU.Remove_Key
        // params.theme = {
        //   themeColor: 'red'
        // }
        break
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_dao_key
        // params.theme = {
        //   themeColor: 'red'
        // }
        break
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_dao_language
        // params.theme = {
        //   themeColor: 'red'
        // }
        break
      case MORE_MENU.Custom_Theme: // 自定义主题
        const {onShowCustomThemeView} = this.props
        onShowCustomThemeView(true)
        break
      case MORE_MENU.Feedback: // 反馈
        const url = 'app-settings:'
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('can\'t handle url:' + url);
            } else {
              Linking.openURL(url)
            }
          })
          .catch(e => {
            console.error('an error occor');
          })
        break
      case MORE_MENU.CodePush:
        RouteName = 'CodePushPage'
        break
      default:
        break
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, {...params, theme: theme})
    }
  }

  getItem(menu) {
    const {theme} = this.props
    return ViewUtil.getMenuItem(
      () => this.onClick(menu),
      menu,
      theme.themeColor
    )
  }

  render() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navgiationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      leftButton={this.getLeftButton()}
      rightButton={this.getRightButton()}
      style={theme.styles.navBar}
    />

    return (
      <View style={GlobalStyles.root_container}>
        {navgiationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: theme.themeColor
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                color: theme.themeColor
              }}
            />
          </TouchableOpacity>
          {/*底部边框*/}
          <View style={GlobalStyles.line}></View>

          {/*教程*/}
          {this.getItem(MORE_MENU.Tutorial)}

          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line}></View>
          {/*语言排序*/}
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line}/>
          {/*标签排序*/}
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line}/>
          {/*标签移除*/}
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line}/>
          {/*关于作者*/}
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          {/*code-push*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
})

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)

const styles = StyleSheet.create({
  item: {
    height: 90,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    color: 'gray'
  }
})
