import React, {Component} from 'react';
import {Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity,} from 'react-native';
import CodePush from "react-native-code-push";
import ViewUtils from "../util/ViewUtil";
import NavigationBar from "../common/NavigationBar";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import GlobalStyles from "../res/style/GlobalStyles";
import NavigationUtil from "../navigator/NavigationUtil";

const deploymentKey = 'Xhr8Vjp9SlakEVrakKmRaNZpgy_Za10c7973-a6de-482f-ba51-d0d91f75e432'

class CodePushPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      restartAllowed: true,
      syncMessage: '',
      progress: {
        receivedBytes: 0,
        totalBytes: 0
      }
    }
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({syncMessage: "Checking for update."})
        break
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({syncMessage: "Downloading package."})
        break
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({syncMessage: "Awaiting user action."})
        break
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({syncMessage: "Installing update."})
        break
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({syncMessage: "App up to date.", progress: false})
        break
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({syncMessage: "Update cancelled by user.", progress: false})
        break
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({syncMessage: "Update installed and will be applied on restart.", progress: false})
        break
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({syncMessage: "An unknown error occurred.", progress: false})
        break
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({progress})
  }

  /** 更新以静默方式下载，并在重启时应用(推荐) */
  sync() {
    CodePush.checkForUpdate(deploymentKey).then((update) => {
      if (!update) {
        Alert.alert("提示", "已是最新版本", [
          {
            text: "Ok", onPress: () => {
            console.log("点了OK")
          }
          }
        ])
      } else {
        CodePush.sync(
          {deploymentKey: deploymentKey},
          this.codePushStatusDidChange.bind(this),
          this.codePushDownloadDidProgress.bind(this)
        )
      }
    })
  }

  /** Update弹出一个确认对话框，然后立即更新，或者重启更新应用程序 */
  syncImmediate() {
    CodePush.checkForUpdate(deploymentKey).then((update) => {
      if (!update) {
        Alert.alert("提示", "已是最新版本", [
          {
            text: "Ok", onPress: () => {
            console.log("点了OK");
          }
          }
        ])
      } else {
        CodePush.sync(
          {
            deploymentKey: deploymentKey,
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: true
          },
          this.codePushStatusDidChange.bind(this),
          this.codePushDownloadDidProgress.bind(this)
        )
      }
    })
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart() // 禁止重启
      : CodePush.allowRestart() // 在加载完了之后，允许重启

    this.setState({restartAllowed: !this.state.restartAllowed});
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
      .then((metadata: LocalPackage) => {
        this.setState({
          syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version",
          progress: false
        });
      }, (error: any) => {
        this.setState({syncMessage: "Error: " + error, progress: false});
      })
  }


  render() {
    let progressView
    // if (this.state.progress) {
    progressView = (
      <Text
        style={styles.messages}>
        {this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes received
      </Text>
    )
    // }
    const {theme} = this.props.navigation.state.params;


    return (
      <SafeAreaViewPlus
        style={GlobalStyles.root_container}
        topColor={theme.themeColor}
      >
        <NavigationBar
          style={theme.styles.navBar}
          leftButton={ViewUtils.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
          title={'CodePush'}
        />
        <Text style={styles.welcome}>
          Welcome to CodePush!
        </Text>
        <Button title={'Press for background sync'} onPress={this.sync.bind(this)}></Button>
        <Button title={'Press for dialog-driven sync'} onPress={this.syncImmediate.bind(this)}></Button>
        {progressView}
        <Button title={'Restart ' + (this.state.restartAllowed ? 'allowed' : 'forbidden')}
                onPress={this.toggleAllowRestart.bind(this)}></Button>
        <Button title={'Press for Update Metadata'} onPress={this.getUpdateMetadata.bind(this)}></Button>
        <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>

        <Text style={{marginTop: 100}}>测试检查更新 again222</Text>
      </SafeAreaViewPlus>
    )
  }
}

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL
}

// 这一行是必须的
CodePushPage = CodePush(codePushOptions)(CodePushPage)

export default CodePushPage

const styles = StyleSheet.create({
  messages: {
    marginTop: 30,
    textAlign: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
})