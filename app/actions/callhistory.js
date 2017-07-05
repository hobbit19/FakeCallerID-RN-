import * as types from './types'




export const loadCallHistories = (params) => {
    return (dispatch, getState) => {
        console.log('CALL_HISTORY_URL', types.URL_CALL_HISTORY + params)
        fetch (types.URL_CALL_HISTORY, {
            method: 'POST',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then((urls) => urls.json())
        .then((urlsJson) =>{
            dispatch(callHistoryLoaded())
            dispatch(setCallHistory(urlsJson.callHistory))
            console.log('CALL_HISTORY_SUCCESS', JSON.stringify(urlsJson));
        })
        .catch((e) => {
            console.log(e);
            if('not found'.indexOf(e.toString()) < 0){
                alert('fetching error')
            }
            dispatch(callHistoryLoaded())
        });
    }
}

export const setCallHistory = (history) => {
    return {
        type: types.CALL_HISTORY,
        data: history
    }
}

export const callHistoryLoaded = () => {
    return{
        type: types.CALL_HISTORY_LOADED,
    }
}