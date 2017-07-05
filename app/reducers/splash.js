import createReducer from '../lib/createReducer'
import * as types from '../actions/types'


export const userInfo = createReducer({},{
    [types.USER_INFO](state, action){
        return action.info;
    }
})

export const spinnerProgress = createReducer(true,{
    [types.LOGIN_DONE](state, action){
        return false;
    }
})


