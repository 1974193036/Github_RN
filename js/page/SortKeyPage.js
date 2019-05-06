import React, {Component} from 'react';
import BackPressComponent from '../common/BackPressComponent';
import {connect} from 'react-redux';
import actions from '../action/index';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import ViewUtil from '../util/ViewUtil';
import {Alert, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import ArrayUtil from '../util/ArrayUtil';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const THEME_COLOR = '#678';


class SortKeyPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      // keys: [],
      checkedArray: SortKeyPage._keys(this.props), // 已经选择的标签的集合
    }
  }

  /**
   * componentWillReceiveProps在新版react中不能再用了
   *
   * 从props中获取state, 将传入的props映射到state上面
   *
   * 下一个即将要变化的 checkedArray 与 上一次比较，如果有变化，返回 checkedArray
   * 该方法在render方法被调用之前调用，因此在初始化组件或者组件更新是都会被调用，与原来的componentWillReceiveProps方法不同，componentWillReceiveProps方法只有在父组件重新render的情况下才会调用
   * */
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps')
    const checkedArray = SortKeyPage._keys(nextProps, prevState)
    if (prevState.checkedArray !== checkedArray) {
      return {
        checkedArray: checkedArray
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()

    // /**
    //  * 第一次初始化，如果props中标签为空则从本地存储中获取标签
    //  * 第二次以后，SortKeyPage._keys(this.props)的数据在reducer中便存在了，不用重新走actions获取数据
    //  */
    if (SortKeyPage._keys(this.props).length === 0) {
      const {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('提示', '要保存修改吗?', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.goBack(this.props.navigation)
          }
        }, {
          text: '是',
          onPress: () => {
            this.onSave(true)
          }
        }
      ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onSave(hasChecked) {
    // 如果没有排序直接返回(原始数据和state里面的数据进行匹对)
    if (!hasChecked) {
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return
      }
    }
    // 保存排序后的数据
    // 更新本地数据
    this.languageDao.save(this.getSortResult())

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
   * @param state
   * @returns {*}
   * @private
   * */
  static _keys(props, state) {
    // 如果state中有checkedArray则使用state中的checkedArray
    // 使得拖动后的列表得以更新
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    // 否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props)
    let dataArray = props.language[flag] || []
    // 遍历出被选中的语言或标签项
    return dataArray.filter(v => v.checked)
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_dao_key ? 'keys' : 'languages'
  }


  /**
   * 获取排序后的结果
   * */
  getSortResult() {
    const flag = SortKeyPage._flag(this.props)
    // 从原始数据中复制一份数据出来，以便对这份数据进行排序
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    // 获取排序之前的排列顺序
    const originalCheckedArray = SortKeyPage._keys(this.props)
    // 遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0; i < originalCheckedArray.length; i++) {
      let item = originalCheckedArray[i]
      // 找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item)
      // 进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
    return sortResultArray
  }


  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_dao_language ? '语言排序' : '标签排序'
    let rightButtonTitle = '保存'
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
      <View style={styles.container}>
        {navgiationBar}
        <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={row => <SortCell data={row} {...this.params}/>}
        />
      </View>
    )
  }
}


class SortCell extends Component {
  render() {
    return (
      <TouchableOpacity
        underlayColor={'#eee'}
        style={this.props.data.checked ? styles.item : styles.hidden}
        {...this.props.sortHandlers}
      >
        <View style={{marginLeft: 10, flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name={'sort'}
            size={16}
            style={{marginRight: 10, color: this.props.theme.themeColor}}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapPopularStateToProps = state => ({
  language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

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
  },
  item: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  },
  hidden: {
    height: 0
  }
})