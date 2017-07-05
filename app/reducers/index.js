import { combineReducers } from 'redux';
import * as splashReducer from './splash'
import * as placeCallReducer from './placecall'
import * as termsReducer from './terms'
import * as callHistoryReducer from './callhistory'
import * as settingReducer from './setting'
import * as buyReducer from './buycredits'

export default combineReducers(Object.assign(
  splashReducer,
  placeCallReducer,
  termsReducer,
  callHistoryReducer,
  settingReducer,
  buyReducer
));
