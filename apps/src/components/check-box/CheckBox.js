import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import Ripple from 'react-native-material-ripple';
import ImageWrap from '../image-wrap/ImageWrap';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {screenWidth,moderateScale, validationEmail} from '../../libs/utils'; 

const CheckBox = ({
  style,
  value,
  onChange,
  label,
  size = moderateScale(24),  
  text_style,
  type,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => onChange(!value)}>
      <View>
      {type=="agree"&&
      <View style={[styles.root, style]}>
        <Ripple onPress={() => onChange(!value)}>
          <ImageWrap style={{width: size, height: size}} image={value ? images.i5_on : images.i5_off} />
        </Ripple>
        <Text style={text_style}>{label}</Text>        
      </View>
      }
      {type=="gender"&&
      <View style={[styles.root, style]}>
        <Ripple onPress={() => onChange(!value)} rippleContainerBorderRadius={30}>
          <ImageWrap style={{width: size, height: size}} image={value ? images.i51 : images.i50} />
        </Ripple>
        <Text style={text_style}>{label}</Text>        
      </View>
      }
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(18),
    color: colors.black,
    lineHeight: moderateScale(27), 
    fontWeight: '700'
  },
});

export default CheckBox;
