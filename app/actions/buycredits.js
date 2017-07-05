import * as types from './types'
import {Platform, Alert} from 'react-native'


export const getStripeToken = (cardDetails, otherDetails, stripe_apk_key, callback) => {
  return (dispatch, getState) => {
    console.log('STRIPE_SECURITY_CODE', stripe_apk_key)
    var formBody = [];
    for (var property in cardDetails) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(cardDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log('STRIPE_HTTP_BODY', formBody)
    fetch(types.URL_STRIPE + 'tokens', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + stripe_apk_key
        },
        body: formBody
    })
    .then((urls) => urls.json())
    .then((json) => {
        console.log('STRIPE_RESPONSE', JSON.stringify(json))
        if(json.error){
            alert('STRIPE_RESPONSE_ERROR: ' +JSON.stringify(json.error))
        }
        else{
            dispatch(purchaseByCreditDebit(otherDetails, json.id, callback))
        }        
    })
    .catch((e) => {
        console.log('STRIPE_RESPONE_ERROR', e.toString())
        alert('STRIPE_RESPONSE_ERROR', e.toString())
    })
  }  
};

export const purchaseByCreditDebit = (Details, stripeToken, callback) => {
    return (dispatch, getState) => {
        
        let params = {
            source: Platform.OS,
            appId: Platform.OS === 'android' ? 1 : 2,
            name: Details.name,
            email: Details.email,
            country: Details.country,
            userId: 2159702,
            package: Details.package,
            stripeToken: stripeToken,
            coupon: Details.coupon
        }
        var formBody = [];
        for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log('PURCHASE_PARAMS', formBody)
        fetch(types.URL_PURCHASE, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        })
        .then((urls) => urls.json())
        .then((json) => {
            console.log('CHECKOUT_PARAMS:' + formBody + 'CHECKOUT_RESPONSE:' + JSON.stringify(json))
            if(json.error){
                alert('CHECKOUT_RESPONSE_ERROR: ' + JSON.stringify(json))
            }
            else{
                callback()
            }
        })
        .catch((e) => {
            console.log('<CHECKOUT_PARAMS>:' + formBody + 'CHECKOUT_RESPONSE_ERROR:' + JSON.stringify(e))
            alert('PURCHSE_ERROR: ' + JSON.stringify(e))
        })
    }
}

export const checkCoupon = (text, handle) => {
    return(dispatch, getState) => {
        let couponData
        fetch(types.URL_CHECKCOUPON, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'coupon=' + text
        })
        .then((urls) => urls.json())
        .then((json) => {
            console.log('COUPON_RESPONSE', JSON.stringify(json))
            if(json.status == 'success'){
                json.couponData.map(function(data, index){
                    if(data.discount !== undefined){
                        dispatch(setAutoCoupon('Discount coupon: ' + data.discount + '%'))
                        let uPrice = Number(handle.state.price.substring(1))
                        uPrice = uPrice * (1 - data.discount / 100)
                        uPrice = Number(uPrice).toFixed(2)
                        handle.state.selectedCreditData.price = '$' + uPrice
                        handle.setState({selectedCreditData: handle.state.selectedCreditData})
                    }
                })
                
                
            }
        })
        .catch((e) => {
            console.log('COUPON_RESPONSE_ERROR', e.toString())
        })
    }
}

export const setAutoCoupon = (coupon) => {
    return {
        type: types.AUTO_COUPON,
        data: coupon
    }
}