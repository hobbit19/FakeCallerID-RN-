'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, Animated, Dimensions} from 'react-native';
import HTMLView from 'react-native-htmlview';

//template
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../../component/navBar.js'
import MenuView from '../../component/menuView.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'

const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height


export class Terms extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menuMarginTop: new Animated.Value(0 - Height)
    };
  }

  componentDidMount () {
    this.props.loadTermsHTML()
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
      <View style={{zIndex: 2, flex: 1}}>
        <LinearGradient style={{flex: 1}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
          <Spinner visible = {this.props.Progress} textContent="" textStyle={{color: '#444'}} />
          <NavBar title='TERMS & CONDITIONS' minute={this.props.userInfo.user.minutes} 
            onMenuButtonPress={() => {
              this.dropDownMenuView()
            }}
          />
          <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
            <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
          </Animated.View>
          <ScrollView style={styles.termsScrollView}>
            <HTMLView
              value={this.props.termsHTML}
              stylesheet={css}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

const css = StyleSheet.create({
  h2: {
    color: '#111111BB',
    fontWeight: 'bold',
    fontSize: 20
  },
  p: {
    color: '#a9a9a9',
    lineHeight: 20
  },
  div: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});

const styles = StyleSheet.create({
  termsScrollView: {
    flex: 1,
    padding: 20,
    height: Height - 50,
    backgroundColor: 'white'
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
    Progress: state.HTMLProgress,
    userInfo: state.userInfo,
    termsHTML: state.termsHTML
  }
}, mapDispatchToProps)(Terms);
