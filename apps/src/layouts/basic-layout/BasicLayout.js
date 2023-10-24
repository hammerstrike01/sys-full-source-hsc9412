import React from 'react';
import {StyleSheet, SafeAreaView,KeyboardAvoidingView} from 'react-native';
import colors from '../../libs/colors';
import { isIos } from '../../libs/utils';
import AppStatusBar from '../../components/status-bar/AppStatusBar';
const BasicLayout = ({  
  children, bg_color 
}) => {
  return (
    <SafeAreaView style={[styles.safeAreaView,bg_color&&{backgroundColor: bg_color}]}>
      {/* {bg_color&&    
      <AppStatusBar backgroundColor={colors.white} barStyle="dark-content" style={styles.st_bar}/>   
      } */}
      {/* <AppStatusBar backgroundColor={colors.white} barStyle="dark-content" style={styles.st_bar}/>    */}
      <KeyboardAvoidingView
        behavior={isIos ? "padding" : null}
        style={{flex: 1}}
      >    
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#fff',
    flex: 1,
  },
  st_bar:{
    margin:0,
    padding:0,
  }
});

export default BasicLayout;
