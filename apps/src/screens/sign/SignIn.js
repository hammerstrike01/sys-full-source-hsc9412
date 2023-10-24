import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ImageBackground, BackHandler, Linking } from 'react-native';
import Image from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';
import { useFocusEffect } from 'react-navigation-hooks';
import BasicLayout from '../../layouts/basic-layout/BasicLayout';
import { myInfo } from '../../redux/myInfo';
import {goBack, navigate} from '../../libs/navigation';
import routes from '../../libs/routes'; 
import images from '../../libs/images';
import { screenWidth, moderateScale, validationEmail, screenHeight } from '../../libs/utils'; 
import fonts from '../../libs/fonts';
import style from '../../libs/style';
import colors from '../../libs/colors';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';  
import AppStatusBar from '../../components/status-bar/AppStatusBar';
import changeNavigationBarColor,{ showNavigationBar } from 'react-native-navigation-bar-color';
const SignIn = ({}) => {  

  useFocusEffect(
    
    React.useCallback(() => {   
      myInfo.clearData();
      myInfo.saveData('intropage',"1")
      showNavigationBar()  
      changeNavigationBarColor(colors.primary1)
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      };
    }, [])
  );
  const handleBackButtonClick = () => {//function handleBackButtonClick() {  
    return true
  }
  const login = () => { 
    navigate(routes.agree)
  } 

  return (
    <BasicLayout bg_color = {colors.primary1}>
      <AppStatusBar backgroundColor={colors.primary1} barStyle="light-content" />   
       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}> 
          <View style={styles.right}>
            <Image source={images.i10} width={moderateScale(36)}/> 
          </View>
          <View style={styles.intro_contain}>
            <View style={styles.intro_info}>
              <Image source={images.login} width={screenWidth - moderateScale(56)}/>  
            </View> 
            <Button style={[style.mt30, styles.btn_white]} onPress={()=>{navigate(routes.register)}}>
              <Text style={styles.btn_txt}>가입하기</Text>
            </Button>
            <Ripple style={[style.mt15, styles.btn_black]} onPress={()=>{navigate(routes.signIn1)}}>
              <Text style={styles.btn_txt1}>기존 회원 로그인</Text>
            </Ripple>
            <View style={style.mt20}>
              <Text style={styles.txt5}>가입하기 또는 로그인 버튼을 누르면</Text> 
            </View>
            <View>             
              <Text style={styles.txt5} onPress={()=>{navigate(routes.agree)}}>[<Text style={styles.underBar} onPress={()=>{navigate(routes.managerchanel,{url:'https://hubclub.vip/term-of-service/'})}}>이용약관</Text> 및 
              <Text style={styles.underBar} onPress={()=>{navigate(routes.managerchanel,{url:'https://hubclub.vip/privacy-policy/'})}}> 개인정보정책</Text>]에 동의하는 것으로 간주합니다.</Text>
            </View>
          </View>
           
      </ScrollView> 
    </BasicLayout>
  ); 
};
 
const styles = StyleSheet.create({
  scrollView: {
    width: screenWidth,
    flex: 1, 
    backgroundColor: colors.primary1,
    marginTop: moderateScale(-30)
  },
  image:{
    width: screenWidth,
    height: "100%", 
  },
  right:{
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: moderateScale(26)
  },
  intro_contain:{
    paddingHorizontal: moderateScale(28),
    paddingVertical: moderateScale(19),
  },
  intro_info:{  
    width: '100%', 
  },
  txt1:{
    fontFamily: fonts.NSKRB, 
    fontSize: moderateScale(12),
    color: colors.white1, 
    fontWeight:'700',
    marginLeft: moderateScale(5)
  },
  span: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8D65AF',
    width: moderateScale(84),
    height: moderateScale(28),
    borderRadius: 100,
    position: 'absolute',
    top: moderateScale(15),
    left: moderateScale(15),
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: moderateScale(8)
  },
  row1:{
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: moderateScale(8)
  },
  rowcenter:{
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  txt2:{
    fontFamily: fonts.NSKRB, 
    fontSize: moderateScale(16),
    color: colors.primary, 
    fontWeight:'700', 
  },
  txt3:{
    fontFamily: fonts.NSKRB, 
    fontSize: moderateScale(26),
    color: colors.black, 
    fontWeight:'700', 
    lineHeight: 48,
    textAlign: 'center'
  },
  txt4:{
    fontFamily: fonts.NSKRR, 
    fontSize: moderateScale(16),
    color: '#323232', 
    fontWeight:'500', 
    textAlign: 'center',
    marginTop: moderateScale(13)
  },
  txt5:{
    textAlign: 'center',
    fontFamily: fonts.NSKRR, 
    fontSize: moderateScale(12),
    color: '#fff', 
    fontWeight:'400', 
  },
  span1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F7F9',
    paddingHorizontal: moderateScale(10),
    height: moderateScale(21),
    borderRadius: 5, 
    marginRight: moderateScale(5)
  },

 
  btn_white:{
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',    
    borderColor: colors.primary,  
    borderRadius: 8,
    height:moderateScale(50)
  },
  btn_black:{
    backgroundColor: colors.primary1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',    
    borderColor: colors.primary,  
    borderRadius: 8,
    height:moderateScale(50),
    borderWidth: 1,
    borderColor : '#aaa'
  },
  btn_txt:{
  color: colors.primary,    
  fontFamily: fonts.NSKRB,
  fontWeight:'700',
  fontSize: moderateScale(16)
  },
  btn_txt1:{
    color: colors.white1,    
    fontFamily: fonts.NSKRB,
    fontWeight:'700',
    fontSize: moderateScale(16)
   },
   underBar:{
    textDecorationLine:'underline'
   }
});

export default SignIn;