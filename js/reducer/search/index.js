import Types from '../../action/types';

const defaultState = {
  showText: '搜索',
  items: [], // 原始数据
  isLoading: false,
  projectModels: [], // 要显示的数据
  hideLoadingMore: true, // 默认隐藏加载更多
  showBottomButton: false,
  // inputKey: ''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Types.SEARCH_REFRESH: // 开始点击搜索
      return {
        ...state,
        showText: '取消',
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false
      }

    case Types.SEARCH_REFRESH_SUCCESS: // 获取数据成功
      return {
        ...state,
        showText: '搜索',
        inputKey: action.inputKey,
        isLoading: false,
        hideLoadingMore: false,
        showBottomButton: action.showBottomButton,
        items: action.items,
        projectModels: action.projectModels,
        pageIndex: action.pageIndex,
      }

    case Types.SEARCH_FAIL: // 获取数据失败
      return {
        ...state,
        showText: '搜索',
        isLoading: false,
      }

    case Types.SEARCH_LOAD_MORE_SUCCESS: // 上拉加载成功
      return {
        ...state,
        projectModels: action.projectModels,
        hideLoadingMore: false,
        pageIndex: action.pageIndex,
      }

    case Types.SEARCH_LOAD_MORE_FAIL: // 上拉加载失败
      return {
        ...state,
        hideLoadingMore: true,
        pageIndex: action.pageIndex,
      }

    case Types.SEARCH_CANCEL: // 取消搜索
      return {
        ...state,
        showText: '搜索',
        isLoading: false,
        // items: [],
        // projectModels: []
      }

    default:
      return state
  }
}