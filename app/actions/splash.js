import * as types from './types'
import {Platform, Alert} from 'react-native'
import DeviceInfo from 'react-native-device-info';

const loginInfo = 'uuid=' + DeviceInfo.getUniqueID() + '&source=' + Platform.OS + '&appId=' + (Platform.OS === 'android' ? 1 : 2) + '&version=' + DeviceInfo.getVersion().toString();


export const login = (callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_LOGIN, {
            method: 'POST',
            headers: {
                'Accept' : 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: loginInfo
        })
        .then((user) => user.json())
        .then((userJson) => {
            console.log('login state: ', JSON.stringify(userJson));
            if (userJson.user.banned == 1){
                alert("Your account has been banned. If you have any questions or concerns contact support at support@fakecallerid.io");
            }else{
                let user = {user: userJson.user, config: userJson.config, status: userJson.status};
                console.log(user)
                dispatch(setUserInfo(user))
            }
            dispatch(loginDone())
            if(userJson.config.goLive == 'N' && userJson.config.firstTimeUser == true){
                callback('Verify')
            }
            else{
                callback('Exist')
            }
            
        })
        .catch((error) => {
            alert(error.toString());
            dispatch(loginDone())
        });
    }
}

export const setUserInfo = (user) => {
    return {
        type: types.USER_INFO,
        info: user
    }
}

export const loginDone = () => {
    return {
        type: types.LOGIN_DONE,
    }
}