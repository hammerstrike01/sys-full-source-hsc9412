import React, { useState } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Image from 'react-native-scalable-image';
import {goBack,navigate} from '../../libs/navigation';
import routes from '../../libs/routes'; 
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {widthScale,heightScale,moderateScale} from '../../libs/utils'; 
import ImageWrap from '../../components/image-wrap/ImageWrap'; 

const Topbar = ({title,close,close_txt,back,back_close,alarm,alarmCnt,bg_color}) => {
  const [alarmStatus, setAlarmStatus] = useState(false);     
  return (
    <View style={styles.root}>
      {close?
        <Text style={styles.title1}>{""}</Text>    
        :
        <Ripple style={styles.back} onPress={()=>{back? navigate(routes[back]) :goBack()}}>
          {bg_color?
          <Image source={images.back} width={widthScale(32)} />:
          <Image source={images.i7} width={widthScale(32)} />
          }
        </Ripple>      
      }
      <Text style={styles.title}>{title}</Text> 
      {close&&
      <Ripple style={styles.back} onPress={goBack}>
        <Image source={images.i26} width={widthScale(24)} />
      </Ripple>    
      }  
      {!close&&
        <Text style={styles.title1}>{""}</Text>   
      }  
      {alarm&&
      <Ripple style={styles.back}>          
        <Image source={images.i8} width={widthScale(36)} />
      </Ripple>    
      }   
    </View>
  );
};
const styles = StyleSheet.create({
  photo_img: {
    borderRadius:moderateScale(48),
    width:moderateScale(48),
    height:moderateScale(48), 
  },
  root: {
    height: moderateScale(60),
    paddingLeft: widthScale(10),
    paddingRight: widthScale(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between', 
  },
  back: { 
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  title1:{
    width: moderateScale(24),
    fontSize: moderateScale(12),
    textAlign:'center',
    color: colors.primary,
    fontFamily: fonts.NSKRB,    
  },
  title: {
    fontSize: moderateScale(18),
    color: colors.black,
    fontFamily: fonts.NSKRB, 
    fontWeight:'700',   
  },  
  alarmB:{
    width:moderateScale(16),
    height:moderateScale(16),
    borderRadius:100,
    backgroundColor:'#f00',
    alignItems: 'center',
    justifyContent: 'center',  
    flexDirection: 'row',
    position:'absolute',
    right:moderateScale(2),
    top:moderateScale(16),
    // marginTop:moderateScale(-30),
    // marginLeft:moderateScale(15)   
  },
  alarm:{
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: fonts.NSKRR,
    
  }
});

export default Topbar;
