import Types from '../../action/types';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

const defaultState = {
  languages: [],
  keys: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Types.LANGUAGE_LOAD_SUCCESS: // 获取数据
      if (action.flag === FLAG_LANGUAGE.flag_dao_key) { // 最热模块
        return {
          ...state,
          keys: action.data
        }
      } else { // 趋势模块
        return {
          ...state,
          languages: action.data
        }
      }
    default:
      return state
  }
}