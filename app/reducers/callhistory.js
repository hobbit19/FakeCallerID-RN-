import createReducer from '../lib/createReducer'
import * as types from '../actions/types'


export const callHistory = createReducer([],{
    [types.CALL_HISTORY](state, action){
        return action.data;
    }
})

export const callHistoryProgress = createReducer(true,{
    [types.CALL_HISTORY_LOADED](state, action){
        return false;
    }
})