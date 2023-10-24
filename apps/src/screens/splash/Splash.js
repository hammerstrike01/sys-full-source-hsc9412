import React, { useEffect } from 'react';
import { StyleSheet, View,Text } from 'react-native';
import Image from 'react-native-scalable-image';
import AppStatusBar from '../../components/status-bar/AppStatusBar';
import BasicLayout from '../../layouts/basic-layout/BasicLayout';
import {navigate} from '../../libs/navigation';
import routes from '../../libs/routes';
import images from '../../libs/images';
import { screenWidth, moderateScale, screenHeight } from '../../libs/utils';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import { myInfo } from '../../redux/myInfo';
import api from '../../libs/api';
import {requestPost} from '../../libs/request';
import {hideNavigationBar, showNavigationBar }  from 'react-native-navigation-bar-color';

const Splash = ({}) => {
  
  useEffect(() => { 
    hideNavigationBar()
    myInfo.readData();
    let tm = setTimeout(() => {
      clearTimeout(tm); 
      if(myInfo.getData().intropage!=''){
        if(myInfo.getData().id>0){
          requestPost(api.getUserData, {id:myInfo.getData().id}, (val)=>{ 
            showNavigationBar()
            if(val){
              if(val.cert_profile==1){
                navigate(routes.review,{type:2});
              }
              else if(val.cert_profile==2){
                navigate(routes.review,{type:2});
              }
              else if(val.cert_profile==4){
                navigate(routes.reviewReport,{reject:val.report});
              }
              else{
                if(val.favor_age_st){ 
                  navigate(routes.home)
                }
                else
                navigate(routes.review,{type:1});
              }
            }
            else
              navigate(routes.signIn);
          }) 
          
          // 인증정보 확인하고 인증완료되었으면
          navigate(routes.home);
          // 아니면
          // navigate(routes.review);

        }
        else
          navigate(routes.signIn);
      }
      else
      navigate(routes.intro1);
    }, 2000);
  }, []);
  
  return (
    <BasicLayout>      
      <AppStatusBar backgroundColor={"#1C1E20"} barStyle="light-content" />
      <View style={styles.root}>
        <Image source={images.i6} width={screenWidth}/> 
        <View style={styles.main}>
        <Image source={images.splash} width={133}/> 
        </View>
      </View>
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: '100%',
    backgroundColor: colors.primary1,
    position: 'relative',
    marginTop:-10
  }, 
  main: {
    position: 'absolute',
    top: 120,

  }
});

export default Splash;
