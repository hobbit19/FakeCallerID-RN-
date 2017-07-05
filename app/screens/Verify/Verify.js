'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import DeviceInfo from 'react-native-device-info';

const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

export class Verify extends Component{

  constructor(props){
    super(props);
    this.state = {
        phoneNumber: '',
        code: '',
        step: 1,
        countryCode: this.props.userInfo.user.country,
    };
  };

  componentDidMount(){
    this.setState({
        pickerData: this.refs.phone.getPickerData()
    })
  };

  selectCountry(country){
    this.refs.phone.selectCountry(country.cca2.toLowerCase())
    this.setState({countryCode: country.cca2})
  }

  onPressFlag(){     
    this.refs.myCountryPicker.openModal()
  }

  sendCode() {
    const _this = this
    const params = 'userId=' + this.props.userInfo.user.id + '&country=' + this.props.userInfo.user.country + '&phoneNumber=' + this.refs.phone.getValue().substring(1)
    this.props.sendVerificationCode(params, (status, text)=>{
      if(status == 'success') _this.setState({step: 2})
      else alert(text)
    })
    
  }

  sendConfirm() {
    const _this = this
    const params = 'userId=' + this.props.userInfo.user.id + '&code=' + this.state.code
    this.props.sendConfirmCode(params, (status, text)=>{
      if(status == 'success') Actions.PlaceCall()
      else alert(text)
    })
  }

  renderSendCodeScreen() {
    return(
      <View style={{flex: 1}}>
        <View style={styles.title}>
            <Text style={styles.titleText}>CONFIRM YOUR PHONE NUMBER</Text>
        </View>
        <View style={styles.inputView}>
            <View>
                <Text style={styles.inputText}>YOUR NUMBER:</Text>
            </View>
            <View style={styles.inputContainer}>
                <PhoneInput 
                    ref='phone' 
                    textStyle={{color: 'white', fontSize: 16}}
                    onChangePhoneNumber={(number) => {this.setState({phoneNumber: number})}}
                    initialCountry={this.props.userInfo.user.country.toLowerCase()}
                    onPressFlag={() => {this.onPressFlag()}}
                />
                <CountryPicker
                    ref='myCountryPicker'
                    data={this.state.pickerData}
                    onChange={(country)=>{ this.selectCountry(country)}}
                    cancelText='Cancel'
                    cca2={this.state.countryCode}
                    closeable={true}
                    filterable={true}
                >
                  <View></View>
                </CountryPicker>
            </View>
            
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={()=> {this.sendCode()}}>
            <View style={styles.callContainer}>
              <Text style={styles.buttonText}>SEND CONFIRMATION CODE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderConfirmScreen() {
    return(
      <View style={{flex: 1}}>
        <View style={styles.topView}>
          <View style={styles.topContainer}>
              <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=>{this.setState({step: 1})}}>
                <Ionicons name='ios-arrow-round-back' color='white' size={40} style={{backgroundColor: 'transparent'}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=>{alert('resend')}}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
          </View>
        </View>
        <View style={styles.title}>
            <Text style={styles.titleText}>CONFIRM YOUR PHONE NUMBER</Text>
        </View>
        <View style={styles.title}>
            <Text style={styles.smallText}>We just sent you a confirmation code to the number you provided, please enter it below to continue.</Text>
        </View>
        <View style={styles.inputView}>
          <View>
              <Text style={styles.inputText}>CONFIRMATION CODE:</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.codeInput}
              onChangeText={(text) => { this.setState({code: text})}}
              underlineColorAndroid='transparent'
              keyboardType='numeric'
              maxLength={4}
            />
          </View>            
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={()=> {this.sendConfirm()}}>
            <View style={styles.callContainer}>
              <Text style={styles.buttonText}>CONTINUE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render(){
    return(
      
      <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
        <View style={styles.container}>
          {
            this.state.step == 1?
            this.renderSendCodeScreen()
            :
            this.renderConfirmScreen()
          }
          
        </View>
      </LinearGradient>
    
    );
  };
}


const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    position: 'relative'
  },
  title: {
      paddingTop: 25,
  },
  titleText: {
      color: 'white',
      fontSize: 20,
      backgroundColor: 'transparent',
      textAlign: 'center'
  },
  inputView: {
    marginTop: 30,
  },
  inputText: {
      color: 'white',
      fontSize: 20,
      backgroundColor: 'transparent',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
    padding: 10
  },
  buttonView: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContainer: {
    width: Width - 60,
    height: 40,
    backgroundColor:'#97d35f',
    borderRadius:40,
    justifyContent: 'center'
  },
  buttonText:{
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  topView: {
    height: 50,
  },
  topContainer: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row'
  },
  smallText: {
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white'
  },
  codeInput: {
    fontSize: 40,
    color: 'white',
    backgroundColor: 'transparent',
    height: 40
  },
  resendText: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: 'white',
    width: 70,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    padding: 2,
    textAlign: 'center'
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo
  }
}, mapDispatchToProps)(Verify);
