import * as types from './types'

export const sendVerificationCode = (param, callback) => {
    return (dispatch, getState) => {
        fetch (types.URL_SENDSMS, {
                method: 'POST',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: param
            })
            .then((data) => data.json())
            .then((json) => {
                if(json.status == 'success'){
                    callback('success', JSON.stringify(json))
                } 
                else{
                    callback('error', 'error occured')
                }
            })
            .catch((e) => {
                callback('error', e.toString())
            }
        );
    }
}

export const sendConfirmCode = (param, callback) => {
    return(dispatch, getState) => {
        fetch (types.URL_CONFIRMCODE, {
                method: 'POST',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: param
            })
            .then((data) => data.json())
            .then((json) => {
                if(json.status == 'success'){
                    callback('success', JSON.stringify(json))
                } 
                else{
                    callback('error', 'Invalid Code')
                }
            })
            .catch((e) => {
                callback('error', e.toString())
            }
        );
    }
}

