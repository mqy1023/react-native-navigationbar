/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import NavigationBar from './react-native-navigationbar'

class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          backName='back'
          title='爱普云'
          actionArray={[{title: 'close', onPress: () => console.log('close')}]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('Example', () => Example);
