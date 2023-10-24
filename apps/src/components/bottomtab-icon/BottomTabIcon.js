import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import Image from 'react-native-scalable-image';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import {myInfo} from '../../redux/myInfo';
const BottomTabIcon = ({image, width,notification}) => {  
  return (
    <View>
      <Image source={image} width={width} />   
      {notification &&  
        <View style={styles.notification}>
          <Text style={styles.txt}>10</Text>
        </View>
      }    
    </View>
  );
};

const styles = StyleSheet.create({  
  notification: {
    backgroundColor: "#f00",
    paddingHorizontal: 4,
    paddingVertical: 0,
    position: 'absolute',
    top: -1,
    right: -9,     
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius:50,
  },
  txt: {
    fontSize: 10,
    color: colors.white1,
    fontFamily: fonts.NSKRB,
    fontWeight: '700'
  },
});
export default BottomTabIcon;
