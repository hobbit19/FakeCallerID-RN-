import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const countryName = createReducer('',{
    [types.COUNTRY_NAME](state, action){
        return action.data;
    }
})