import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) { // flag 区分是 最热模块 还是 趋势模块 的收藏
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag
  }

  /**
   * 对外接口
   *
   * 收藏项目, 保存收藏的项目
   * key 项目的id,
   * value 收藏的项目
   * callback 回调
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error) => {
      if (!error) {
        this.updateFavoriteKeys(key, true)
      }
    })
  }

  /**
   * 对外接口
   *
   * 删除项目
   * key 项目的id
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }

  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = []
        if (result) {
          favoriteKeys = JSON.parse(result)
        }
        let index = favoriteKeys.indexOf(key)
        if (isAdd) { // 如果是添加且 key 不在在则添加到数组中
          if (index === -1) favoriteKeys.push(key)
        } else { //如果是删除且 key 存在则将其从数值中移除
          if (index !== -1) favoriteKeys.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
      }
    })
  }


  /**
   * 对外接口
   *
   * 获取所有收藏的keys
   */
  getFavoriteKeys() {
    return new Promise((reslove, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            reslove(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }


  /**
   * 对外接口
   *
   * 获取所有收藏的keys对应的数据，数据展示在收藏页面
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = []
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0]
                let value = store[i][1]
                if (value) items.push(JSON.parse(value))
              });
              resolve(items)
            } catch (e) {
              reject(e)
            }
          })
        } else {
          resolve(items)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }
}