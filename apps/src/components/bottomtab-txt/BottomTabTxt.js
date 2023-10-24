import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import fonts from '../../libs/fonts';
import {screenWidth,moderateScale} from '../../libs/utils'; 

const BottomTabTxt = ({tintColor, label}) => {  
  return (
    <View>
      {/* <Text style={[styles.txt, {color: tintColor}]}>{label}</Text>       */}
    </View>
  );
};

const styles = StyleSheet.create({    
  txt: {
    fontSize: moderateScale(10),
    fontFamily: fonts.NSKRR,
    marginTop: moderateScale(0),
    marginBottom: moderateScale(5),
    textAlign: 'center',    
  },
});

export default BottomTabTxt;
