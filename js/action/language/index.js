import LanguageDao from '../../expand/dao/LanguageDao';
import Types from '../types';



/**
 * 加载标签
 * @param {} flagKey
 * @param {*} url
 */
export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let data = await new LanguageDao(flagKey).fetch()
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, data: data, flag: flagKey})
    } catch (error) {
      console.log(error)
    }
  }
}