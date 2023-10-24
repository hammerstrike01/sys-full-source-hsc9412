import React ,{useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import lib_style from '../../libs/style';
import Image from 'react-native-scalable-image';
import images from '../../libs/images';
import {widthScale,heightScale,moderateScale, screenWidth} from '../../libs/utils'; 
import Ripple from 'react-native-material-ripple';
import ImageWrap from '../image-wrap/ImageWrap';

const Input = ({
  label,
  placeholder,
  data = {},
  onDataChange, 
  type = '',
  border = true,
  editable = true,
  keyboardType = 'default',
  style,
  image,
  imgWidth,
  textAlign,
  maxLength,
  width,
  bg
}) => {   
  const [input_type, setInputType] = useState(type);   
  return (
    <View style={width &&{ width: screenWidth- width}}>
      {label && (
        <View style={lib_style.mb7}>
          <Text style={bg?styles.label1:styles.label}>{label}</Text>
        </View>        
      )}
      <View style={[bg?styles.inputContainer1:styles.inputContainer]}>  
        <TextInput
          secureTextEntry={input_type === 'password'}
          onChangeText={value => onDataChange({value})}
          value={data.value}
          placeholder={placeholder ? placeholder : ''}
          placeholderTextColor={'#ddd'}
          style={[data.value?styles.input:styles.placeholder_inp,textAlign&&{textAlign:textAlign},style&&style,bg&&{color:colors.primary} ]}          
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength&&maxLength}    
        />
        {image && (
          <Ripple style={styles.right_position} rippleContainerBorderRadius={20} onPress={()=>{
            if(input_type === "text")
              setInputType("password")
            else
              setInputType("text")
          }}>
            
            <ImageWrap style={{width: 20, height: 20}} image={input_type  === "text" ? images.i15 : images.i15} />
             
          </Ripple>
        )}
      </View>
      {data.error && (
        <View style={styles.txt_part}> 
          <Text style={styles.err_txt}>{data.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: colors.white1, 
  },
  label1: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    color: colors.primary, 
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center', 
    height: moderateScale(48), 
    borderWidth: moderateScale(1),
    borderColor:'#EDF1F7' ,
    borderRadius: moderateScale(8),
    backgroundColor: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    height: moderateScale(48), 
    borderWidth: moderateScale(1),
    borderColor:'#EDF1F7' ,
    borderRadius: moderateScale(8),
    backgroundColor: colors.primary,
  }, 
  input: {     
    color: colors.white1, 
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    paddingHorizontal:15,
    paddingVertical:moderateScale(4), 
    width:'100%',
  },
  placeholder_inp:{ 
    color: colors.black,
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(14),
    paddingHorizontal:15,
    paddingVertical:moderateScale(4), 
    width:'100%',
  },
  err_txt: {
    color: colors.error,
    fontSize: moderateScale(12),
    fontFamily: fonts.NSKRR,
    lineHeight: moderateScale(14),  
  },
  txt_part: {
    width: '100%',
    marginTop: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  right_position:{
    position:'absolute',
    right:15,
  }, 
});

export default Input;