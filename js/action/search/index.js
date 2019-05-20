import Types from '../types';
import {handleData, _projectModels, doCallBack} from '../ActionUtil';
import ArrayUtil from '../../util/ArrayUtil';
import Utils from '../../util/Util';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

/**
 * 发起搜索
 * @param inputKey 搜索key
 * @param pageSize
 * @param token 与该搜索关联的唯一token
 * @param favoriteDao
 * @param popularKeys
 * @param callBack
 * @returns {function(*=)}
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH})
    fetch(genFetchUrl(inputKey)).then(response => { // 如果任务取消，则不做任何处理
      // return hasCancel(token) ? null : response.json()
      return response.json()
    }).then(responseData => {
      if (hasCancel(token, true)) { // 如果任务取消，则不做任何处理
        console.log('user cancel')
        return
      }
      if (!responseData || !responseData.items || responseData.items.length === 0) {
        dispatch({type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目`})
        doCallBack(callBack, `没找到关于${inputKey}的项目`)
        return
      }
      let items = responseData.items
      handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', {data: items}, pageSize, favoriteDao, {
        showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
        inputKey,
      })
    }).catch(e => {
      console.log(e)
      dispatch({type: Types.SEARCH_FAIL, error: e})
    })
  }
}

/**
 * 上拉加载更多
 * @param pageIndex 当前页码
 * @param pageSize 每页条数
 * @param dataArray 元数据
 * @param favoriteDao
 * @param callBack
 * */
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => { // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex
        })
      } else {
        // 本次可载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data
          })
        })
      }
    }, 500)
  }
}



/**
 * 取消一个异步任务
 * @param token
 * @returns {function(*)}
 */
export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({type: Types.SEARCH_CANCEL})
  }
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR
}

/**
 * 检查指定token是否已经取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token)
    return true
  }
  return false
}