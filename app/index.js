import React, {Component} from 'react'
import {Router, Scene, ActionConst} from 'react-native-router-flux'
import {Provider, connect} from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducer from './reducers'
import Spalsh from './screens/Splash/Splash.js'
import CallMenu from './screens/PlaceCall/CallMenu.js'
import Terms from './screens/Terms/Terms.js'
import CallHistory from './screens/CallHistory/CallHistory.js'
import Settings from './screens/Settings/Settings.js'
import BuyCredits from './screens/BuyCredits/BuyCredits.js'
import CallScreen from './screens/CallScreen/CallScreen.js'
import SupportScreen from './screens/Support/Support.js'
import VerifyScreen from './screens/Verify/Verify.js'
import SecretScreen from './screens/Secret/Secret.js'


const RouterWithRedux = connect()(Router)
const {
  AppRegistry,
} = require('react-native')
// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class FakeCaller extends Component {
  render () {
    return (
        <Provider store={store}>
          <RouterWithRedux>
            <Scene key='Spalsh' component={Spalsh} title='Spalsh Page' hideNavBar={true}/>
            <Scene key='PlaceCall' component={CallMenu} title='Place Call Page' hideNavBar={true} type={ActionConst.REPLACE}/>
            <Scene key='Terms' component={Terms} title='Terms & Conditions Page' hideNavBar={true}/>
            <Scene key='CallHistory' component={CallHistory} title='Call History Page' hideNavBar={true}/>
            <Scene key='Settings' component={Settings} title='Setting Page' hideNavBar={true}/>
            <Scene key='BuyCredits' component={BuyCredits} title='Purchase Page' hideNavBar={true}/>
            <Scene key='CallScreen' component={CallScreen} title='CallScreen Page' hideNavBar={true}/>
            <Scene key='Support' component={SupportScreen} title='SupportScreen Page' hideNavBar={true}/>
            <Scene key='Verify' component={VerifyScreen} title='VerifyScreen Page' hideNavBar={true}/>
            <Scene key='Secret' component={SecretScreen} title='SecretScreen Page' hideNavBar={true}/>
          </RouterWithRedux>
        </Provider>
    )
  }
}

export default FakeCaller;