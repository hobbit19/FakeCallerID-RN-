/*jshint esversion: 6*//*jshint node: true*/
'use strict';
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, TextInput, Dimensions, Animated} from 'react-native';
import countries from '../../lib/Countries';
import RadioForm from 'react-native-simple-radio-button';
import ModalDropdown from 'react-native-modal-dropdown'

//template
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import NavBar from '../../component/navBar.js'
import MenuView from '../../component/menuView.js'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const radioProps = [{label: 'Phone  ', value: 'Phone',}, {label: 'Speaker', value: 'Speaker'}]
export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuMarginTop: new Animated.Value(0 - Height),
      defaultPlay: this.props.userInfo.user.defaultPlay,
      countryCode: this.props.userInfo.user.country,
      email: this.props.userInfo.user.email,            
    };
  }

  componentDidMount() {
    this.props.initCountry(this.props.userInfo.user.country)
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

  render () {

    return (
      <View style={{zIndex: 2, flex:1}}>
        <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
          <NavBar title='SETTINGS' minute={this.props.userInfo.user.minutes} 
            onMenuButtonPress={() => {
              this.dropDownMenuView()
            }}
          />
          <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
            <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
          </Animated.View>

          <View style={styles.settingContainer}>
            <View style={styles.emailView}>
              <Text style={styles.settingsText}>EMAIL</Text>
            </View>
            <View style={styles.emailInputView}>
              <TextInput
                value={this.state.email}
                style={styles.emailInput}
                onChangeText={(text) =>{this.setState({email: text}); }}
                underlineColorAndroid='transparent'
              />
            </View>
            
            <View style={styles.countryView}>
              <Text style={styles.settingsText}>COUNTRY</Text>
            </View>
            <View style={styles.dropdownView}>
              <ModalDropdown
                options={countries}
                dropdownStyle={{width: Width - 40, backgroundColor: 'white', padding: 5, borderBottomWidth: 0}}
                textStyle={{fontSize: 20}}
                renderRow={(option) =>{
                  return(
                    <Text style={styles.dropText}>{option.name}</Text>
                  )
                }}
                onSelect={(option) => {
                  this.setState({countryCode: countries[option].code})
                  this.props.setCountryName(countries[option].name)
                }}
              >
                <Text style={styles.country}>{this.props.countryName}</Text>
              </ModalDropdown>
            </View>
            <View style={{marginTop: 20, height: 50,}}>
              <View style={styles.defaultView}>
                <Text style={styles.settingsText}>DEFAULT TO PLAY</Text>
                <RadioForm
                  radio_props={radioProps}
                  initial={this.state.defaultPlay == 'Phone'?0:1}
                  onPress={(value) => {this.setState({defaultPlay: value});}}
                  formHorizontal={true}
                  labelColor={'#ffffff'}
                  buttonColor={'#ffffff'}
                  animation={true}
                  style={styles.radioForm}
                />
              </View>
            </View>
            <View>
              
            </View>
            <View style={styles.submitContainer}>
              <TouchableOpacity style={styles.saveButton} 
                onPress={() => {
                  this.props.saveSettings(this.props.userInfo.user, this.state.email, this.state.countryCode, this.state.defaultPlay, () => {
                    alert('Saved successfully!')
                  })
                }}>
                <View>
                  <Text style={styles.buttonText}>SAVE CHANGES</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  // settings style
  settingContainer: {
    flex: 1,
    padding: 20
  },
  settingsText: {
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emailView: {
    paddingBottom: 10
  },
  emailInputView: {
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  emailInput: {
    height: 40,
    color: 'white',
    padding: 10
  },
  countryView: {
    paddingTop: 20,
    paddingBottom: 10
  },
  defaultView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  dropdownView: {
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  dropText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 10,
    color: 'black'
  },
  country: {
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 10,
    color: 'white'
  },
  radioForm: {
    backgroundColor: 'transparent'
  },
  submitContainer:{
    marginTop: 30,
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#97d35f',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 50,
    width: Width - 60
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  menuView:{
    position: 'absolute',
    right: 0,
    left: 0,
    height: Height,
    backgroundColor: 'transparent',
    zIndex: 3
  },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    countryName: state.countryName
  }
}, mapDispatchToProps)(Settings);
