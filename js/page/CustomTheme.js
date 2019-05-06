import React, {Component} from 'react';
import {DeviceInfo, Modal, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {connect} from 'react-redux';
import ThemeDao from '../expand/dao/ThemeDao';
import GlobalStyles from '../res/style/GlobalStyles';
import ThemeFactory, {ThemeFlags} from '../res/style/ThemeFactory';
import actions from '../action';


class CustomTheme extends Component {
  constructor(props) {
    super(props)
    this.themeDao = new ThemeDao()
  }

  // 点击事件
  onSelectTheme(themeKey) {
    this.props.onClose()
    this.themeDao.save(ThemeFlags[themeKey])
    this.props.onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]))
  }

  /**
   * 创建主题Item
   * @param themeKey
   */
  getThemeItem(themeKey) {
    return (<TouchableHighlight
      style={{flex: 1}}
      underlayColor={'#fff'}
      onPress={() => this.onSelectTheme(themeKey)}
    >
      <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
        <Text style={styles.themeText}>{themeKey}</Text>
      </View>
    </TouchableHighlight>)
  }

  renderThemeItems() {
    const views = []
    const keys = Object.keys(ThemeFlags)
    for (let i = 0, l = keys.length; i < l; i += 3) {
      // 每3个为一行
      const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2]
      views.push(<View key={i} style={{flexDirection: 'row'}}>
        {this.getThemeItem(key1)}
        {this.getThemeItem(key2)}
        {this.getThemeItem(key3)}
      </View>)
    }
    return views
  }

  renderContentView() {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose()
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {this.renderThemeItems()}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  render() {
    return this.props.visible ? (<View style={GlobalStyles.root_container}>
      {this.renderContentView()}
    </View>) : null
  }
}


const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
})

export default connect(null, mapDispatchToProps)(CustomTheme)



const styles = StyleSheet.create({
  themeItem: {
    // flex: 1,
    height: 120,
    margin: 3,
    // padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 10,
    marginBottom: 10 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
    marginTop: Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3
  },
  themeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16
  }
})
