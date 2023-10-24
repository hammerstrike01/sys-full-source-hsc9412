import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {popupClose} from '../../redux/popup/PopupActions';
import colors from '../../libs/colors';
import Ripple from 'react-native-material-ripple';
import fonts from '../../libs/fonts';
import style from '../../libs/style';

const Popup = ({}) => {
  const {open, type, actions, component, onPressOut, noTouchFlag} = useSelector(state => state.popup);
  const dispatch = useDispatch();

  return (
    <Modal animationType="fade" visible={open} transparent={true}>
      <TouchableWithoutFeedback 
        onPress={() => {          
          onPressOut && onPressOut(true);
          !noTouchFlag && dispatch(popupClose);
        }}>
        <View style={styles.root}>
          {type === 'action' && (
            <TouchableWithoutFeedback onPress={() => {}}>              
              <View style={styles.action_part}>
                {actions.map((item, index) => (                  
                  <Ripple
                    key={index}
                    onPress={() => {
                      dispatch(popupClose);
                      item.onPress && item.onPress();
                    }}
                    style={[styles.btn, index > 0 && style.mt10]}>
                    <Text style={styles.title}>{item.title}</Text>
                  </Ripple>
                ))}
              </View>              
            </TouchableWithoutFeedback>
          )}
          {type === 'custom' && component}          
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.transparent1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  }, 
  action_part: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  btn: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.black,
    fontSize: 18,
    fontFamily: fonts.SHSNM,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Popup;
