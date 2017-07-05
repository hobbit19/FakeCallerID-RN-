'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux'

export class Splash extends Component{

  constructor(props){
    super(props);
    this.state = {
    };
  };

  componentWillMount() {
    this.props.login((result) => {
      if(result == 'Verify'){
        Actions.Verify()
      }
      else{
        Actions.PlaceCall()
      }      
    });
  }

  render(){
    return(
      <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
        <StatusBar hidden={true} />
        <View style={styles.container}>
          <View style={{marginTop: 50, height: 150}}>
            <View style={styles.logoView}>
              <Image
                style={styles.logo}
                source={require('../../image/logo.png')}
              />
            </View>
          </View>
          <Spinner visible = {this.props.loginProgress} textContent="" textStyle={{color: '#DDD'}} />
          <View style={styles.infoBox}>
            <View style={styles.infoView}>
              <Text style={styles.columnText}>{"\n"}Made with <Icon name="heart" color="rgb(255, 0, 0)" size={14} /> in Portland, OR</Text>
              <Text style={styles.columnText}>Created by Symba Ventures</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'stretch'
  },
  infoBox: {
    position: 'absolute',
    height: 100,
    padding: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  infoView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnText: {
    color: '#FFFFFF'
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    loginProgress: state.spinnerProgress,
    userInfo: state.userInfo,
    logout: state.logout
  }
}, mapDispatchToProps)(Splash);
