import React from 'react';
import {StyleSheet, SafeAreaView, View, KeyboardAvoidingView} from 'react-native';
import Topbar from '../../components/topbar/Topbar';
import colors from '../../libs/colors';
import { isIos } from '../../libs/utils';
const StackLayout = ({children, title,close,close_txt,back,alarm,bg_color}) => {
  return (
    <SafeAreaView style={[styles.safeAreaView,bg_color&&{backgroundColor: colors.primary1}]}>    
      <KeyboardAvoidingView
          behavior={isIos ? "padding" : null}
          style={{flex: 1,}}
        >        
        <Topbar title={title} close={close} close_txt={close_txt} alarm={alarm} back={back} bg_color={bg_color}/>
        <View style={styles.view}>{children}</View>  
      </KeyboardAvoidingView>        
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.white,
    flex: 1,
  },
  view: {    
    flex: 1,
  },
});

export default StackLayout;
