/**
 * 全局导航跳转工具类
 *
 * */

export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param page 要跳转的页面名
   * @param params 要传递的参数
   * */
  static goPage(page, params) {
    /** 让内层嵌套的路由跳转到外层路由，在外层保存跳转对象
     *  NavigationUtil.navigation 即外层保存的跳转对象
     * */
    const navigation = NavigationUtil.navigation
    if(!navigation) {
      console.log('navigation can not be null')
      return
    }
    navigation.navigate(page, {
      ...params
    })
  }

  /**
   * 返回上一页
   * @param navigation
   * */
  static goBack(navigation) {
    navigation.goBack()
  }

  /**
   * 重置到首页
   * @param params
   * */
  static resetToHomePage(params) {
    const {navigation} = params
    navigation.navigate('Main')
  }

}