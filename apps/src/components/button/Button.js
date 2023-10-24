import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import lib_style from '../../libs/style';

const Button = ({
  onPress,
  disabled = false,
  style = {},
  fontSize = 16,
  children,
  borderRadius = 8,  
  color=colors.white
}) => {
  return (
    <Ripple
      style={[
        lib_style.btnH,
        styles.button,
        {backgroundColor: colors.primary},
        disabled && {
          backgroundColor: colors.disabled,
          borderColor: colors.disabled
        },
        style,
        {borderRadius: borderRadius}
      ]}
      rippleContainerBorderRadius={borderRadius}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.btn_txt, {color:color}]}>{children}</Text>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',    
    borderColor: colors.primary,  
  },
  btn_txt: {
    color: colors.white1,    
    fontFamily: fonts.NSKRB,
    fontWeight:'700',
  },
});

export default Button;
