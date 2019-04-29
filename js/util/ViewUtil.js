import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default class ViewUtil {
  /**
   * 返回按钮
   * @param {回调方法} callback
   */
  static getLeftBackButton(callback) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callback}>
      <Ionicons
        name={'ios-arrow-back'}
        size={24}
        color={'#fff'}
      />
    </TouchableOpacity>
  }

  /**
   * 分享按钮
   * @param {回调方法} callback
   */
  static getShareButton(callback) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callback}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{opacity: 0.9, marginRight: 10, color: '#fff'}}
      />
    </TouchableOpacity>
  }


  static getMenuItem(callback, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIcon)
  }

  /**
   * 获取设置页的Item
   * @param callback
   * @text 显示的文本
   * @color 图标颜色
   * @Icons react-native-vector-icons/Ionicons组件
   * @icon 左侧图标
   * @expandableIcon 右侧图标
   */
  static getSettingItem(callback, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callback}
        style={styles.setting_item_container}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {Icons && icon ?
            <Icons
              name={icon}
              size={16}
              style={{color: color, marginRight: 10}}
            /> :
            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={16}
          style={{marginRight: 10, alignSelf: 'center', color: color || 'black'}}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})