/*jshint esversion: 6*//*jshint node: true*/
'use strict';
import React, {Component} from 'react';
import { 
  Text, 
  Platform, 
  View, 
  StyleSheet, 
  ListView, 
  TouchableOpacity, 
  Image, 
  Button, 
  TextInput, 
  ScrollView, 
  Dimensions, 
  Animated
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-simple-modal';
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
const {creditData} = require('../../lib/constant')
const Months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const Years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040]
var Sound = require('react-native-sound');
Sound.setCategory('Playback');



export class BuyCredits extends Component{


  constructor (props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      creditDataSource: ds,
      step:1,
      showModal: false,
      menuMarginTop: new Animated.Value(0 - Height),
      expMonth: 'Exp Month',
      expYear: 'Exp Year',
      package: 0,
      isLoadedSound: false,
      selectedCreditData: {}
    };
  }

  componentDidMount () {
    this.setCreditData();
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

  successfulPurchase () {
    const _this = this
    var cardDetails = {
      "card[number]": this.state.cardNumber,
      "card[exp_month]": this.state.expMonth,
      "card[exp_year]": this.state.expYear,
      "card[cvc]": this.state.cVC
    };
    // var cardDetails = {
    //   "card[number]": '4242 4242 4242 4242',
    //   "card[exp_month]": 12,
    //   "card[exp_year]": 2020,
    //   "card[cvc]": 550
    // };
    var otherDetails = {
      name: this.state.cardName,
      email: this.props.userInfo.user.email,
      country: this.props.userInfo.user.country,
      userId: this.props.userInfo.user.id,
      package: this.state.package,
      coupon: this.state.coupon
    }
    this.props.getStripeToken(cardDetails, otherDetails, this.props.userInfo.config.stripe_public_key, () => {
      
      const Minutes = _this.props.userInfo.user.minutes;
      const minAfterPurchase = String(Number(Minutes) + Number(_this.state.selectedMinutes.amount));
      _this.props.userInfo.user.minutes = String(Number(Minutes) + Number(_this.state.selectedMinutes.amount));
      _this.setState({showModal: true});
      _this.props.setUserInfo(_this.props.userInfo)
    })
  }

  checkInputDatas() {
    return true
  }

  playSound() {
    const _this = this
    var whoosh = new Sound('coinspurchase.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        alert('LITIYAN_SOUND_LOAD_ERROR');
        _this.setState({isLoadedSound: false})
        return;
      } 
      // loaded successfully
      // Play the sound with an onEnd callback
      _this.setState({isLoadedSound: true})
    });

    setTimeout(() => {
      if(!this.state.isLoadedSound) return
      whoosh.play((success) => {
        if (success) {
          alert('successfully finished playing');
        } else {
          alert('playback failed due to audio decoding errors');
        }
      });

      whoosh.setVolume(0.5);
      // Position the sound to the full right in a stereo field
      whoosh.setPan(1);
      // Loop indefinitely until stop() is called
      whoosh.setNumberOfLoops(0);
    }, 500)
    
  }

  makePurchase () {
    //this.playSound()
    // purchase minutes api call
    if(this.checkInputDatas()) this.successfulPurchase();
  }

  renderPaymentType () {
    if (this.state.paymentType && this.state.step === 3) {
      switch (this.state.paymentType) {
        case 'creditDebit':
          return(
            <ScrollView style={styles.paymentInputView}>
              <LinearGradient style={{flex: 1, paddingTop: 20}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
                <View style={{height: 60, marginBottom: 30}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={styles.backButtonView}>
                      <TouchableOpacity onPress={() => {this.setState({step: 2})}}>
                        <Ionicons name='ios-arrow-round-back' color='white' size={40} style={{backgroundColor: 'transparent'}}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, paddingRight: 15}}>
                      <View style={{height: 60, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 4, padding: 10}}>
                        <View style={styles.row}>
                          {this.renderSmallRowImage(this.state.selectedCreditData.imgUrl)}
                          <View style={styles.infoContainer}>
                            <Text style={{fontWeight: 'bold', fontSize:18, color: '#ffffff'}}>{this.state.selectedCreditData.amount} Credits</Text>
                            <Text style={{fontSize:16, color: '#ffffff'}}>{this.state.selectedCreditData.perCredit} per credit</Text>
                          </View>
                          <Text style={[styles.price, styles.creditText]}>{this.state.selectedCreditData.price}</Text>
                        </View>
                      </View>
                    </View>
                    
                  </View>
                </View>
                
                <View style={styles.textInputView}>
                  <TextInput
                    placeholder='Name on Card'
                    onChangeText={(text) => {this.setState({cardName: text})}}
                    placeholderTextColor='rgba(255, 255, 255, 0.83)'
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    textStyle={styles.dropDownText}
                  />
                </View>
                <View style={styles.textInputView}>
                  <TextInput
                    placeholder='Card Number'
                    onChangeText={(text) => {this.setState({cardNumber: text})}}
                    placeholderTextColor='rgba(255, 255, 255, 0.83)'
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    style={styles.textInput}
                    textStyle={styles.dropDownText}
                  />
                </View>
                <View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 0.5}}>
                      <View style={styles.textInputView}>
                        <ModalDropdown
                          options={Months}
                          dropdownStyle={styles.dropDownModalView}
                          textStyle={{fontSize: 20}}
                          renderRow={(option) =>{
                            return(
                              <Text style={styles.dropText}>{option}</Text>
                            )
                          }}
                          onSelect={(option) => {
                            this.setState({expMonth: Number(option) + 1})
                          }}
                          style={styles.dropDownView}
                        >
                          <Text style={styles.dropDownText}>{this.state.expMonth}</Text>
                        </ModalDropdown>
                      </View>
                    </View>
                    <View style={{flex: 0.5}}>
                      <View style={styles.textInputView}>
                        <ModalDropdown
                          options={Years}
                          dropdownStyle={styles.dropDownModalView}
                          textStyle={{fontSize: 20}}
                          renderRow={(option) =>{
                            return(
                              <Text style={styles.dropText}>{option}</Text>
                            )
                          }}
                          onSelect={(option) => {
                            this.setState({expYear: Number(option) + 2018})
                          }}
                          style={styles.dropDownView}
                        >
                          <Text style={styles.dropDownText}>{this.state.expYear}</Text>
                        </ModalDropdown>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 0.5}}>
                      <View style={styles.textInputView}>
                        <TextInput
                          placeholder='CVC'
                          onChangeText={(text) => {this.setState({cVC: text})}}
                          placeholderTextColor='rgba(255, 255, 255, 0.83)'
                          underlineColorAndroid='transparent'
                          style={styles.textInput}
                          textStyle={styles.dropDownText}
                          keyboardType='numeric'
                        />
                      </View>
                    </View>
                    <View style={{flex: 0.5}}>
                      <View style={styles.textInputView}>
                        <TextInput
                          placeholder='ZIP/Postal Code'
                          onChangeText={(text) => {this.setState({zipCode: text})}}
                          placeholderTextColor='rgba(255, 255, 255,  0.83)'
                          underlineColorAndroid='transparent'
                          style={styles.textInput}
                          textStyle={styles.dropDownText}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.textInputView}>
                  <TextInput
                    placeholder='Coupon Code'
                    onChangeText={(text) => {
                      this.props.checkCoupon(text, this)
                      this.setState({coupon: text})
                    }}
                    placeholderTextColor='rgba(255, 255, 255, 0.83)'
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    textStyle={styles.dropDownText}
                    autoCapitalize='none'
                  />
                </View>
                <View>
                  <Text style={styles.autoCouponText}>{this.props.autoCoupon}</Text>
                </View>
                <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => {this.makePurchase()}} style={{marginTop: 10}}>
                    <View style={styles.buyButtonView}>
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ScrollView>
          );
        case 'applePay':
          break;
        case 'googleWallet':
          break;
        case 'paypal':
          break;
      }
    }
  }

  renderPaymentOptions () {
    var osOption;
    if (Platform.OS === 'ios') {
      osOption = <TouchableOpacity onPress={() => {this.setState({paymentType: 'applePay', step: 3});}}>
                    <View>
                      <Text style={styles.creditText}>Apple Pay</Text>
                    </View>
                  </TouchableOpacity>
    } else if (Platform.OS === 'android') {
      osOption = <TouchableOpacity onPress={() =>{this.setState({paymentType: 'googleWallet', step: 3});}}>
                    <View>
                      <Text style={styles.creditText}>Google Wallet</Text>
                    </View>
                  </TouchableOpacity>
    }

    if (this.state.selectedMinutes && this.state.step === 2) {
      return(
        <View style={styles.paymentOptions}>
          {this.props.userInfo.config.goLive == 'N'?
            null
          :
            <View style={styles.paymentButton}>
              <TouchableOpacity onPress={() => {this.setState({paymentType: 'creditDebit', step: 3});}}>
                <View>
                  <Text style={styles.creditText}>Credit/Debit</Text>
                </View>
              </TouchableOpacity>
            </View>
          }          
          <View style={styles.paymentButton}>
            <TouchableOpacity onPress={() => {this.setState({paymentType: 'paypal', step: 3});}}>
              <View>
                <Text style={styles.creditText}>Paypal</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentButton}>
            {osOption}
          </View>
        </View>
      );
    }
  }

  renderRowImage (imageCode) {
    switch (imageCode) {
      case 'coin1':
        return(<Image source={require('../../image/1coin.png')} />);
      case 'coin2':
        return (<Image source={require('../../image/2coin.png')} />);
      case 'coin4':
        return(<Image source={require('../../image/4coin.png')} />);
      case 'coin6':
        return(<Image source={require('../../image/6coin.png')} />);
      case 'coinStack':
        return(<Image source={require('../../image/coinStack.png')} />);
    }
  }

  renderSmallRowImage (imageCode) {
    switch (imageCode) {
      case 'coin1':
        return(<Image source={require('../../image/1coin.png')} style={styles.smallCoinImage}/>);
      case 'coin2':
        return (<Image source={require('../../image/2coin.png')} style={styles.smallCoinImage}/>);
      case 'coin4':
        return(<Image source={require('../../image/4coin.png')} style={styles.smallCoinImage}/>);
      case 'coin6':
        return(<Image source={require('../../image/6coin.png')} style={styles.smallCoinImage}/>);
      case 'coinStack':
        return(<Image source={require('../../image/coinStack.png')} style={styles.smallCoinImage}/>);
    }
  }

  setCreditData () {
    this.setState({
        creditDataSource: this.state.creditDataSource.cloneWithRows(creditData)
    });
  }

  _toPaymentOption (creditItem, creditID) {
    if(this.state.step == 1){
      let data = creditData[creditItem];
      this.setState({
        selectedMinutes: data,
        creditDataSource: this.state.creditDataSource.cloneWithRows([data]),
        step: 2,
        package: data.package,
        price: data.price,
        selectedCreditData: data
      });

    }
  }

  renderRow (creditItem, sectionId, rowId, highlightRow) {
    console.log(creditItem);
    return (
      <View>
        <TouchableOpacity style={styles.creditElement} onPress={this._toPaymentOption.bind(this, rowId)}>
          <View style={styles.row}>
            {this.renderRowImage(creditItem.imgUrl)}
            <View style={styles.infoContainer}>
              <Text style={{fontWeight: 'bold', fontSize:18, color: '#ffffff'}}>{creditItem.amount} Credits</Text>
              <Text style={{fontSize:16, color: '#ffffff'}}>{creditItem.perCredit} per credit</Text>
            </View>
            <Text style={[styles.price, styles.creditText]}>{creditItem.price}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderTopTextView() {
    if(this.state.step == 2){
      return(
        <TouchableOpacity onPress={() => {
              if(this.state.step == 2){
                this.setState({step: 1})
                this.setCreditData()
              }
        }}>
          <View>
            <Text style={styles.otherPurchaseText}>Select payment method</Text>
          </View>
        </TouchableOpacity>
      )
    }
    else{
      return(
        <Text style={styles.centeredText}>Purchasing Credits removes advertisements</Text>
      )
    }
  }

  render(){
    return(
      <View style={{zIndex: 2, flex:1}}>
        <LinearGradient style={{flex: 1, paddingBottom: 20}} colors={[ '#1775ff', '#31dbd2']} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}>
          <NavBar title='BUY CREDITS' minute={this.props.userInfo.user.minutes} 
            onMenuButtonPress={() => {
              this.dropDownMenuView()
            }}
          />
          <Animated.View style={[styles.menuView, {top: this.state.menuMarginTop}]}>
            <MenuView minute={this.props.userInfo.user.minutes} onClose={() => {this.dismissMenuView()}}/>
          </Animated.View>
          {this.renderTopTextView()}
          <ListView
            dataSource={this.state.creditDataSource}
            renderRow={this.renderRow.bind(this)}
          />
          {this.renderPaymentOptions()}
          {this.renderPaymentType()}

          <Modal
            overlayBackground={'rgba(0, 0, 0, 0.75)'}
            animationDuration={250}
            closeOnTouchOutside={true}
            open={this.state.showModal}
            modalDidClose={() => {this.setState({showModal: false})}}
            modalStyle={styles.modal}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Now</Text>
              <Text style={styles.modalMinutes}>{this.props.userInfo.user.minutes}</Text>
              <Text style={styles.modalTitle}>Credits</Text>
            </View>
          </Modal>
        </LinearGradient>
      </View>
    );
  }
}

