import Contacts from 'react-native-contacts';
import {PermissionsAndroid, Platform, ToastAndroid, Alert, Linking} from 'react-native'; 
import { isIos } from './utils';

 

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Contacts.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return true;
    }
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };

      Alert.alert(
        "연락처 접근",
        `연락처를 사용할 수 없습니다.${'\n'}기기의 "설정>h-club>연락처 접근"에서 연락처 접근을 허용해 주세요.`,
        [
          { text: "설정으로 이동", onPress: openSetting },
          { text: "취소", onPress: () => {} },
        ]
      );
    return false;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('기기의 "설정>앱>h-club>연락처 권한"에서 권한 허용해 주세요.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('기기의 "설정>앱>h-club>연락처 권한"에서 권한 허용해 주세요.', ToastAndroid.LONG);

  }

  return false;
}

export const getPhoneList = async (callback) => {
  if(isIos){
    Contacts.getAll().then((contacts) => {
        callback(contacts)
      }).catch((e) => {
        callback(false)
    })
    return
  }
  let hasLocation = await hasLocationPermission();

  if (!hasLocation) return;
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      'title': '연락처 차단',
      'message': '아는사람 소개받지 않기위해 연락처에 접근하려고합니다',
      'buttonPositive': '허용'
    }
  ).then(Contacts.getAll().then((contacts) => {
          callback(contacts)
        }).catch((e) => {
          callback(false)
      }))
};
// export const getCurrentPosition = async (callback) => {
//   let hasLocation = await hasLocationPermission();

//   if (!hasLocation) return callback(false);
    
//   Geolocation.getCurrentPosition(
//     (position) => { 
//       callback(position)
//     },
//     (error) => {
//       callback(false)
//       return false; 
//     },
//     { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
//   );
 
// };
 
 