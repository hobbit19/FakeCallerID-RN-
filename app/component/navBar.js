'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component, PropTypes} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, Animated, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

export class NavBar extends React.Component{
    

    constructor(props){
        super(props);
        this.state = {
            marginTop: new Animated.Value(100)
        };
    };    

    static propTypes = {
        title: PropTypes.string.isRequired,
        minute: PropTypes.string.isRequired,
        onMenuButtonPress: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onMenuButtonPress: () => undefined,
    }

    componentDidMount(){
    };

    render(){
        return(
            <View style={styles.navBar}>
                <View style={styles.container}>
                    <View style={styles.menuButton}>
                        <Button 
                            onPress={() => {
                                this.props.onMenuButtonPress()
                            }
                        }>
                            <Ionicons name='md-menu' color='white' size={25} />
                        </Button>
                    </View>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity onPress={() => {Actions.BuyCredits()}} style={styles.coinButton}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.minute} >{this.props.minute}</Text>
                            <Image source={require('../image/4coin.png')} style={styles.coinImage}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    navBar: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderColor: 'white'
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },

    menuButton: {
        position: 'absolute',
        left: 10,
        top: 0,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },

    coinButton: {
        right: 0,
        top: 0,
        position: 'absolute',
        height: 50,
    },

    minute: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18
    },
    
    coinImage: {
        width: 30,
        height: 30,
        resizeMode: 'stretch'
    }
});

export default NavBar;
