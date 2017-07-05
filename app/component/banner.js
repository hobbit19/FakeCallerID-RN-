import React, {Component, PropTypes} from 'react';
import {View, Platform, StyleSheet} from 'react-native';

import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'

const bannerID = Platform.OS == 'ios'? 'ca-app-pub-8065532450790228/3018848197': 'ca-app-pub-8065532450790228/6482175390'
export class Banner extends Component{

    constructor(props){
        super(props);
        this.state = {
        };
    };
    

    render(){
        return(
                <View style={styles.bannerView}>
                    <AdMobBanner
                        bannerSize="smartBannerPortrait"
                        adUnitID={bannerID}
                        testDeviceID="EMULATOR"
                        didFailToReceiveAdWithError={this.bannerError} />
                </View>
        );
    };
}


const styles = StyleSheet.create({
    bannerView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        justifyContent: 'flex-end'
    }
});

export default Banner;
