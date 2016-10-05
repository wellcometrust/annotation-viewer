import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { analytics } from './middleware/analytics';
import * as reducers from './reducers/index';


const logger = store => next => action => {
  if (typeof action !== "function" && process.env.__DEV__ == true) {
    // Remove for debugging ;)
    // console.log('dispatching', action);
  }
  return next(action);
};

export default function store(viewer) {
  const middleware = [thunk.withExtraArgument(viewer), logger, analytics];
  return createStore(combineReducers(reducers), applyMiddleware(...middleware));
}
