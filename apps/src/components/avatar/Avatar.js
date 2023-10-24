import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Ripple from 'react-native-material-ripple';

const Avatar = ({style, onPress, image, width=50, height=50}) => {
  const imageView = (
    <Image source={image} style={[styles.image, width && height && {width, height}]}/>
  );

  let view = <View style={[styles.root, style, {width: width, height: height}]}>{imageView}</View>;
  
  if (onPress) {
    return <Ripple rippleContainerBorderRadius={100} onPress={onPress}>{view}</Ripple>;
  }
  return view;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 100,    
  },
  root: {    
    alignItems: 'center',
    justifyContent: 'center',    
  },
});

export default Avatar;
