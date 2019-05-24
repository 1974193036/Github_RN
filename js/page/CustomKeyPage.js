import React, {Component} from 'react';
import BackPressComponent from '../common/BackPressComponent';
import {connect} from 'react-redux';
import actions from '../action/index';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import ViewUtil from '../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import CheckBox from 'react-native-check-box';
import ArrayUtil from '../util/ArrayUtil';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

const THEME_COLOR = '#678';

class CustomKeyPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    this.changeValues = [] // 选中的项是否发生了改变
    this.isRemoveKey = this.params.isRemoveKey // 是否是标签移除页面
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }

  /**
   * componentWillReceiveProps在新版react中不能再用了
   * 下一个即将要变化的 keys 与 上一次比较，如果有变化，返回 keys
   * */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState)
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()

    // /**
    //  * 第一次初始化，如果props中标签为空则从本地存储中获取标签
    //  * 第二次以后，CustomKeyPage._keys(this.props)的数据便存在了，不用重新走actions获取数据
    //  */
    // if (CustomKeyPage._keys(this.props).length === 0) {
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    // }

    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    if (this.changeValues.length > 0) {
      Alert.alert('提示', '要保存修改吗?', [
        {
          text: '否',
          onPress: () => {
            // /** 重新获取数据，以便下次再次进入此页面保持数据对应的勾选状态 */
            // const {onLoadLanguage} = this.props
            // onLoadLanguage(this.params.flag)
            NavigationUtil.goBack(this.props.navigation)
          }
        }, {
          text: '是',
          onPress: () => {
            this.onSave()
          }
        }
      ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation)
      return
    }
    // 更新本地数据
    this.languageDao.save(this.state.keys)
    /** 更新store，
     * 使得最热或者趋势页面重新执行render
     * */
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)

    NavigationUtil.goBack(this.props.navigation)
  }

  /**
   * 获取标签
   * @param props
   * @param original 移除标签时使用，是否需要使用原始数据
   * @param state 移除标签时使用
   * @returns {*}
   * @private
   * */
  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_dao_key ? 'keys' : 'languages'
    if (isRemoveKey && !original) {
      // 标签移除
      // 如果state里面的keys为空则从props里面取
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(v => ({
        ...v,
        checked: false
      }))
    } else {
      // 自定义标签或语言
      return props.language[key]
    }
  }


  onClick(item, index) {
    // console.log(item, index)
    item.checked = !item.checked
    ArrayUtil.updateArray(this.changeValues, item) // 判断是否有了选中操作或者取消选中操作
    this.state.keys[index] = item // 更新state以便显示选中状态
    this.setState({
      keys: this.state.keys
    })
  }

  /**
   * 设置 CheckBox 选中和未选中的icon
   * */
  _checkedImage(checked) {
    const {theme} = this.params
    return (<Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      color={theme.themeColor}
    />)
  }

  renderCheckBox(item, index) {
    return (<CheckBox
      style={{flex: 1, padding: 10}}
      onClick={() => this.onClick(item, index)}
      isChecked={item.checked}
      leftText={item.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />)
  }

  renderView() {
    // console.log(this.state.keys)
    let dateArray = this.state.keys
    if (!dateArray || dateArray.length === 0) {
      return null
    }
    let len = dateArray.length
    let views = []
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.items}>
            {this.renderCheckBox(dateArray[i], i)}
            {i + 1 < len && this.renderCheckBox(dateArray[i + 1], i + 1)}
          </View>
          <View style={styles.line}></View>
        </View>
      )
    }
    return views
  }

  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签'
    title = this.params.flag === FLAG_LANGUAGE.flag_dao_language ? '自定义语言' : title
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
    let statusBar = {
      backgroundColor: this.params.theme.themeColor,
      barStyle: 'light-content'
    }
    let navgiationBar = <NavigationBar
      title={title}
      statusBar={statusBar}
      style={{backgroundColor: this.params.theme.themeColor}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightBackButton(rightButtonTitle, () => this.onSave())}
    />
    return (
      <SafeAreaViewPlus topColor={this.params.theme.themeColor}>
        {navgiationBar}
        <ScrollView>
          {this.renderView()}
        </ScrollView>
      </SafeAreaViewPlus>
    )
  }
}

const mapPopularStateToProps = state => ({
  language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  items: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'darkgray'
  }
})