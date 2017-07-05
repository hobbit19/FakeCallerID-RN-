'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Alert, Platform, TouchableHighlight, Text, View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Animated} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ModalDropdown from 'react-native-modal-dropdown'
//template
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import NavBar from '../../component/navBar.js'
import MenuView from '../../component/menuView.js'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const subjects = ['Gerneral Question', 'Problem Making Calls', 'Listening to Recordings', 'Adding Minutes', 'Credit Card Declining', 'Billing Issue']

export class Support extends Component {
  constructor (props) {
    super(props);
    this.state = {
      topic: subjects[0],
      email: '',
      message: '',
      menuMarginTop: new Animated.Value(0 - Height),
      server_status: this.props.userInfo.status
    };
  }

  componentDidMount () {
    ticketInfo.country = this.props.userInfo.user.country;
    this.getServerStatus()
  }

  getServerStatus () {
    if (this.state.server_status != 'success') {
      fetch('https://api.status.io/1.0/status/571e4481fe9259916000266a', {
        method: 'GET',
      })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.result.status_overall.status != 'Operational') {
          this.setState({server_status: resp.result.status_overall.status});
        }
      });
    } else {
      this.setState({server_status: 'Operational'});
    }
  }

  submitTicket () {
    if(!this.validateEmail(this.state.email)){
      alert('Invalid email address!')
      return
    }
    if(this.state.message.length == 0){
      alert('Message is empty!')
      return
    }
    let body = 'uuid=' + ticketInfo.uuid +
               '&source=' + ticketInfo.source +
               '&version=' + ticketInfo.version +
               '&appId=' + ticketInfo.appId +
               '&country=' + ticketInfo.country +
               '&subject=' + this.state.topic +
               '&email='+ this.state.email +
               '&message=' + this.state.message +
               '&devicePlatform' + ticketInfo.devicePlatform +
               '&deviceModel' + ticketInfo.deviceModel +
               '&deviceVersion' + ticketInfo.deviceVersion +
               '&locale' + ticketInfo.locale;

    fetch('https://api.fakecallerid.io/submitTicket', {
      method: 'POST',
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    }).then((resp) => resp.json())
      .then((respJSON) => {
        alert('Submitted successfully!')
    })
    .catch((error) => {
      Alert.alert('There was an error submitting your ticket');
      console.log(error);
    });
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

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

  updateTopic (topic) {
    this.setState({topic : topic});
  }

  render () {
    return (
      <View style={{zIndex: 2, flex:1}}>
        <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
          <NavBar title='SUPPORT' minute={this.props.userInfo.user.minutes} 
            onMenuButtonPress={() => {
              this.dropDownMenuView()
            }}
          />
          <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
            <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
          </Animated.View>

          <TouchableOpacity
            delayLongPress={5000}
            onLongPress={() => {Actions.Secret()}}
            style={this.state.server_status === 'Operational' ? styles.container : styles.containerError}>
            <Text style={styles.messageText}>Service Status: {this.state.server_status}</Text>
          </TouchableOpacity>

          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>REQUEST SUPPORT</Text>
            <View style={styles.dropdownView}>
              <ModalDropdown
                options={subjects}
                dropdownStyle={{width: Width - 40, backgroundColor: 'white', padding: 5, borderBottomWidth: 0}}
                textStyle={{fontSize: 20}}
                renderRow={(option) =>{
                  return(
                    <Text style={styles.dropDownText}>{option}</Text>
                  )
                }}
                onSelect={(option) => {this.setState({topic : subjects[option]})}}
                style={{width: Width - 30, height: 50}}
              >
                <Text style={styles.dropText}>{this.state.topic}</Text>
              </ModalDropdown>
            </View>
            <Text style={styles.supportText}>EMAIL</Text>
            <View style={styles.dropdownView}>
              <TextInput
                style={styles.inputEmail}
                placeholder='example@gmail.com'
                onChangeText={(text) => { this.setState({email: text})}}
                selectionColor="#ffffff"
                keyboardType='email-address'
                placeholderTextColor='rgba(255, 255, 255, 0.83)'
                underlineColorAndroid='rgba(255, 255, 255, 0.83)'
                autoCapitalize='none'
              />
            </View>
            <Text style={styles.supportText}>MESSAGE</Text>
            <View style={styles.dropdownView}>
              <TextInput
                style={styles.inputMessage}
                placeholder='Problem'
                onChangeText={(text) => { this.setState({message: text})}}
                selectionColor="#ffffff"
                placeholderTextColor='rgba(255, 255, 255, 0.83)'
                underlineColorAndroid='rgba(255, 255, 255, 0.83)'
                onKeyPress={()=>{}}
                textAlignVertical='top'
              />
            </View>
            <View style={styles.paymentButton}>
              <TouchableHighlight style={styles.callTouchable} onPress={() => {this.submitTicket(); }} underlayColor='rgba(65, 214, 43, 0.56)'>
                <Text style={styles.buttonText}>SUBMIT TICKET</Text>
              </TouchableHighlight>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

var ticketInfo = {
  uuid: DeviceInfo.getUniqueID(),
  source: Platform.OS,
  version: DeviceInfo.getVersion().toString(),
  appId: (Platform.OS === 'android' ? 1 : 2),
  country: null,
  subject: 'General Question',
  emailAddress: null,
  message: null,
  devicePlatfrom: Platform.OS,
  deviceModel: DeviceInfo.getModel(),
  deviceVersion: DeviceInfo.getSystemVersion(),
  locale: DeviceInfo.getDeviceLocale()
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(41, 184, 34, 0.54)',
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    justifyContent:'center',
    alignItems: 'center'
  },
  containerError: {
    backgroundColor: 'rgba(209, 25, 25, 0.55)',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    justifyContent:'center',
    alignItems: 'center'
  },
  messageText: {
    color: '#ffffff',
    alignSelf: 'center',
    paddingTop: 7,
    paddingBottom: 7
  },
  //supportcontainer
  supportContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  supportText: {
    color:'white',
    fontSize: 16,
    marginTop: 25,
    backgroundColor: 'transparent'
  },
  inputEmail: {
    color: '#ffffff',
    alignSelf: 'stretch',
    flex: 1,
    fontSize: 20,
    width: Width - 30,
    padding: 10,
  },
  inputMessage: {
    color: '#ffffff',
    alignSelf: 'stretch',
    flex: 1,
    fontSize: 20,
    width: Width - 30,
    padding: 10
  },
  callTouchable: {
    backgroundColor: '#41d62b',
    width: Width - 80,
    alignItems: 'center',
    borderRadius: 5,
    paddingBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    paddingTop: 10
  },
  paymentButton: {
    padding: 35
  },
  menuView:{
    position: 'absolute',
    right: 0,
    left: 0,
    height: Height,
    backgroundColor: 'transparent',
    zIndex: 3
  },
  dropdownView: {
    width: Width - 30,
    height: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderBottomWidth: 1,
    marginTop: 15,
    borderRadius: 4
  },
  dropText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 10,
    color: 'white'
  },
  dropDownText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 10,
    color: 'black'
  },
  
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
}, mapDispatchToProps)(Support);
