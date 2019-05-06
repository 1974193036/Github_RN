import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from '../../res/style/ThemeFactory';


/**
 * {
 *    customThemeViewVisible: false,
 *    theme: {
        themeColor: xxx,
        styles: {
          selectedTitleStyle: {
            color: xxx
          },
          tabBarSelectedIcon: {
            color: xxx
          },
          navBar: {
            backgroundColor: xxx
          }
        }
      }
 * }
 *
 */

const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  customThemeViewVisible: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      }
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      }
    default:
      return state
  }
}