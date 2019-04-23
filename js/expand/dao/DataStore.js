import {AsyncStorage} from 'react-native';
import GitHubTrending from 'GitHubTrending';

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_favorite: 'favorite'};

export default class DataStore {
  /**
   * 保存数据到本地storage
   * @param {*} url
   * @param {*} data
   * @param {*} callback
   */
  saveData(url, data, callback) {
    if (!data || !url) return
    AsyncStorage.setItem(url, JSON.stringify(this._warpData(data)), callback)
  }

  /**
   * 数据包裹, 添加时间戳
   * @param {*} data
   */
  _warpData(data) {
    return {data: data, timestamp: new Date().getTime()}
  }

  /**
   * 获取本地数据
   * @param {} key
   */
  fetchLocalData(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
            console.error(e)
          }
        } else {
          reject(error)
          console.error(error)
        }
      })
    })
  }

  /**
   * 获取网络数据
   * @param {*} url
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Network resonse was not ok.')
          })
          .then((responseData) => {
            this.saveData(url, responseData)
            resolve(responseData)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        new GitHubTrending().fetchTrending(url)
          .then(items => {
            if (!items) {
              throw new Error('responseData is null')
            }
            this.saveData(url, items)
            resolve(items)
          })
          .catch((error) => {
            reject(error)
          })
      }
    })
  }

  /**
   * 最后
   * 对外入口
   * */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then((warppedData) => {
          if (warppedData && DataStore.checkTimestampValid(warppedData.timestamp)) {
            resolve(warppedData)
          } else {
            this.fetchNetData(url, flag)
              .then((data) => {
                resolve(this._warpData(data))
              })
              .catch((error) => {
                reject(error)
              })
          }
        })
        .catch((error) => {
          this.fetchNetData(url, flag)
            .then((data) => {
              this._warpData(data)
            })
            .catch((error) => {
              reject(error)
            })
        })
    })
  }

  /**
   * 检查时间戳是否在有效期之内
   * */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date()
    const targetDate = new Date()
    targetDate.setTime(timestamp)
    // 当月当天不超过4小时，缓存有效
    // if (currentDate.getFullYear() !== targetDate.getFullYear()) return false
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDay() !== targetDate.getDay()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;

    return true
  }
}