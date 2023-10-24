import React, { useEffect,useState } from 'react';
import { ScrollView, StyleSheet, View, Text , Keyboard} from 'react-native';
import Image from 'react-native-scalable-image'; 
import {useFocusEffect} from 'react-navigation-hooks';
import StackLayout from '../../layouts/stack-layout/StackLayout';   
import images from '../../libs/images';
import Input from '../../components/input/Input';
import {screenWidth,moderateScale, validationPhone, screenHeight, validationEmail, validationPassword, formatDate} from '../../libs/utils'; 
import fonts from '../../libs/fonts';
import style from '../../libs/style';
import colors from '../../libs/colors'; 
import {myInfo} from '../../redux/myInfo';
import Button from '../../components/button/Button';
import { navigate} from '../../libs/navigation';
import routes from '../../libs/routes'; 
import { useDispatch } from 'react-redux';
import Common from '../../components/popup/Common';
import { popupOpenCustom } from '../../redux/popup/PopupActions';
import api from '../../libs/api';
import {requestPost} from '../../libs/request';
import { Linking } from 'react-native';
import AppStatusBar from '../../components/status-bar/AppStatusBar';
import GradientText from '../../components/status-bar/GradientText';

const SignIn1 = ({}) => {  

  const [email, setEmail] = useState({value: ''});   
  const [password, setPassword] = useState({value: ''});   
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {    
      myInfo.clearData();
    }, [])
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action  
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action 
        
      }
    ); 
     
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
 
  const login = () => {
    if(!validationEmail(email.value)){
      setEmail({
        ...email,
        error: true,
        message: '이메일 형식이 유효하지 않습니다.',
      }); 
      return
    }
    if(!validationPassword(password.value)){
      setPassword({
        ...password,
        error: true,
        message: '비밀번호 양식이 맞지 않습니다. (6~15자리의 영문 대소문자, 숫자 및 특수문자 조합)',
      }); 
      return
    }
     
    requestPost(api.checkEmail, {email: email.value}, (val)=>{
      if(val){ 
        requestPost(api.login, {email: email.value, password: password.value }, (val)=>{
          if(val){ 
            if(val.user_status==3){
              out(val.out_date); 
              return
            } 
            console.log(val)
            myInfo.saveData('id',val.id)
            myInfo.saveData('login_type', val.gender);
            myInfo.saveData('nick_name', val.nick_name);
            // 푸쉬 등록하기
            
            requestPost(api.updatePushId, {id: val.id, pushId: myInfo.getData().push_id}, (r_fcm)=>{}); 
            if(val.cert_profile=="3"){
              if(val.favor_age_st){ 
                navigate(routes.home)
              }
              else
                navigate(routes.review,{type:1});
            }
            else if(val.cert_profile=="4") {
              navigate(routes.reviewReport,{reject:val.report})
            }
            else
            navigate(routes.review,{type:2})
          } 
          else{
            setPassword({
              ...password,
              error: true,
              message: '비밀번호가 맞지 않습니다.',
            });
          }
        })
      }
      else{
        setEmail({
          ...email,
          error: true,
          message: '존재하지 않는 이메일입니다.',
        }); 
      } 
    })
  } 
  const update = () => {
    dispatch(popupOpenCustom({component: <Common
      type={2} 
      title={'업데이트가 필요합니다.'}
      msg={'현재 버전 : 1.0.1\n최신 버전 : 1.0.2'}
      btnList={['다음에 하기','업데이트 하기']}
      onConfirm={() =>  {  
      }}
      onClose ={() =>  { 
      }} /> 
    })); 
  }
  const out = (date) => {
    dispatch(popupOpenCustom({component: <Common
      type={2} 
      title={'탈퇴한 계정입니다.'}
      msg={ email.value+'\n탈퇴일 : '+formatDate(date)+'\n재가입은 고객센터에 문의하세요.'}
      btnList={['확인','고객센터 가기']}
      onConfirm={() =>  {  
        Linking.openURL('https://help.hubclub.vip/');
      }}
      onClose ={() =>  { 
      }} /> 
    })); 
  }
  
  return (
    <StackLayout  title="" alarm={true} bg_color={true}>
      <AppStatusBar backgroundColor={colors.primary1} barStyle="light-content" />   
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.mtm20}>
          <View style={[{ alignItems: 'baseline' }]}>
            <GradientText style={styles.txt1}>기존 회원</GradientText>
            <GradientText style={styles.txt1}>로그인 하기!</GradientText>  
          </View> 
          
          <View style={style.mt25}>
            <Input 
              label = {"아이디 (이메일)"}  
              placeholder={"아이디를 입력하세요."}           
              data={email}
              onDataChange={setEmail}   
              // keyboardType={'numeric'} 
            /> 
          </View> 
          <View style={style.mt15}>
            <Input 
              label = {"비밀번호"}  
              placeholder={"비밀번호를 입력하세요."}           
              data={password}
              onDataChange={setPassword}  
              image={true}  
              type={"password"}
            /> 
          </View> 
          <Image source={images.f3} width={screenWidth}/> 
        </View>  
      </ScrollView> 
      {!keyboardVisible &&
      <View style={styles.pos_b}>
        <Text style={styles.txt2}>아이디를 잊으셨나요? <Text style={{fontWeight: '700'}} onPress={()=>{navigate(routes.findId)}}>아이디 찾기</Text></Text>
        <Text style={styles.txt2}>비밀번호를 잊으셨나요? <Text style={{fontWeight: '700'}} onPress={()=>{navigate(routes.findPassword)}}>비밀번호 찾기</Text></Text> 
        <Button style={[style.mt40, styles.btn_white]} onPress={()=>login()}>
              <Text style={styles.btn_txt}>로그인</Text>
            </Button>
      </View> 
      }
    </StackLayout>
  ); 
};


const styles = StyleSheet.create({  
  scrollView: {
    width: screenWidth, 
    backgroundColor: colors.primary1,
    paddingHorizontal: moderateScale(16), 
    position: 'relative'
  }, 
  mtm20:{
    marginTop: -5
  },
  txt1: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(32),
    color: colors.primary,
    lineHeight: moderateScale(48),
    fontWeight: '700', 
    zIndex: 100,
  }, 
  txt2: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: colors.white1,
    fontWeight: '400', 
    textAlign: 'center',
    marginTop: moderateScale(10)
  },
  row: { 
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  text_dec:{
    borderBottomWidth:4,
    width: moderateScale(170),
    borderColor: "#E8AA4A",
    marginTop : moderateScale(-14)
  },
  pos_b:{  
    position: 'absolute',
    width:'100%',
    bottom: moderateScale(40),
    paddingHorizontal: moderateScale(20)
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
  btn_txt:{
  color: colors.primary,    
  fontFamily: fonts.NSKRB,
  fontWeight:'700',
  fontSize: moderateScale(16)
  },
});

export default SignIn1;