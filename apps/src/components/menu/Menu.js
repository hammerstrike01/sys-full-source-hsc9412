import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Image from 'react-native-scalable-image';
import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {widthScale,heightScale,moderateScale} from '../../libs/utils'; 

const Menu = ({
  data,
  index, 
  height,
  width,
  type,
  bg,
  onChange = () => {},
}) => {  
  const rootRef = useRef();
  const scroll_ref = useRef();
  const [open, setOpen] = useState(false);
  const [parentPosition, setParentPosition] = useState();
  const [keyboardHeight, setKeyboardHeight] = useState(false);
  const ht = height?height:165;
  useEffect(() => {    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {      
      setKeyboardHeight(isIphoneX() ? e.endCoordinates.height - heightScale(48) : e.endCoordinates.height);
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
         if(type==1)
        setTimeout(() => {
          scroll_ref.current.scrollTo({
            y: index*33
          });    
        }, 300);
        
        break;
    }
  };

  return (
    <View
      ref={rootRef}
      style={[styles.root,bg&&{backgroundColor: colors.primary}]}>
      <Ripple rippleContainerBorderRadius={5} onPress={() => handlePress({type: 'root'})} style={[styles.root1,{width:width}]}>
        <View style={styles.main}>
          <Text numberOfLines={1} style={[styles.label,{color: bg? '#fff':colors.primary}]}>{data[index]}</Text> 
        </View> 
        {bg?
          <Image source={images.f_5} width={moderateScale(20)}/>:
          <Image source={images.i20} width={moderateScale(20)}/>
        }
      </Ripple>
      <Modal visible={open} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.opend}>
            {parentPosition && (
              <ScrollView showsVerticalScrollIndicator={false}
              ref={scroll_ref}
              persistentScrollbar={true}
                style={[
                  styles.scrollView,
                  styles.menuRoot,
                  {
                    width: parentPosition.width,
                    top: parentPosition.y + parentPosition.height + keyboardHeight,
                    left: parentPosition.x,
                    height: heightScale(ht),
                  },
                ]}>
                {data.map((item, idx) => (
                  // idx > 0 && (
                    <Ripple
                      key={idx}
                      onPress={() => handlePress({type: 'menu-item', index: idx})}>
                      <View style={styles.menuContainer}>
                        <Text style={styles.label}>{item}</Text>
                         
                      </View>
                    </Ripple>
                  // )               
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
    borderWidth: 1,
    borderColor:'#ccc'
  },
  menuRoot: {    
    position: 'absolute',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: heightScale(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10, 
    marginTop: 1,
    paddingTop: heightScale(5),
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(12),
  },
  opend: {
    flex: 1,
  },
  root: {
    backgroundColor: colors.white,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  
    height: moderateScale(46),
    borderRadius: moderateScale(6),
    borderColor: '#ccc',
    borderWidth: 1, 
    
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',    
    paddingVertical: heightScale(9),
    paddingHorizontal: widthScale(14), 

  },
  label: {
    fontSize: moderateScale(16),
    color: colors.black,
    fontFamily: fonts.NOTOKRR,
    lineHeight: moderateScale(18),
  },
  root1:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  
    paddingRight: moderateScale(10),
    
  }
});

export default Menu;
