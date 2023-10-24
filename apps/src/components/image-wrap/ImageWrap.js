import React from 'react';
import {Image, View, StyleSheet} from 'react-native';

const ImageWrap = ({  
  resizeMode = 'contain',
  style = {},
  image,
}) => {  
  return (
    <View style={style}>
      <Image
        source={image}
        style={[
          styles.image,
          {resizeMode},
          style.borderRadius && {borderRadius: style.borderRadius},
          style.borderTopRightRadius && {borderTopRightRadius: style.borderTopRightRadius},
          style.borderTopLeftRadius && {borderTopLeftRadius: style.borderTopLeftRadius},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',    
  },
});

export default ImageWrap;
