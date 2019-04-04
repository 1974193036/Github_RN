import Types from '../../action/types';

const defaultState = {
  theme: '#538eff'
}
export default (state = defaultState, action) => {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      }
      break;

    default:
      return state;
  }
}