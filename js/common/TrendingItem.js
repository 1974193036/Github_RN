/**
 * 趋势 页面的列表单项
 *
 * */

import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';
import BaseItem from './BaseItem';

export default class TrendingItem extends BaseItem {
  render() {
    const {projectModel} = this.props
    const { item } = projectModel
    if (!item) {
      return null
    }
    // let favoriteButton = <TouchableOpacity
    //   style={{padding: 6}}
    //   underlayColor='transparent' // 按下的颜色
    //   onPress={() => {}}
    // >
    //   <FontAwesome
    //     name={'star-o'}
    //     size={26}
    //     color={'red'}
    //   />
    // </TouchableOpacity>

    /** HTMLView：解析html标签 */

    return (
      <TouchableOpacity onPress={() => this.onItemClick()}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.fullName}</Text>
          {/*<Text style={styles.description}>{item.description}</Text>*/}
          <HTMLView
            value={'<p>' + item.description + '</p>'}
            onLinkPress={(url) => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built by:</Text>
              {item.contributors && item.contributors.map((result, i, arr) => {
                return <Image
                  key={i}
                  style={{ height: 22, width: 22, margin: 2 }}
                  source={{ uri: arr[i] }}
                />
              })}
            </View>
            <View style={styles.row_left}>
              <Text>Star：</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row_left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  }
})