'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info';
export class Screet extends Component{

  constructor(props){
    super(props);
    this.state = {
    };
  };

  componentDidMount(){
  };

  render(){
    return(
      <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
        <View style={styles.container}>
            <View style={styles.topView}>
                <View style={styles.topContainer}>
                    <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=>{Actions.pop()}}>
                        <Ionicons name='ios-arrow-round-back' color='white' size={40} style={{backgroundColor: 'transparent'}}/>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={styles.pageTitle}>SUPER SECRET PAGE</Text>
                    </View>
                    <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=>{alert('resend')}}>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>Device UUID</Text>
                <Text style={styles.info}>{DeviceInfo.getUniqueID()}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>User ID</Text>
                <Text style={styles.info}>{this.props.userInfo.user.id}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>Minutes</Text>
                <Text style={styles.info}>{this.props.userInfo.user.minutes}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>Platform</Text>
                <Text style={styles.info}>{Platform.OS}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.title}>Platform Version</Text>
                <Text style={styles.info}>{Platform.Version}</Text>
            </View>
        </View>
      </LinearGradient>
    );
  };
}


const styles = StyleSheet.create({
  container: {
      padding: 20,
      flex: 1
  },
  pageTitle: {
    fontSize: 20,
    backgroundColor: 'transparent',
    color: 'white'
  },
  topView: {
    height: 50,
  },
  topContainer: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row'
  },
  section: {
      marginTop: 15
  },
  title: {
      fontSize: 16,
      color: 'white',
      backgroundColor: 'transparent',
      padding: 6,
  },
  info:{
      fontSize: 18,
      color: 'darkgray',
      backgroundColor: 'transparent',
      borderRadius: 4,
      padding: 6,
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo
  }
}, mapDispatchToProps)(Screet);
