import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Image from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {widthScale,heightScale,moderateScale} from '../../libs/utils'; 

const Detail = ({
  data,
  index, 
  height,
  width,
  onChange = () => {},
}) => {  
  const rootRef = useRef();
  const [open, setOpen] = useState(false);
  const [parentPosition, setParentPosition] = useState();
  const [keyboardHeight, setKeyboardHeight] = useState(false);
  const ht = height?height:165;
  useEffect(() => {    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {      
      setKeyboardHeight(isIphoneX() ? e.endCoordinates.height - heightScale(34) : e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      setKeyboardHeight(0);
    });

    return () => {      
      if(keyboardDidShowListener)
        keyboardDidShowListener.remove();  
      if(keyboardDidHideListener)
        keyboardDidHideListener.remove();
    };
  }, []);

  const handlePress = action => {
    switch (action.type) {
      case 'menu-item':
        onChange(action.index);
        setOpen(false);
        break;
      case 'root':
        rootRef.current.measure((fx, fy, width, height, px, py) => {
          setParentPosition({x: px, y: py, width, height});
        });        
        setOpen(true);
        break;
    }
  };

  return (
    <View
      ref={rootRef}
      style={styles.root}>
      <Ripple rippleContainerBorderRadius={5} onPress={() => handlePress({type: 'root'})} style={[styles.root1]}>
        <Image source={images.i45} width={moderateScale(10)}/>
      </Ripple>
      <Modal visible={open} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.opend}>
            {parentPosition && (
              <ScrollView showsVerticalScrollIndicator={false}
              persistentScrollbar={true}
                style={[
                  styles.scrollView,
                  styles.menuRoot,
                  {
                    width: parentPosition.width,
                    top: parentPosition.y + parentPosition.height + keyboardHeight -6,
                    left: parentPosition.x,
                    
                  },
                ]}>
                {data.map((item, idx) => ( 
                    <Ripple
                      key={idx}
                      onPress={() => handlePress({type: 'menu-item', index: idx})}>
                      <View style={styles.menuContainer}>
                        <Text style={styles.label}>{item}</Text>
                         
                      </View>
                    </Ripple>       
                ))}
                <View style={{height: heightScale(10)}}></View>
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    alignSelf: 'stretch',
  },
  menuRoot: {    
    position: 'absolute', 
    backgroundColor: colors.white1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: heightScale(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,  
    paddingTop: heightScale(10),
    paddingBottom:heightScale(15),
    borderRadius:10,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingTop: moderateScale(13)
  },
  opend: {
    flex: 1, 
  },
  root: {
    backgroundColor: colors.white1,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',  
    width:moderateScale(96),
  }, 
  label: {
    fontSize: moderateScale(14),
    color: '#000',
    fontFamily: fonts.NSKRB,
    fontWeight:'700'
    
  },
  root1:{
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'center',
    width: moderateScale(24)
  }
});

export default Detail;
