import React, { useState ,useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Linking } from 'react-native';
import Image from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';
import BasicLayout from '../../layouts/basic-layout/BasicLayout';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import { screenWidth, moderateScale, profileImg,getAge, isIos } from '../../libs/utils'; 
import style from '../../libs/style';
import { myInfo } from '../../redux/myInfo';
import {navigate} from '../../libs/navigation';
import routes from '../../libs/routes';   
import { useDispatch } from 'react-redux'; 
import { useFocusEffect } from 'react-navigation-hooks'; 
import BottomCommentList from '../../components/bottom-comment-list/BottomCommentList';
import ImageWrap from '../../components/image-wrap/ImageWrap';
import api from '../../libs/api';
import {requestGet, requestPost} from '../../libs/request';
import Config from '../../Config';
import {useSelector} from 'react-redux';
import PushNotification from 'react-native-push-notification';
import AppStatusBar from '../../components/status-bar/AppStatusBar';
import changeNavigationBarColor,{ showNavigationBar } from 'react-native-navigation-bar-color';
import Common from '../../components/popup/Common';
import { popupOpenCustom } from '../../redux/popup/PopupActions';

const Home = ({}) => {   
  const {cnt} = useSelector(state => state.badge);
  const [pass, setPass] = useState(false); 
  const [profile, setProfile] = useState(false); 
  const [info, setInfo] = useState({}); 
  const [badge, setBadge] = useState([]); 
  const [alarmStatus, setAlarmStatus] = useState(false); 
  const [gender, setGender] = useState(false); 
  const [after, setAfter] = useState(false); 
  const dispatch = useDispatch();
  
  useFocusEffect(
    React.useCallback(() => {   
      
      showNavigationBar()
      changeNavigationBarColor(colors.white)

      if(myInfo.getData().login_type == 2){
        setGender(true)
      }
      else{
        setGender(false)
      }
      var os_type = 1
      if(isIos)
      os_type ==2
      
      requestPost(api.getPushCnt, {id:myInfo.getData().id }, (vals)=>{ 
         
        if(vals){
          PushNotification.setApplicationIconBadgeNumber(Number(vals.push_cnt));
          if(vals.push_cnt>0)
          setAlarmStatus(true)
          else setAlarmStatus(false)
        }
        else setAlarmStatus(false)
      })
      // 미작성후기 확인하기
      requestPost(api.getMyStatus, {id:myInfo.getData().id, gender: myInfo.getData().login_type }, (val)=>{ 
        console.log(val)
        if(val){ 
          setProfile(true)
          setInfo(val)
          var tt = []
          for(var i=0; i<val.cert_cnt; i++){
            if(i<5)
            tt.push(i)
          }
          setBadge(tt)
        }
        else{
          setProfile(false)
        }
      }) 
      requestPost(api.checkAfter, {id:myInfo.getData().id ,gender:myInfo.getData().login_type}, (vals)=>{ 
        if(vals){
          if(vals.cnt==vals.m_cnt ){ 
            setAfter(false) 
          }
          else{  
            setAfter(true)
          }
        }  
      })
      requestPost(api.getIntorStatus, {id:myInfo.getData().id}, (val)=>{  
        if(!val){
          myInfo.clearData();
          navigate(routes.signIn)
        }
      }) 
    }, [cnt])
  ); 
  return (
    <BasicLayout>  
      <View style={styles.top_part}>
          <Text style={styles.txt0}>Home</Text>
          <Ripple style={style.mr10} onPress={()=>navigate(routes.alarm)}>
            <Image source={images.i32} width={24}/>
            {alarmStatus&&
            <View style={styles.al_dot}></View>
            } 
          </Ripple>
        </View>     
      <ScrollView style={styles.body}> 
        
      </ScrollView>
      
      {pass &&
      <BottomCommentList 
        title = {"미작성 후기 존재"}
        list= {[]}
        type={3}
        height={moderateScale(270)}
        onPress={(value) => {  
          setPass(false) 
        }} 
        onClose={()=>{setPass(false)}} 
        selectIndex={0}
      />
      }
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  body: { 
    width: screenWidth,  
    flex:1,
    backgroundColor: '#F3F3F3',
    
  }, 
  top_part:{
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(16),
    backgroundColor: '#F3F3F3'
  },
  txt0:{
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(32),
    color: colors.primary,
    lineHeight: moderateScale(48),
    fontWeight: '700', 
  },
  matching:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth - moderateScale(60),
    marginHorizontal: moderateScale(30),
    height: screenWidth - moderateScale(60),
    backgroundColor: '#fff',
    borderRadius:moderateScale(24),
    borderWidth:1,
    borderColor:'#eee'
  },
  intro_contain:{
    paddingHorizontal: moderateScale(28), 
  },
  intro_info:{
    borderRadius: moderateScale(24),
    backgroundColor: '#fff', 
    width: '100%',
    paddingBottom: moderateScale(23),
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
    fontSize: moderateScale(14),
    color: colors.black, 
    fontWeight:'400', 
  },
  txt4:{
    fontFamily: fonts.NSKRR, 
    fontSize: moderateScale(11),
    color: '#323232', 
    fontWeight:'400', 
  }, 
  txt5:{
    fontFamily: fonts.NSKRM, 
    fontSize: moderateScale(16),
    color: colors.primary, 
    fontWeight:'500',
    lineHeight: moderateScale(20) ,
    textAlign: 'center'
  },
  txt6:{
    fontFamily: fonts.NSKRR, 
    fontSize: moderateScale(14),
    color: '#000', 
    fontWeight:'600', 
    textAlign: 'center',
    marginTop: moderateScale(10)
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
  al_dot:{
    position: 'absolute',
    right:3,
    top:3,
    width:6,
    height:6,
    borderRadius:6,
    backgroundColor:'#D9001B',
    borderWidth:1,
    borderColor:'#fff'
  },
  rowstart:{
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    marginLeft: 40,
  },
  message:{
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth:1,
    borderColor:'#C5CEE0',
    borderBottomLeftRadius: 4, 
    marginTop: moderateScale(7),
    
  },
  message_txt:{
    fontSize: 14,
    color: "#151C33",
    lineHeight: 20
  },
  ml45:{marginLeft: 45}
});

export default Home;