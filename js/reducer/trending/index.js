import Types from '../../action/types';

const defaultState = {

}

/**
 * 结构树形态
 * popular: {
 *  java: {
 *    items:[],
 *    isLoading: false
 *  },
 *  iOS: {
 *    items:[],
 *    isLoading: false
 *  },
 * }
 * 注意：
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store，（难点：storeKey不固定）
 * @param {*} state
 * @param {*} action
 */

export default (state = defaultState, action) => {
  switch (action.type) {
    case Types.TRENDING_REFRESH: // 下拉刷新
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true
        }
      }

    case Types.TRENDING_REFRESH_SUCCESS: // 下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items, // 原始数据
          projectModels: action.projectModels, // 此次要展示的数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }

    case Types.TRENDING_REFRESH_FAIL: // 下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          hideLoadingMore: true
        }
      }

    case Types.TRENDING_LOAD_MORE_SUCCESS: // 上拉加载更多成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        }
      }

    case Types.TRENDING_LOAD_MORE_FAIL: // 上拉加载更多失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        }
      }

    case Types.FLUSH_TRENDING_FAVORITE:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
        }
      }

    default:
      return state
  }
}