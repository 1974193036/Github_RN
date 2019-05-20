import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Util";

/**
 * 处理下拉刷新的数据
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * */
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, params) {
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }
  // 第一次要显示的数据
  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)

  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params
    })
  })
  // dispatch({
  //   type: actionType,
  //   items: fixItems, // 原始数据
  //   projectModels: showItems, // 第一次要展示的数据
  //   storeName,
  //   pageIndex: 1
  // })
}

/**
 * @param {要包装的 item 数组} showItems
 * @param {收藏数据管理工具} favoriteDao
 * @param {回调函数} callback
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = []
  try {
    keys = await favoriteDao.getFavoriteKeys()
  } catch (error) {
    console.log(error)
  }
  let projectModels = []
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
  }
  if (typeof callback === 'function') {
    callback(projectModels)
  }
}


export const doCallBack = (callBack, object) => {
  if (typeof callBack === 'function') {
    callBack(object)
  }
}