const styles= StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  centeredText: {
    color: "#ffffff",
    marginTop: 14,
    marginBottom: 3,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  creditText: {
    color: '#ffffff',
    fontSize: 20
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingBottom: 5
  },
  backButtonView: {
    flex: 0.15, 
    justifyContent: 'flex-start', 
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  creditElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5
  },
  paymentButton: {
    margin: 10,
    backgroundColor: '#FFFFFF33',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropDownView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  dropDownText: {
    width: Width / 2 - 20, 
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
    padding: 10
  },
  dropDownModalView: {
    width: Width / 2 - 20, 
    height: 200, 
    backgroundColor: 'white', 
    padding: 5, 
    borderBottomWidth: 0
  },
  buyButtonView: {
    margin: 10,
    backgroundColor: '#97d35f',
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: Width - 80
  },
  buyButtonText: {
    color: 'white',
    fontSize: 24
  },
  // payment info
  textInputView: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10
  },
  dropText: {
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 10,
    color: 'black'
  },
  //modal
  modal:{
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMinutes: {
    fontSize: 50,
    color: '#ffffff'
  },
  modalTitle: {
    fontSize: 40,
    color: '#ffffff'
  },
  textInput: {
    height: 60,
    padding: 10,
    color: 'white'
  },
  paymentInputView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  confirmPurchaseView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  confirmAmountTetxt: {
    fontSize: 30, 
    color: 'yellow', 
    textAlign: 'center', 
    backgroundColor: 'transparent'
  },
  menuView:{
    position: 'absolute',
    right: 0,
    left: 0,
    height: Height,
    backgroundColor: 'transparent',
    zIndex: 3
  },
  otherPurchaseText: {
    color: 'white', 
    backgroundColor: 'transparent', 
    textAlign: 'center', 
    paddingTop: 20,
    fontSize: 16
  },
  autoCouponText: {
    color: 'yellow', 
    fontSize: 18, 
    backgroundColor: 'transparent', 
    padding: 20, 
  },
  coinImages: {
    width: 40,
    height: 40,
    resizeMode: 'stretch'
  },
  smallCoinImage: {
    width:30,
    height: 30,
    resizeMode: 'stretch'
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    autoCoupon: state.autoCoupon
  }
}, mapDispatchToProps)(BuyCredits);
