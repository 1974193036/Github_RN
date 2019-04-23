import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData, _projectModels} from '../ActionUtil';

/**
 * 获取最热数据到异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @returns {function(*=)}
 * */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
  return dispatch => {

    dispatch({type: Types.TRENDING_REFRESH, storeName: storeName})

    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending).then(data => {
      // console.log(data)
      handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
    }).catch(error => {
      console.error(error)
      dispatch({
        type: Types.TRENDING_REFRESH_FAIL,
        storeName,
        error
      })
    })
  }
}

// function handleData(actionType, dispatch, storeName, data, pageSize) {
//   let fixItems = [] // 原始数据
//   if (data && data.data && data.data.items) {
//     fixItems = data.data.items
//   }
//   dispatch({
//     type: actionType,
//     items: fixItems, // 原始数据
//     projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要展示的数据
//     storeName,
//     pageIndex: 1
//   })
// }


/**
 * 上拉加载更多
 * @param storeName
 * @param pageIndex 当前页码
 * @param pageSize 每页条数
 * @param dataArray 元数据
 * @param favoriteDao
 * @param callBack
 * */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => { // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex
        })
      } else {
        // 本次可载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data
          })
        })
        // dispatch({
        //   type: Types.TRENDING_LOAD_MORE_SUCCESS,
        //   storeName,
        //   pageIndex,
        //   projectModels: dataArray.slice(0, max)
        // })
      }
    }, 500)
  }
}

/**
 *
 * @param storeName
 * @param pageIndex 当前页码
 * @param pageSize 每页条数
 * @param dataArray 元数据
 * @param favoriteDao
 * */
export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.FLUSH_TRENDING_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data
      })
    })
  }
}