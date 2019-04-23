import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';

/**
 * setParams 设置参数
 * 会把设置的参数 存入 this.props.navigation.state的routes对应的"Trending"，其他组件共享
 * this.props.navigation.state = {
 *    index: 1
      isTransitioning: false
      routes: [
        {key: "Popular", routeName: "Popular", params: undefined}
        {key: "Trending", routeName: "Trending", params: {
          theme: {
            tintColor: "red",
            updateTime: 1553943061525
          }
         }}
        {key: "Favorite", routeName: "Favorite", params: undefined}
      ]
    }
 * */
class TrendingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.TrendingPage}>TrendingPage</Text>
        <Button
          title="改变主题颜色"
          onPress={() => {
            // this.props.navigation.setParams({
            //   theme: {
            //     tintColor: 'red',
            //     updateTime: new Date().getTime()
            //   }
            // })
            this.props.onThemeChange('red')
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = (dispatch) => ({
  onThemeChange: (theme) => {
    dispatch(actions.onThemeChange(theme))
  }
})

// export default TrendingPage
export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  TrendingPage: {
    fontSize: 20
  }
})
