'use strict'
import React, {PropTypes} from 'react'
import { Text, View, TouchableOpacity, Platform, NativeModules, StatusBar } from 'react-native'
import styles from './styles'

const StatusBarManager = NativeModules.StatusBarManager
const ABOVE_LOLIPOP = Platform.Version && Platform.Version > 19

export const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)
export const NAV_BAR_HEIGHT = (Platform.OS === 'ios' ? 44 : 56)
export const getStatusBarHeight = () => new Promise((resolve, reject) => {
  if (Platform.OS === 'ios') {
    StatusBarManager.getHeight(result => resolve({platform: 'ios', height: result.height}))
  } else {
    resolve({platform: 'android', height: StatusBar.currentHeight})
  }
})
export default class extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    backFunc: PropTypes.func,
    actionArray: PropTypes.array.isRequired,
    titleColor: PropTypes.string,
    titleStyle: Text.propTypes.style,
    barTintColor: PropTypes.string,
    renderAction: PropTypes.func,
    actionName: PropTypes.string,
    actionFunc: PropTypes.func,
    actionTextColor: PropTypes.string,
    actionNameStyle: Text.propTypes.style,
    backIconHidden: PropTypes.bool,
    statusbarPadding: PropTypes.bool,
    backColor: PropTypes.string,
    backName: PropTypes.string,
    barOpacity: PropTypes.number,
    barBottomColor: PropTypes.string,
    barBottomThickness: PropTypes.number,
    barStyle: View.propTypes.style, // add extended style for navigationBar
    barWrapperStyle: View.propTypes.style
  };

  static defaultProps = { // 返回默认的一些属性值
    actionArray: [],
    backColor: '#777',
    titleColor: '#333',
    barTintColor: 'white',
    actionTextColor: '#666',
    backIconHidden: false,
    statusbarPadding: Platform.OS === 'ios' || ABOVE_LOLIPOP,
    barBottomColor: '#d4d4d4',
    barBottomThickness: 0.5,
    barOpacity: 1
  };

  state={
    adaptiveStatusBar: true,
    statusBarHeight: STATUS_BAR_HEIGHT
  };

  render () {
    const {adaptiveStatusBar, statusBarHeight} = this.state
    return (
      <View style={this.props.barWrapperStyle}>
        <View style={{height: adaptiveStatusBar && this.props.statusbarPadding ? statusBarHeight : 0, backgroundColor: this.props.barTintColor}}/>
        <View style={
          [styles.navbar,
            {
              backgroundColor: this.props.barTintColor,
              height: NAV_BAR_HEIGHT,
              opacity: this.props.barOpacity,
              borderBottomWidth: this.props.barBottomThickness,
              borderBottomColor: this.props.barBottomColor
            },
          this.props.barStyle]
        }
        onLayout={() => getStatusBarHeight().then(result => this.setState({statusBarHeight: result.height}))}
        >
          {
            <View style={[styles.leftWrapper, {flex: this.props.actionArray.length || 1}]}>
              <TouchableOpacity onPress={this.props.backFunc} style={styles.backWrapper}
                hitSlop={{top: 0, left: 0, right: 20, bottom: 0}}>
                {
                  !this.props.backIconHidden
                  ? <View style={[styles.icon, {borderColor: this.props.backColor}]} />
                  : null
                }
                <Text style={[styles.backName, {color: this.props.backColor, marginLeft: this.props.backIconHidden ? 12 : 0}]} numberOfLines={1}>{this.props.backName}</Text>
              </TouchableOpacity>
              {
                this.props.actionArray.map((action, index) => <TouchableOpacity key={index} onPress={action.onPress} style={styles.action}>
                  <Text style={[styles.backName, {color: action.color || this.props.backColor}]}>{action.title}</Text>
                </TouchableOpacity>)
              }
            </View>
          }
          <View style={styles.titleWrapper}>
            <Text style={[styles.title, {color: this.props.titleColor}, this.props.titleStyle]} numberOfLines={1}>{this.props.title}</Text>
          </View>
          {
            this.props.actionName
            ? <TouchableOpacity style={styles.actionWrapper} onPress={this.props.actionFunc}>
                <Text style={[styles.actionName, { color: this.props.actionTextColor }, this.props.actionNameStyle]} numberOfLines={1}>{this.props.actionName}</Text>
              </TouchableOpacity>
            : (this.props.renderAction
              ? <TouchableOpacity style={styles.actionWrapper} onPress={this.props.actionFunc}>
                  {this.props.renderAction()}
                </TouchableOpacity>
              : <View style={styles.actionWrapper}/>
              )
          }
        </View>
      </View>
    )
  }
}
