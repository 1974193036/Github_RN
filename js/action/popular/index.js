import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 * 获取最热数据到异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(*=)}
 * */
export function onRefreshPopular(storeName, url, pageSize) {
  return dispatch => {

    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName})

    let dataStore = new DataStore()
    dataStore.fetchData(url).then(data => {
      // console.log(data)
      handleData(dispatch, storeName, data, pageSize)
    }).catch(error => {
      console.error(error)
      dispatch({
        type: Types.POPULAR_REFRESH_FAIL,
        storeName,
        error
      })
    })
  }
}

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [] // 原始数据
  if (data && data.data && data.data.items) {
    fixItems = data.data.items
  }
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: fixItems, // 原始数据
    projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要展示的数据
    storeName,
    pageIndex: 1
  })
}


/**
 * 上拉加载更多
 * @param storeName
 * @param pageIndex 当前页码
 * @param pageSize 每页条数
 * @param dataArray 元数据
 * @param callBack
 * */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
  return dispatch => {
    setTimeout(() => { // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex
        })
      } else {
        // 本次可载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
        dispatch({
          type: Types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max)
        })
      }
    }, 500)
  }
}


// function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
//   let fixItems = []
//   if (data && data.data) {
//     if (Array.isArray(data.data)) {
//       fixItems = data.data;
//     } else if (Array.isArray(data.data.items)) {
//       fixItems = data.data.items;
//     }
//
//   }
//   // 第一次要显示的数据
//   let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
//
//   _projectModels(showItems, favoriteDao, projectModels => {
//     dispatch({
//       type: actionType,
//       items: fixItems,
//       projectModels: projectModels,
//       storeName,
//       pageIndex: 1
//     })
//   })
// }

// /**
//  * @param {要包装的 item 数组} showItems
//  * @param {收藏数据管理工具} favoriteDao
//  * @param {回调函数} callback
//  */
// export async function _projectModels(showItems, favoriteDao, callback) {
//   let keys = [];
//   try {
//     keys = await favoriteDao.getFavoriteKeys();
//   } catch (error) {
//     console.log(error);
//   }
//   let projectModels = [];
//   for (let i = 0, len = showItems.length; i < len; i++) {
//     projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
//   }
//   if (typeof callback === 'function') {
//     callback(projectModels);
//   }
// }