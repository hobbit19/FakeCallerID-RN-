import * as types from './types'




export const loadTermsHTML = () => {
    return (dispatch, getState) => {
        fetch (types.URL_TERMS, {
            method: 'GET',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            })
            .then((terms) => terms.json())
            .then((termsJson) => {
                console.log(termsJson.terms);
                dispatch(setTermsHTML(termsJson.terms))
                dispatch(htmlLoaded())
            })
            .catch((e) => {
                dispatch(setTermsHTML('<Text>Error Page!</Text>'))
                dispatch(htmlLoaded())
            }
        );
    }
}

export const setTermsHTML = (html) => {
    return {
        type: types.TERMS_HTML,
        data: html
    }
}

export const htmlLoaded = () => {
    return{
        type: types.TERMS_DOWNLOADED,
    }
}