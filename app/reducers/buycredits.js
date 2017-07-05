import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const autoCoupon = createReducer('',{
    [types.AUTO_COUPON](state, action){
        return action.data;
    }
})