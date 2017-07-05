import createReducer from '../lib/createReducer'
import * as types from '../actions/types'


export const termsHTML = createReducer('',{
    [types.TERMS_HTML](state, action){
        return action.data;
    }
})

export const HTMLProgress = createReducer(true,{
    [types.TERMS_DOWNLOADED](state, action){
        return false;
    }
})