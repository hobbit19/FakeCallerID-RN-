import * as splashActions from './splash'
import * as placeCallActions from './placecall'
import * as termsActions from './terms'
import * as callHistoryActions from './callhistory'
import * as settingActions from './setting'
import * as buyActions from './buycredits'
import * as verifyActions from './verify'


export const ActionCreators = Object.assign({},
  splashActions,
  placeCallActions,
  termsActions,
  callHistoryActions,
  settingActions,
  buyActions,
  verifyActions
);
