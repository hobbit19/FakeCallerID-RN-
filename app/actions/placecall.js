import * as types from './types'
var Contacts = require('react-native-contacts')

export const checkContactList = (num) => {
    var toCallNumber = num
    let personData, index = 0
    return(dispatch, getState) => {
        Contacts.getAll((err, contacts) => {
            if(err === 'denied'){
                // error
                alert("Access denied.")
                dispatch(setToCallName(toCallNumber))
                dispatch(setToCallPhoto('../../image/person.png'))
            } else {
                // contacts returned in []
                contacts.map(function(contact, i){
                    console.log('CONTACT_PHONE_NUBMERS', JSON.stringify(contact.phoneNumbers))
                    contact.phoneNumbers.map(function(item, i){
                        let pNumber = item.number.replace(/-/g, '')
                        pNumber = pNumber.replace(/\(/g, '')
                        pNumber = pNumber.replace(/\)/g, '')  
                        pNumber = pNumber.replace(/ /g, '')    
                        console.log('CONTACT_PHONE_NUBMER', pNumber)
                        if(toCallNumber.indexOf(pNumber) >= 0){
                            console.log('CONTACT_LIST: ', JSON.stringify(contact))
                            index++
                            dispatch(setToCallName(contact.givenName + ' ' + contact.familyName))
                            dispatch(setToCallPhoto(contact.thumbnailPath))
                        }
                    })                   
                })
                if(index == 0) {
                    dispatch(setToCallName(toCallNumber))
                    dispatch(setToCallPhoto('../../image/person.png'))
                }
                
            }
        })
    }
}

export const sumbitOneSignalPlayerID = (params) => {
    return(dispatch, getState) => {
        fetch(types.URL_SUBMIT_PLAYERID, {
            method: 'POST',
            headers: {
                'Accept' : 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then((user) => user.json())
        .then((userJson) => {
            console.log('Submit playerId State: ', JSON.stringify(userJson));
        })
        .catch((error) => {
            alert('Submit playerId Error: ' + error.toString());
        });
    }
}

export const setToCallName = (name) => {
    return {
        type: types.TO_CALL_USER_NAME,
        data: name
    }
}

export const setToCallPhoto = (photo) => {
    return {
        type: types.TO_CALL_USER_PHOTO,
        data: photo
    }
}