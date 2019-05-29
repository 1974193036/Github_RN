/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Button, Platform, StyleSheet, Text, View} from 'react-native';


import CodePush from "react-native-code-push"; // 引入code-push


let codePushOptions = {
  //设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //MANUAL 手动检查
  checkFrequency: CodePush.CheckFrequency.MANUAL
};


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
  'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
})

const deploymentKey = 'Xhr8Vjp9SlakEVrakKmRaNZpgy_Za10c7973-a6de-482f-ba51-d0d91f75e432'

class App extends Component {
  //如果有更新的提示
  // syncImmediate() {
  //   CodePush.sync({
  //       //安装模式
  //       //ON_NEXT_RESUME 下次恢复到前台时
  //       //ON_NEXT_RESTART 下一次重启时
  //       //IMMEDIATE 马上更新
  //       installMode: CodePush.InstallMode.IMMEDIATE,
  //       deploymentKey: 'Xhr8Vjp9SlakEVrakKmRaNZpgy_Za10c7973-a6de-482f-ba51-d0d91f75e432',
  //       //对话框
  //       updateDialog: {
  //         //是否显示更新描述
  //         appendReleaseDescription: true,
  //         //更新描述的前缀。 默认为"Description"
  //         descriptionPrefix: "更新内容：",
  //         //强制更新按钮文字，默认为continue
  //         mandatoryContinueButtonLabel: "立即更新",
  //         //强制更新时的信息. 默认为"An update is available that must be installed."
  //         mandatoryUpdateMessage: "必须更新后才能使用",
  //         //非强制更新时，按钮文字,默认为"ignore"
  //         optionalIgnoreButtonLabel: '稍后',
  //         //非强制更新时，确认按钮文字. 默认为"Install"
  //         optionalInstallButtonLabel: '后台更新',
  //         //非强制更新时，检查到更新的消息文本
  //         optionalUpdateMessage: '有新版本了，是否更新？',
  //         //Alert窗口的标题
  //         title: '更新提示'
  //       },
  //     },
  //   );
  // }

  // componentDidMount() {
  //   CodePush.allowRestart();// 在加载完了之后，允许重启
  //   this.syncImmediate(); // 开始检查更新
  // }
  //
  // componentWillMount() {
  //   CodePush.disallowRestart();// 禁止重启
  // }

  upDate() {
    CodePush.checkForUpdate(deploymentKey).then((update) => {
      if (!update) {
        Alert.alert("提示", "已是最新版本--", [
          {
            text: "Ok", onPress: () => {
            console.log("点了OK");
          }
          }
        ]);
      } else {
        CodePush.sync({
            deploymentKey: deploymentKey,
            updateDialog: {
              optionalIgnoreButtonLabel: '稍后',
              optionalInstallButtonLabel: '立即更新',
              optionalUpdateMessage: '有新版本了，是否更新？',
              title: '更新提示'
            },
            installMode: CodePush.InstallMode.IMMEDIATE,
          },
          (status) => {
            switch (status) {
              case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("DOWNLOADING_PACKAGE");
                break;
              case CodePush.SyncStatus.INSTALLING_UPDATE:
                console.log("INSTALLING_UPDATE");
                break;
            }
          },
          (progress) => {
            console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
          }
        );
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title={'检查更新'} onPress={this.upDate}></Button>
      </View>
    )
  }
}

//这一行是必须的
App = CodePush(codePushOptions)(App);
// App = CodePush(App);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
