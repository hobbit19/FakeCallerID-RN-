'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, Animated, TouchableOpacity, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import {Actions} from 'react-native-router-flux'

export class CallScreen extends Component {
  constructor(props) {
    super(props);
    console.log(props.extra);
    this.state = {
      stormHeight: new Animated.Value(150),
      stormWidth: new Animated.Value(150),
      pastTime: 0,
    };
    this.startAnimation.bind(this)
  }

  componentDidMount () {
    this.startAnimation()
    this.startTimer()
    this.mount = true    
  }

  componentWillUnmount() {
    this.mount = false
  }

  startTimer() {
    const _this = this
    setTimeout(function(){
      if(_this.mount){
        let time = _this.state.pastTime
        _this.setState({pastTime: time + 1})
        _this.startTimer()
      }      
    }, 1000)
  }

  startAnimation() {
    const _this = this
    this.startCallAnimation()
    setTimeout(function() {
      if(_this.mount){
        _this.setState({stormHeight: new Animated.Value(150), stormWidth: new Animated.Value(150)})
        _this.startAnimation()
      }
    }, 2000)
  }

  startCallAnimation() {
    const _this = this
    Animated.timing(
      _this.state.stormWidth,
      {
        toValue: 400,
        duration: 2000
      }
    ).start()

    Animated.timing(
      _this.state.stormHeight,
      {
        toValue: 400,
        duration: 2000
      }
    ).start()    
  }

  convertToClockTime(T) {
    let M = Math.floor(T / 60)
    let S = T % 60
    return (M < 10 ? '0' : Math.floor(M / 10)) + (M % 10) + ':' + (S < 10 ? '0' : Math.floor(S / 10)) + (S % 10)
  }

  render () {

    return (
      <LinearGradient style={{flex: 1, paddingBottom: 20}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
        <View style={styles.userView}>
          <View style={styles.photoView}>
            <Animated.View style={[styles.outView, {width: this.state.stormWidth, height: this.state.stormHeight}]}>
              <View style={styles.insideView}>
                <Image source={this.props.toCallUserPhoto.uri == undefined?require('../../image/person.png'):this.props.toCallUserPhoto} style={styles.photoIcon} />
              </View>
            </Animated.View>
          </View>
          <View style={styles.nameView}>
            <Text style={styles.text}>{this.props.toCallUserName}</Text>
            <Text style={styles.smallText}>{this.convertToClockTime(this.state.pastTime)}</Text>
          </View>
        </View>

        <View style={styles.buttonsView}>
          <View style={styles.buttonInnerView}>
            <TouchableOpacity onPress={() => {alert('voice control')}} style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.buttonView}>
                <Icon name="md-megaphone" size={30} color='white' style={{backgroundColor: 'transparent'}}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {alert('record control')}} style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.buttonView}>
                <Icon name="md-mic" size={30} color='white' style={{backgroundColor: 'transparent'}}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {this.digitBoard.focus()}} style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.buttonView}>
                <Icon name="md-keypad" size={30} color='white' style={{backgroundColor: 'transparent'}}/>
              </View>
            </TouchableOpacity>
            <TextInput 
              style={{width: 0, height: 0}} 
              keyboardType='phone-pad' 
              onChangeText={(text) => {this.setState({callNumber: text})}}
              ref={(ref)=>{this.digitBoard = ref}} />
          </View>
        </View>

        <TouchableOpacity onPress={() => {Actions.pop()}} style={styles.endButtonView}>
          <View>
            <Text style={styles.smallText}>END CALL</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  userView: {
    height: 350,    
    backgroundColor: 'transparent',
    position: 'relative'
  },
  buttonView: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white' 
  },
  nameView: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    left: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
    padding: 10
  },
  smallText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
    padding: 10
  },
  outView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 300,
    backgroundColor: '#FFFFFF22'
  },
  insideView: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    backgroundColor: '#25A9E8'
  },
  photoView: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'stretch'
  },
  buttonsView: {
    padding: 15,
    height: 150
  },
  buttonInnerView: {
    flex: 1,
    flexDirection: 'row'
  },
  endButtonView:{
    backgroundColor: '#FF3333DD',
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    toCallUserPhoto: state.toCallUserPhoto,
    toCallUserName: state.toCallUserName
  }
}, mapDispatchToProps)(CallScreen);
