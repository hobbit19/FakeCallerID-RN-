import createReducer from '../lib/createReducer'
import * as types from '../actions/types'
var personImage = require('../image/person.png')
export const toCallUserName = createReducer('',{
    [types.TO_CALL_USER_NAME](state, action){
        return action.data;
    }
})

export const toCallUserPhoto = createReducer({},{
    [types.TO_CALL_USER_PHOTO](state, action){
        if('../../'.indexOf(action.data) < 0){
            return {uri: action.data}
        }
        else{
            return {uri: null}
        }
    }
})