import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func
  }


  constructor(props) {
    super(props)
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    }
  }

  /**
   * componentWillReceiveProps在新版react中不能再用了
   * 下一个即将要变化的 isFavorite 与 上一次比较，如果有变化，返回 isFavorite
   * */
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite
      }
    }
    return null
  }

  onItemClick() {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite) // 详情页面的收藏按钮点击后会执行callback(true/false)，即执行this.setFavoriteState(isFavorite)，改变列表页面的收藏状态显示
      // this.setState({
      //   isFavorite: isFavorite
      // })
    })
  }

  setFavoriteState(isFavorite) {

    this.props.projectModel.isFavorite = isFavorite // 列表页点击收藏，然后点进详情页也会跟着改变收藏状态，改变详情页面接收到的参数

    // 改变页面收藏图标
    this.setState({
      isFavorite: isFavorite
    })
  }

  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite) // 收藏入库操作
  }

  _favoriteIcon() {
    return <TouchableOpacity
      style={{padding: 6}}
      underlayColor='transparent'
      onPress={() => this.onPressFavorite()}
    >
      <FontAwesome
        name={this.state.isFavorite ? 'star' : 'star-o'}
        size={26}
        color={'red'}
      />
    </TouchableOpacity>
  }
}