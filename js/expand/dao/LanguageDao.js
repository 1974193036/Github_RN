import React from 'react';
import {AsyncStorage} from 'react-native';
import keys from '../../res/data/config.json';
import languages from '../../res/data/languages.json';

/**
 * 最热模块是标签key
 * 趋势模块是语言language
 * */
export const FLAG_LANGUAGE = {flag_dao_language: 'flag_dao_language', flag_dao_key: 'flag_dao_key'};

export default class LanguageDao {
  constructor(flag) {
    this.flag = flag
  }

  /**
   * 获取语言或标签
   */
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          /** 如果数据为空，则初始化数据 */
          let data = this.flag === FLAG_LANGUAGE.flag_dao_language ? languages : keys
          this.save(data)
          resolve(data)
        } else {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        }
        // let data = this.flag === FLAG_LANGUAGE.flag_dao_language ? languages : keys
        // this.save(data)
        // resolve(data)
      })
    })
  }

  /**
   * 保存语言或标签
   */
  save(data) {
    let stringifyData = JSON.stringify(data)
    AsyncStorage.setItem(this.flag, stringifyData, (error, result) => {

    })
  }
}