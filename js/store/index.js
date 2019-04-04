import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';
import {middleware} from '../navigator/AppNavigator';

/**
 * 自定义一个中间件
 * 打印 store
 * */
const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispathcing a function');
  } else {
    console.log('dispathcing ', action);
  }
  const result = next(action);
  console.log('nextState', store.getState());
}


const middlewares = [
  logger,
  middleware,
  thunk,
]

/**
 * 创建 store
 */
export default createStore(reducers, compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))