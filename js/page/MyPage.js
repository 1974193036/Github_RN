import React, {Component} from 'react';
import {Button, Modal, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';

const THEME_COLOR = '#678';

export default class MyPage extends Component {
  state = {
    modalVisible: false
  }

  // getRightButton() {
  //   return (
  //     <View style={{flexDirection: 'row'}}>
  //       <TouchableOpacity onPress={() => {
  //       }}>
  //         <View style={{padding: 5, marginRight: 8}}>
  //           <Feather
  //             name={'search'}
  //             size={24}
  //             color={'#fff'}
  //           />
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

  // getLeftButton(callback) {
  //   return (
  //     <TouchableOpacity style={{padding: 8, paddingLeft: 12, marginTop: -2}} onPress={callback}>
  //       <View style={{padding: 5, marginRight: 8}}>
  //         <Ionicons
  //           name={'ios-arrow-back'}
  //           size={24}
  //           color={'#fff'}
  //         />
  //       </View>
  //     </TouchableOpacity>
  //   )
  // }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navgiationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      leftButton={ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
      style={{backgroundColor: THEME_COLOR}}
    />

    return (
      <View style={styles.container}>
        {navgiationBar}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.MyPage}>MyPage</Text>
          <Text style={styles.MyPage}>MyPage1</Text>
          <Text style={styles.MyPage}>MyPage2</Text>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.")
            }}
          >
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
              <View style={{padding: 20, backgroundColor: '#fff'}}>
                <Text>Hello World!</Text>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({modalVisible: !this.state.modalVisible})
                  }}
                >
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <Button
            title="跳转到详情页"
            onPress={() => {
              NavigationUtil.goPage(
                'DetailPage', {
                  projectModel: {
                    item: {
                      html_url: 'http://www.baidu.com',
                      full_name: '百度'
                    }
                  }
                }
              )
            }}/>
          <Button
            title="跳转到FetchDemoPage页面"
            onPress={() => {
              NavigationUtil.goPage(
                'FetchDemoPage', {}
              )
            }}/>
          <Button
            title="跳转到AsyncStorageDemoPage页面"
            onPress={() => {
              NavigationUtil.goPage(
                'AsyncStorageDemoPage', {}
              )
            }}/>
          <Button
            title="跳转到DataStoreDemoPage页面(离线缓存框架)"
            onPress={() => {
              NavigationUtil.goPage(
                'DataStoreDemoPage', {}
              )
            }}/>
          <Button
            title="modal测试"
            onPress={() => {
              this.setState({modalVisible: true})
            }}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF'
  },
  MyPage: {
    fontSize: 20
  }
})
