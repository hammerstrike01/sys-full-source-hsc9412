import Toast from 'react-native-simple-toast';

export const showToastMessage = message => {
  
  Toast.show(message, Toast.LONG);
};