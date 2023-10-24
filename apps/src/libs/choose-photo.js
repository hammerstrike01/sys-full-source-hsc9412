import ImagePicker from 'react-native-image-crop-picker';
import {PermissionsAndroid, Platform, ToastAndroid, Alert, Linking} from 'react-native'; 

export const chooseProfile = async (type, callback) => {
  // let hasLocation = await hasLocationPermission();
  // if (!hasLocation) return;
  setTimeout(()=>{   
    if(type == "camera"){
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openCamerafdsfds catch" + err.toString()) 
      });
    } 
    else if(type == "gallery"){
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openGallery catch" + err.toString()) 
      });
    }
  }, 700);
};
export const chooseProfile1 = async (type, callback) => {
  setTimeout(()=>{   
    if(type == "camera"){
      ImagePicker.openCamera({
        width: 450,
        height: 280,
        cropping: true,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openCamera catch" + err.toString()) 
      });
    } 
    else if(type == "gallery"){
      ImagePicker.openPicker({
        width: 450,
        height: 280,
        cropping: true,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openCamera catch" + err.toString()) 
      });
    }
  }, 700);
};

export const chooseImage = async (type, callback) => {
  setTimeout(()=>{   
    if(type == "camera"){
      ImagePicker.openCamera({
        compressImageMaxWidth: 1080,
        compressImageMaxHeight: 1920,
        cropping: false,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openCamera catch" + err.toString()) 
      });
    } 
    else if(type == "gallery"){
      ImagePicker.openPicker({
        compressImageMaxWidth: 1080,
        compressImageMaxHeight: 1920,
        cropping: false,
        includeBase64 : true,
        mediaType: "photo",
        cropperChooseText:"확인",
        cropperCancelText:"닫기",
        smartAlbums:['PhotoStream', 'Generic', 'Panoramas', 'Favorites', 'Timelapses', 'AllHidden',  'Bursts', 
         'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos']
      }).then(image => {
        callback(image);
      }).catch((err) => { 
        console.log("openPicker catch" + err.toString()) 
      });
    }
  }, 700);
};

const hasLocationPermission = async () => {
    
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('기기의 "설정>앱>h-club>연락처 권한"에서 권한 허용해 주세요.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('기기의 "설정>앱>h-club>연락처 권한"에서 권한 허용해 주세요.', ToastAndroid.LONG);

  }

  return false;
}