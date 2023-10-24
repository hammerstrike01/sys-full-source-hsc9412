import React,{useState} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import {popupClose} from '../../redux/popup/PopupActions';
import colors from '../../libs/colors';
import style from '../../libs/style';
import fonts from '../../libs/fonts';
import Image from 'react-native-scalable-image';
import images from '../../libs/images';
import {screenWidth,moderateScale,widthScale,heightScale} from '../../libs/utils'; 


const Common = ({type,title,msg, btnList, onConfirm=null,onClose=null }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');  
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View>
        {type==1&&
        <View style={styles.root}>
          <Text style={styles.txt1}>{msg}</Text>
          {btnList.length === 1 && (
            <Ripple
              style={[styles.r_btn, style.mt20]}
              rippleContainerBorderRadius={100}
              onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
                <Text style={styles.btn_txt}>{btnList[0]}</Text>
            </Ripple>
          )}
          {btnList.length === 2 && (
            <View style={[styles.btn_part, style.mt20]}>
              <Ripple
                style={styles.l_btn}
                rippleContainerBorderRadius={100}
                onPress={() => {onClose && onClose(true);dispatch(popupClose)}}>
                  <Text style={styles.btn_txt1}>{btnList[0]}</Text>
              </Ripple>
              <Ripple
                style={styles.r_btn}
                rippleContainerBorderRadius={10}
                onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
                  <Text style={styles.btn_txt}>{btnList[1]}</Text>
              </Ripple>
            </View>
          )}          
        </View>
        }
        {type==2&&
        <View style={styles.root}>
          <Text style={styles.txt}>{title}</Text> 
          <Text style={[styles.txt1,style.mt20]}>{msg}</Text>  
          {btnList.length === 1 && (
            <Ripple
            style={[styles.l_btn, style.mt20]}
            rippleContainerBorderRadius={10}
            onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
              <Text style={styles.btn_txt}>{btnList[0]}</Text>
          </Ripple> 
          )}
          {btnList.length === 2 && (
            <View style={[styles.btn_part, style.mt20]}>
              <Ripple
                style={styles.l_btn}
                rippleContainerBorderRadius={10}
                onPress={() => {onClose && onClose(true);dispatch(popupClose)}}>
                  <Text style={styles.btn_txt1}>{btnList[0]}</Text>
              </Ripple>
              <View style={styles.borderRight}></View>
              <Ripple
                style={[styles.r_btn, styles.mlm10]}
                rippleContainerBorderRadius={10}
                onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
                  <Text style={styles.btn_txt}>{btnList[1]}</Text>
              </Ripple> 
            </View>
          )}    
        </View>
        }
        {type==3&&
        <View style={styles.root}>
          <Text style={styles.txt2}>업데이트가 필요해요​</Text>
          <View style={style.mt20}>
          <Image source={images.i40} height={moderateScale(160)} />
          </View>
          
          <Text style={[styles.txt3,style.mt10]}>현재 버전 {btnList[0]}</Text>
          <Text style={styles.txt4}>최신 버전 {btnList[1]}</Text>
          <Ripple
            style={[styles.c_btn, style.mt20]}
            rippleContainerBorderRadius={100}
            onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
              <Text style={styles.btn_txt}>업데이트하기</Text>
          </Ripple>
          <Ripple
            style={[styles.b_btn, style.mt10]}
            rippleContainerBorderRadius={100}
            onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
              <Text style={styles.txt5}>다음에 하기</Text>
          </Ripple>
        </View>
        }
        {type==4&&
        <View style={styles.root}>
          <Text style={styles.txt}>{title}</Text>  
          <TextInput
            placeholder={'내용을 입력하세요.'}
            placeholderTextColor={'#999999'}
            style={[styles.txt_input]}                
            value={content}
            onChangeText={setContent}    
            multiline={true}  
          />
          <View style={[styles.btn_part, style.mt20]}>
            <Ripple
              style={styles.l_btn}
              rippleContainerBorderRadius={10}
              onPress={() => {onClose && onClose(true);dispatch(popupClose)}}>
                <Text style={styles.btn_txt1}>{btnList[0]}</Text>
            </Ripple>
            <Ripple
              style={styles.r_btn}
              rippleContainerBorderRadius={10}
              onPress={() => {onConfirm && onConfirm(true);dispatch(popupClose);}}>
                <Text style={styles.btn_txt}>{btnList[1]}</Text>
            </Ripple> 
          </View>
        </View>
        }
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {    
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  root: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',    
    paddingTop: heightScale(30), 
  },
  root1: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',    
    justifyContent:'center',
    padding: moderateScale(10),
  },
  txt1:{
    fontSize: moderateScale(14),
    color: '#545454',
    fontFamily: fonts.NSKRR,
    lineHeight: moderateScale(20),
    textAlign: 'center',
  }, 
  txt: {
    fontSize: moderateScale(16),
    color: '#323232',
    fontFamily: fonts.NSKRB,
    lineHeight: moderateScale(24),
    textAlign: 'center',
    fontWeight:'500'
  }, 
  btn_part: {
    flexDirection: 'row', 
  },
  l_btn: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent:'center',
    borderRadius:moderateScale(100),
    borderColor:'#fff',  
    height:heightScale(50), 
    borderWidth:1,
    marginBottom:heightScale(20),
    backgroundColor:'#fff', 
    width:widthScale(125),
  },
  r_btn: {    
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent:'center',  
    height:heightScale(50),  
    marginBottom:heightScale(30),
    backgroundColor:'#fff', 
    marginLeft:widthScale(10),
    width:widthScale(125),
  }, 
  btn_txt: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: '#42464D',
    lineHeight: moderateScale(24),   
    fontWeight:'500'   
  },
  btn_txt1: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: '#9D9D9D',
    lineHeight: moderateScale(24),  
    fontWeight:'400'   
  },  
  txt2: {
    fontFamily: fonts.NSKRB,
    fontSize: moderateScale(20),
    color: colors.black,    
    fontWeight:'700'   
  },
  txt3: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: colors.black,    
    fontWeight:'400'   
  },
  txt4: {
    fontFamily: fonts.NSKRB,
    fontSize: moderateScale(14),
    color: colors.black,    
    fontWeight:'700'   
  },
  txt5: {
    fontFamily: fonts.NSKRB,
    fontSize: moderateScale(16),
    color: colors.black,    
    fontWeight:'700'   
  },
  c_btn: {    
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent:'center',
    borderRadius:widthScale(100),  
    height:heightScale(50),  
    backgroundColor: colors.black,  
    width:widthScale(200),
  }, 
  b_btn:{ 
    borderBottomWidth:1,
    marginBottom: moderateScale(30)
  },
  txt_input:{
    width:'90%',
    height:heightScale(150), 
    borderColor:'#ddd',
    borderWidth:1,
    marginTop:heightScale(20),
    padding:moderateScale(20),
    textAlignVertical:'top',
    fontFamily: fonts.NOTOKRR,
    fontSize: moderateScale(14),
    color:'#000',
  },
  borderRight:{
    width: 1,
    height: moderateScale(18),
    backgroundColor:'#e6e6e6',
    marginTop: moderateScale(15),
    marginLeft:moderateScale(10)
  },
  mlm10:{
    // marginLeft: moderateScale(-5)
  }
})
export default Common;