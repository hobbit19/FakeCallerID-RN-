

import * as types from './types'
import {Platform, Alert} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import countries from '../lib/Countries';


export const saveSettings = (userData, email, country, defaultPlay, callback) => {
    return (dispatch, getState) => {
        const setting_values = 'userId=' + userData.id + '&uuid=' + DeviceInfo.getUniqueID() + '&email=' + email + '&country=' + country + '&defaultPlay=' + defaultPlay;
        fetch(types.URL_SAVE_SETTING, {
            method: 'POST',
            headers: {
                'Accept' : 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: setting_values
        })
        .then((user) => user.json())
        .then((data) => {
            console.log('save setting state: ', data);
            userData.email = email
            userData.country = country
            userData.defaultPlay = defaultPlay
            callback()
        })
        .catch((error) => {
            alert(error.toString());
        });
    }
}

export const initCountry = (code) => {
    return (dispatch, getState) => {
        countries.map(function(country, index){
            if(country.code == code) dispatch(setCountryName(country.name))
        })
    }
}

export const setCountryName = (name) => {
    return {
        type: types.COUNTRY_NAME,
        data: name
    }
}