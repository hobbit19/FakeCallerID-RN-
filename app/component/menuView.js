'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component, PropTypes} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, Animated, Dimensions, ListView} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Actions} from 'react-native-router-flux'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const {menuData} = require('../lib/constant')
export class MenuView extends Component{

    constructor(props){
        super(props);
        this.state = {
            menuData: ds.cloneWithRows(menuData)
        };
    };

    static propTypes = {
        minute: PropTypes.string.isRequired,
        onClose: PropTypes.func
    }

    static defaultProps = {
        onClose: () => undefined
    }

    renderRow (menuItem, sectionId, rowId, highlightRow) {
        return (
        <TouchableOpacity onPress={() => { 
            switch(rowId){
                case 'CallMenu':
                    Actions.PlaceCall()
                    break
                case 'BuyCredits':
                    Actions.BuyCredits()
                    break
                case 'CallHistory':
                    Actions.CallHistory()
                    break
                case 'Settings':
                    Actions.Settings()
                    break
                case 'Support':
                    Actions.Support()
                    break
                default:
                    break
            }
            this.props.onClose()
        }}>
            <View style={rowId == 'Close'?styles.closeMenuView:styles.row}>
            <Icon name={menuItem.ico} size={20} style={styles.ico} />
            <Text style={styles.leftText}>{menuItem.str}</Text>
            <View style={styles.rightView}>
                {
                    menuItem.extra !== '' ? 
                        <View style={styles.minuteView}>
                            <Text style={styles.rightText}>{this.props.minute}</Text>
                        </View>
                    : null
                }
            </View>
            </View>
        </TouchableOpacity>
        );
    }

    render(){
        return(
                <View style={styles.container}>
                    <ListView
                        dataSource={this.state.menuData}
                        renderRow={this.renderRow.bind(this)}
                    />
                </View>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1775FF'
    },
    rightText: {
        color: '#1775ff',
        backgroundColor: 'transparent',
        padding: 3
    },
    minuteView: {
        height: 25,
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'white'
    },
    leftText: {
        color: '#ffffff',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1066DD66'
    },
    closeMenuView: {
        backgroundColor: '#1066DD',
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1066DD66'
    },
    rightView: {
        alignItems: 'flex-end',
        flex: 1,
    },
    ico: {
        color: '#ffffff',
        paddingRight: 13
    }
});

export default MenuView;
