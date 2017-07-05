'use strict';
/*jshint esversion: 6*/
/*jshint node: true*/
import React, {Component} from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  Dimensions, 
  Animated,
  ScrollView,
  ListView,
  Image,
  Platform
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../../component/navBar.js'
import MenuView from '../../component/menuView.js'
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import Modal from 'react-native-simple-modal';
import countries from '../../lib/Countries';
import Banner from '../../component/banner.js'
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
var Contacts = require('react-native-contacts')

let listener = null
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class CallMenu extends Component {

  constructor (props) {
    super(props);
    this.state = {
      toCall: '',
      fakeID: '',
      voiceOption: 'none',
      recordCall: false,
      menuMarginTop: new Animated.Value(0 - Height),
      cc1: this.props.userInfo.user.country,
      cc2: this.props.userInfo.user.country,
      showModal: false,
      contactData: ds,
      contactToCall: true,
      countryCode1: '',
      countryCode2: ''
    };
  }

  componentWillMount() {
      const _this = this
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('registered', this.onRegistered);
      OneSignal.addEventListener('ids', (device) => {//pushToken and userId
        const params = 'userId=' + _this.props.userInfo.user.id + '&uuid=' + DeviceInfo.getUniqueID() + '&playerId=' + device.userId
        _this.props.sumbitOneSignalPlayerID(params)
      });
      this._setPermission()
  }

  componentWillUnmount() {
      
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('registered', this.onRegistered);
      OneSignal.removeEventListener('ids', (device) => {//pushToken and userId
        const params = 'userId=' + _this.props.userInfo.user.id + '&uuid=' + DeviceInfo.getUniqueID() + '&playerId=' + device.userId
        _this.props.sumbitOneSignalPlayerID(params)
      });
  }

  onReceived(notification) {
      console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
      console.log("Device had been registered for push notifications!", notifData);
      alert(JSON.stringify(notifData))
  }

  _setPermission() {
    const permissions = {
        alert: true,
        badge: true,
        sound: true
    };
    OneSignal.requestPermissions(permissions);
  }

  componentDidMount() {
    this.setState({
        pickerData: this.refs.phone1.getPickerData()
    })
    this.initCountry()    
  }

  initCountry() {
    const _this = this
    countries.map(function(country, index){
      if(country.code == _this.props.userInfo.user.country){
        _this.setState({toCall: country.dial_code, fakeID: country.dial_code, countryCode1: country.dial_code, countryCode2: country.dial_code})
      }
    })
  }

  placeCall () {

    // let params = 'userId=' + this.state.user.user.id +
    //              '&uuid=' + DeviceInfo.getUniqueID() +
    //              '&source=' + Platform.OS +
    //              '&version=' + DeviceInfo.getVersion() +
    //              '&appId=' + (Platform.OS === 'android' ? 1 : 2) +
    //              '&destNumber' + this.state.toCall;
    /*
    fetch('https://api.fakecallerid.io/call', {
      method: 'POST',
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    */
    //alert(this.refs.phone1.getValue().substring(1))
    if(this.refs.phone1.isValidNumber()){
      this.props.checkContactList(this.state.toCall)
      Actions.CallScreen()
    }
    else{
      alert('Invalid phont number!')
    }
    
  }

  onPressFlag(index){
      if(index == 1){
        this.refs.myCountryPicker1.openModal()
      }
      else{
        this.refs.myCountryPicker2.openModal()
      }
  }

  selectCountry(country, isToCall){
    const _this = this
    countries.map(function(item, index){
      if(item.code == country.cca2){
        if(isToCall == 1){
          _this.refs.phone1.selectCountry(country.cca2.toLowerCase())
          _this.setState({cc1: country.cca2, countryCode1: item.dial_code})
        }else{
          _this.refs.phone2.selectCountry(country.cca2.toLowerCase())
          _this.setState({cc2: country.cca2, countryCode2: item.dial_code})
        }   
      }
    })
    
  }

  setVoiceOption (option) {
    var defaultStyle = {flex: 2, alignItems: 'center'};
    var selectedStyle = {backgroundColor: 'rgba(255, 255, 255, 0.5)', flex: 2, alignItems: 'center', borderRadius: 4};
    styles.noneOption = defaultStyle; styles.maleOption = defaultStyle; styles.femaleOption = defaultStyle;

    switch (option) {
      case 'none':
        this.setState({
          voiceOption: 'none'
        });
        styles.noneOption = selectedStyle;
        break;
      case 'male':
        this.setState({
          voiceOption: 'male'
        });
        styles.maleOption = selectedStyle;
        break;
      case 'female':
        this.setState({
          voiceOption: 'female'
        });
        styles.femaleOption = selectedStyle;
        break;
    }
  }

  stateNumbers (text, isToCall) {
    if (isToCall === true) {
      this.setState({
        toCall: text.replace(/-/g, '')
      });
    } else {
      this.setState({
        fakeID: text.replace(/-/g, '')
      });
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

  showContactList(index) {

    const _this = this
    Contacts.getAll((err, contacts) => {
        if(err === 'denied'){
            // error
            alert("Access denied.")
        } else {
            _this.setState({contactData: ds.cloneWithRows(contacts), contactToCall: index == 1?true:false})
        }
    })
    this.setState({showModal: true})
  }

  setPhoneNumberFromContactList(num) {
    let str = num.replace(/-/g, '')
    str = str.replace(/\(/g, '')
    str = str.replace(/\)/g, '')  
    str = str.replace(/ /g, '')    
    if(str.indexOf('+') < 0 && this.state.contactToCall){
      this.stateNumbers(this.state.countryCode1 + str, this.state.contactToCall)
    }
    else if(str.indexOf('+') < 0 && !this.state.contactToCall){
      this.stateNumbers(this.state.countryCode2 + str, this.state.contactToCall)
    }
    else{
      this.stateNumbers(str, this.state.contactToCall)
    }    
    this.setState({showModal: false})
    console.log('CONTACT_SELECT: ', str)
  }

  renderContact(item, sectionId, rowId) {
    return (
      <TouchableOpacity onPress={()=>{this.setPhoneNumberFromContactList(item.phoneNumbers[0].number)}} key={rowId} style={styles.contactListItem}>
        <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center', padding: 10}}>
          <Image source={{uri: item.thumbnailPath}} style={{width: 70, height: 70, borderRadius: 35, resizeMode: 'stretch'}}/>
        </View>
        <View style={{flex: 0.7, padding: 10}}>
          <Text style={styles.contactName}>{item.givenName + ' ' + item.familyName}</Text>
          {item.phoneNumbers.map(function(phone, index){
            return (
              <Text style={styles.contactNumber} key={index}>{phone.label}: {phone.number.replace(/-/g, '')}</Text>
            )
          })
          }
        </View>
      </TouchableOpacity>
    );
  }

  render () {
    return (
      <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>

        <NavBar title='FAKE CALLER ID' minute={this.props.userInfo.user.minutes} 
          onMenuButtonPress={() => {
            this.dropDownMenuView()
          }}
        />
        <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
          <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
        </Animated.View>
        <ScrollView>
        <View style={styles.inputs}>
          <Text style={styles.inputTitle} >NUMBER TO CALL</Text>
          <View style={styles.inputBar}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
                <PhoneInput 
                    ref='phone1' 
                    textStyle={{color: 'white', fontSize: 16}}
                    onChangePhoneNumber={(number) => {this.stateNumbers(number, true)}}
                    initialCountry={this.props.userInfo.user.country.toLowerCase()}
                    onPressFlag={() => {this.onPressFlag(1)}}
                    value={this.state.toCall}
                />
                <CountryPicker
                    ref='myCountryPicker1'
                    data={this.state.pickerData}
                    onChange={(country)=>{ this.selectCountry(country, 1) }}
                    cancelText='Cancel'
                    cca2={this.state.cc1}
                    closeable={true}
                    filterable={true}
                >
                  <View></View>
                </CountryPicker>
              </View>
              <View style={{flex: 0.2, justifyContent: 'flex-end', flexDirection: 'row'}}>
                <TouchableOpacity style={styles.contactsIcon} onPress={() => {
                  this.showContactList(1)
                }}>
                  <Ionicons name='md-contacts' color='white' size={40} />
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
          {this.props.userInfo.config.goLive == 'N'?
            null
          :
            <View>
              <Text style={styles.inputTitle}>FAKE CALLER ID</Text>
              <View style={styles.inputBar}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
                    <PhoneInput 
                        ref='phone2' 
                        textStyle={{color: 'white', fontSize: 16}}
                        onChangePhoneNumber={(number) => {this.stateNumbers(number, false)}}
                        initialCountry={this.props.userInfo.user.country.toLowerCase()}
                        onPressFlag={() => {this.onPressFlag(2)}}
                        value={this.state.fakeID}
                    />
                    <CountryPicker
                        ref='myCountryPicker2'
                        data={this.state.pickerData}
                        onChange={(country)=>{ this.selectCountry(country, 2) }}
                        cancelText='Cancel'   
                        cca2={this.state.cc2}
                        closeable={true}
                        filterable={true}                
                    >
                      <View></View>
                    </CountryPicker>
                  </View>
                  <View style={{flex: 0.2, justifyContent: 'flex-end', flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.contactsIcon} onPress={() => {
                      this.showContactList(2)     
                    }}>
                      <Ionicons name='md-contacts' color='white' size={40} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          }
          
        </View>

        <View style={styles.options}>
          <Text style={styles.inputTitle}>VOICE CHANGER</Text>
          <View style={styles.voiceOptions}>
            <TouchableOpacity style={styles.noneOption} onPress={() => {this.setVoiceOption('none'); }}>
              <View style={styles.voiceTypeView}>
                <Ionicons name='md-close-circle' color='white' size={40}/>
                <Text style={styles.inputTitle}>NONE</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.maleOption} onPress={() => {this.setVoiceOption('male'); }}>
              <View style={styles.voiceTypeView}>
                <Ionicons name='md-man' color='white' size={40}/>
                <Text style={styles.inputTitle}>MALE</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.femaleOption} onPress={() => {this.setVoiceOption('female'); }}>
              <View style={styles.voiceTypeView}>
                <Ionicons name='md-woman' color='white' size={40}/>
                <Text style={styles.inputTitle}>FEMALE</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.recordOption}>
            <View style={{flex: 0.5, alignItems: 'flex-start'}}>
              <Text style={styles.inputTitle}>RECORD CALL</Text>
            </View>
            <View style={{flex: 0.5, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <View style={{height: 50, justifyContent: 'center'}}>
              <Switch
                onValueChange={(value) => this.setState({recordCall: value})}
                value={this.state.recordCall}
                style={{height: 40}}
                onTintColor="#cfe6ba"
                tintColor="white"
                thumbTintColor={this.state.recordCall ? "#97d35f":'white'}
              />
              </View>
            </View>           
            
          </View>
          <TouchableOpacity onPress={()=> {this.placeCall()}}>
            <View style={styles.callContainer}>
              <Text style={styles.buttonText}>CALL NOW</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>By clicking "Call Now" you agree to our </Text>
          <TouchableOpacity onPress={() => { Actions.Terms() }}>
            <Text style={styles.termsConditions}>Terms & Conditions</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        <Modal
          overlayBackground={'rgba(0, 0, 0, 0.75)'}
          animationDuration={250}
          closeOnTouchOutside={true}
          open={this.state.showModal}
          modalDidClose={() => {this.setState({showModal: false})}}
          modalStyle={{height: Height - 250, padding: 20}}
        >
          <View style={styles.contactListView}>
            <ListView
              dataSource={this.state.contactData}
              renderRow={this.renderContact.bind(this)}
            />
          </View>
        </Modal>
        <Banner />
      </LinearGradient>
    );
  }
}




const styles = StyleSheet.create({
  contactListView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  contactListItem: {
    width: Width - 100, 
    height: 90, 
    flex: 1, 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  //input View
  menuView:{
    position: 'absolute',
    right: 0,
    left: 0,
    height: Height,
    backgroundColor: 'transparent',
    zIndex: 3
  },
  inputTitle: {
    color: 'white', 
    fontSize: 16, 
    fontWeight:'bold', 
    padding: 10,
    backgroundColor: 'transparent'
  },
  inputs: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    zIndex: 2
  },
  inputBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingRight: 15,
    paddingLeft: 15,
    alignItems: 'center'
  },
  voiceTypeView: {
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 6
  },
  contactsIcon: {
    justifyContent: 'flex-end',
    marginLeft: 9,
  },
  // options View
  options:{
    flex: 2,
    alignItems: 'center'
  },
  voiceOptions: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    margin: 10
  },
  noneOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flex: 2,
    alignItems: 'center',
    borderRadius: 4,
  },
  maleOption: {
    flex: 2,
    alignItems: 'center'
  },
  femaleOption: {
    alignItems: 'center',
    flex: 2,
  },
  recordOption: {
    flexDirection: 'row',
    height: 50,
    marginLeft: 10,
    marginRight: 10
  },
  callContainer: {
    width: Width - 60,
    height: 40,
    backgroundColor:'#97d35f',
    borderRadius:40,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  disclaimer: {
    fontSize: 12,
    color: '#FFFFFF88',
    backgroundColor: 'transparent',
    marginTop: 15
  },
  termsConditions: {
    fontSize: 12,
    color: '#FFFFFFDD',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  contactName: {
    fontSize: 16,
    color: 'blue',
    backgroundColor: 'transparent'
  },
  contactNumber: {
    fontSize: 16,
    backgroundColor: 'transparent'
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    loginProgress: state.loginProgress,
    userInfo: state.userInfo
  }
}, mapDispatchToProps)(CallMenu);
