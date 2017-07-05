'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView, DeviceEventEmitter} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNAudioStreamer from 'react-native-audio-streamer'
var AsYouTypeFormatter = require('google-libphonenumber').AsYouTypeFormatter

//template
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../../component/navBar.js'
import MenuView from '../../component/menuView.js'
import Icon from 'react-native-vector-icons/SimpleLineIcons';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

export class CallHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuMarginTop: new Animated.Value(0 - Height),
            //historyData: ds.cloneWithRows(menuData),
            playingIndex: -1,
        };
    }

    componentDidMount () {
        //const params = "userId=" + this.props.userInfo.user.id + '&uuid=' + DeviceInfo.getUniqueID();
        const params = "userId=" + '2159702' + '&uuid=' + '7ce6d1adb200f202';
        this.props.loadCallHistories(params)
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this))
    }

    _statusChanged(status) {
        // Your logic
        if(status == 'FINISHED'){
            this.setState({playingIndex: -1})
        }
    }

    dropDownMenuView() {
        Animated.timing(
            this.state.menuMarginTop,
            {
                toValue: 0,
                duration: 500
            }
        ).start()
    }

    dismissMenuView() {
        Animated.timing(
            this.state.menuMarginTop,
            {
                toValue: 0 - Height,
                duration: 500
            }
        ).start()
    }

    convertToDate(TS) {
        let array, AP, hour
        array = TS.split(" ")[0].split("-")
        let u_date = array[1] + '/' + array[2] + '/' + array[0]
        array = TS.split(" ")[1].split(":")
        if(array[0] > 12){
            hour = array[0] - 12
            AP = 'PM'
        }
        else{
            hour = array[0];
            AP = 'AM'
        }
        let u_time = hour + ':' + array[1] + ' ' + AP
        return u_date + ' | ' + u_time
    }

    convertToCallTime(T) {
        let H = Math.floor(T / 3600)
        let M = Math.floor(T / 60)
        let S = T % 60
        return (H > 0 ? (H + ':') : '') + (M < 10 ? '0' : Math.floor(M / 10)) + (M % 10) + ':' + (S < 10 ? '0' : Math.floor(S / 10)) + (S % 10)
    }

    convertToValidNumber(history, index) {
        var formatter = new AsYouTypeFormatter('US');
        for(var i = 1; i<history.destNumber.length; i++){
            formatter.inputDigit(history.destNumber.substring(i, i + 1))
        }
        if(index == 1) console.log('NATIONAL_PHONE_NUMBER', JSON.stringify(formatter))
        return formatter.currentOutput_
    }

    render () {
        const _this = this
        return (
            <View style={{zIndex: 2, flex:1}}>
                <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
                    <Spinner visible = {this.props.Progress} textContent="" textStyle={{color: '#444'}} />
                    <NavBar title='CALL HISTORY' minute={this.props.userInfo.user.minutes} 
                        onMenuButtonPress={() => {
                            this.dropDownMenuView()
                        }}
                    />
                    <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
                        <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
                    </Animated.View>

                    <View style={styles.historyContainer}>
                        <ScrollView style={{flex: 1}}>
                            {
                                this.props.callHistory.map(function(history, index){
                                    console.log('LITIYAN_CALL_HISTORY' + index + ': ' + JSON.stringify(history))
                                    const destNumber = _this.convertToValidNumber(history, index)
                                    console.log('NATIONAL_PHONE_NUMBER', destNumber)
                                    return(
                                        <View key={history.id}>
                                            <View>
                                                <View style={styles.historyListItem}>
                                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <View style={{flex: 0.16, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                                                            <TouchableOpacity style={styles.playIconView} onPress={() => { 
                                                                    if(_this.state.playingIndex == history.id){
                                                                        _this.setState({playingIndex: -1})
                                                                        RNAudioStreamer.pause();
                                                                    }
                                                                    else{
                                                                        _this.setState({playingIndex: history.id})
                                                                        RNAudioStreamer.setUrl(history.recordingFile)
                                                                        RNAudioStreamer.play();
                                                                    }
                                                            }}>
                                                                <Icon name={_this.state.playingIndex == history.id?'control-pause':'control-play'} size={20} style={styles.ico} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{flex: 0.84, padding: 10, justifyContent: 'center'}}>
                                                            <Text style={[styles.pageText, {fontSize: 16, fontWeight: 'bold'}]}>{destNumber}</Text>
                                                            <Text style={[styles.pageText, {fontSize: 14}]}>{history.country} | {_this.convertToDate(history.timestamp)} | {_this.convertToCallTime(history.callDuration)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )                  
                                })
                                
                            }
                        </ScrollView>
                    </View>
                </LinearGradient>

                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    historyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playIconView:{
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pageText: {
        color: 'white',
        backgroundColor: 'transparent',
        padding: 3
    },
    menuView:{
        position: 'absolute',
        right: 0,
        left: 0,
        height: Height,
        backgroundColor: 'transparent',
        zIndex: 3
    },
    historyListItem: {
        width: Width,
        height: 70,
        borderBottomWidth: 1,
        borderColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 40,
        paddingBottom: 40
    },
    ico: {
        color: '#85C3F3'
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
    return {
        Progress: state.callHistoryProgress,
        userInfo: state.userInfo,
        callHistory: state.callHistory
    }
}, mapDispatchToProps)(CallHistory);
