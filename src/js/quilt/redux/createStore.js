import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {routing} from './middleware/routing';
import {analytics} from './middleware/analytics';
import * as reducers from './reducers';

//   ############################################
//  #  Change to false to disable GA tracking. #
// ############################################
const enableAnalytics = true;

const logger = store => next => action => {
  if (typeof action !== "function" && process.env.__DEV__ == true) {
    // Remove for debugging ;)
    // console.log('dispatching', action);
  }
  return next(action);
};

export default function store(viewer) {
  const middleware = [thunk.withExtraArgument(viewer), logger, routing];
  if (enableAnalytics) {
    middleware.push(analytics);
  }
  return createStore(combineReducers(reducers), applyMiddleware(...middleware));
}
