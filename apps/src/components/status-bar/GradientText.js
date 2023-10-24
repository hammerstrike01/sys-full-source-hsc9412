import React from 'react';
import {Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
 

const GradientText = props => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        // colors={['#d9d9d9', '#6d6d6d']}  //
        colors={['rgba(255,255,255,0.8)', 'rgba(120,120,120,0.8)']} 
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text {...props} style={[props.style, {opacity: 0}]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;