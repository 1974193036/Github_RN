import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularItem extends Component {
  render() {
    const {item} = this.props
    if (!item || !item.owner) {
      return null
    }
    let favoriteButton = <TouchableOpacity
      style={{padding: 6}}
      underlayColor='transparent' // 按下的颜色
      onPress={() => {}}
    >
      <FontAwesome
        name={'star-o'}
        size={26}
        color={'red'}
      />
    </TouchableOpacity>
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.row}>
            <View style={styles.row_left}>
              <Text>Author：</Text>
              <Image
                style={{width: 22, height: 22}}
                source={{uri: item.owner.avatar_url}}
              />
            </View>
            <View style={styles.row_left}>
              <Text>Star：</Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {favoriteButton}
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