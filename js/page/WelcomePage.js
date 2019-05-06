import React, {Component} from 'react';
import {connect} from "react-redux";
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action';

/**
 * 欢迎页
 *
 * */

class WelcomePage extends Component {
  componentDidMount() {
    /**
     * 初始化主题
     * */
    this.props.onThemeInit()


    this.timer = setTimeout(()=>{
      // const {navigation} = this.props
      // navigation.navigate('Main')

      NavigationUtil.resetToHomePage({
        navigation: this.props.navigation
      })
    },200)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage</Text>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit())
})

export default connect(null, mapDispatchToProps)(WelcomePage)
// export default WelcomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20
  }
})