import React from 'react';
import {View, StatusBar, LogBox,Text,TextInput} from 'react-native';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import store from './redux/store';
import RootSwitch from './Route';
import colors from './libs/colors';
import {setTopLevelNavigator, navigate} from './libs/navigation';
import Popup from './components/popup/Popup';

import api from './libs/api';
import {requestPost} from './libs/request';
import {myInfo} from './redux/myInfo';
import routes from './libs/routes';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import {isIos} from './libs/utils';
import {badgeDisplay} from './redux/badge/BadgeActions';
import {useSelector} from 'react-redux';
// import Progress from './components/progress/Progress.js';
LogBox.ignoreAllLogs();

class App extends React.Component {
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.autoCorrect = false;
    TextInput.defaultProps.allowFontScaling = false;
    this.handleNotification = this.handleNotification.bind(this);
    myInfo.readData()
  }

  async handleNotification(notification) {   // push click
    console.log("notification0:::",notification.data)
    if(notification.data){ 
      setTimeout(function(){ 
        
        if(notification.data.path=="review"){
          myInfo.saveData("review",1)
          navigate(routes.review,{type:1});    
        }
        else if(notification.data.path=="home") {
          
          store.dispatch(badgeDisplay({cnt: 1}));
          navigate(routes.home)
        }
        else if(notification.data.path=="matching") {
          navigate(routes.matching)
        }
        else if(notification.data.path=="reviewReport") {
          navigate(routes.reviewReport,{reject:notification.data.memo})
        } 
      },2500) 
    }  
  }
  
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
   
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log("TOKEN:", token);
      },
      
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // console.log("NOTIFICATION:", notification);
        // var BadgeAndroid = require('react-native-android-badge');
        // BadgeAndroid.setBadge(19);
        if(notification.tag === undefined && notification.foreground){  
          if(notification.data.path=="review"){
            myInfo.saveData("review",1)
            navigate(routes.review,{type:1});    
          }
            
          else if(notification.data.path=="reviewReport") {
            navigate(routes.reviewReport,{reject:notification.data.memo})
          }
          else if(notification.data.path=="home") {
            
            store.dispatch(badgeDisplay({cnt: 1}));
            navigate(routes.home)
          }
          else if(notification.data.path=="matching") {
            navigate(routes.matching)
          }
        } 
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        // console.log("ACTION:", notification.action);
        // console.log("NOTIFICATION:", notification);
        // process the action
      },
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        // console.error(err.message, err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      * - if you are not using remote notification or do not have Firebase installed, use this:
      *     requestPermissions: Platform.OS === 'ios'
      */
      requestPermissions: isIos,
    });

    PushNotification.createChannel(
      {
        channelId: "staffs", // (required)
        channelName: "staffs", // (required)        
      },
      (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
    ); 
    // PushNotification.setApplicationIconBadgeNumber(1)
  }

  componentWillUnmount() {    
    this.notificationOpenedListener();
  }
 
  async checkPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      this.getToken();
    }else{
      console.log('permission rejected');
    }
  }

  getToken() { 
    console.log("ff");
    messaging().getToken().then(async fcmToken => { 
      if (fcmToken) {   
        myInfo.saveData('push_id', fcmToken);
        console.log('getFcmToken: No token received111111',fcmToken); 
        if(myInfo.getData().id > 0){
          requestPost(api.updatePushId, {id: myInfo.getData().id, pushId: fcmToken}, (r_fcm)=>{});
        }
      } else { 
        
        console.log('getFcmToken: No token received222222');
      } 
    });
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationOpenedListener = messaging().onMessage(async remoteMessage => {      
      // console.log("foreground", remoteMessage);
      // 메시지가 왔으면  
      // if(remoteMessage.data.chat_type==1){
      //   // 시간 표시하기
      //   var now_date = new Date();    
      //   let hour = now_date.getHours();
      //   let minute = now_date.getMinutes();
      //   let t_hour = hour < 10 ? '0'+hour : hour;
      //   let t_minute = minute < 10 ? '0'+minute : minute;  
      //   let returnStr =t_hour+":"+t_minute;

      //   PushNotification.localNotification({
      //     channelId: "dreamrider", 
      //     largeIconUrl: "http://43.200.3.58/staffs_admin/upload/post1658499822_1.jpg", 
      //     title: remoteMessage.notification.title+"  "+remoteMessage.data.oNickName+" "+returnStr,
      //     message: remoteMessage.notification.body,
      //     priority: 'high',
      //     largeIcon: '',
      //     userInfo: remoteMessage.data,
         
      //   });
      // }
      // else{
        
        PushNotification.localNotification({
          channelId: "staffs", 
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body ,
          priority: 'high',
          largeIcon: '',
          userInfo: remoteMessage.data,
         
        });
      // }
      console.log('Message handled in the background!123');
      console.log("remoteMessage.data.path:",remoteMessage.data.path)
      if(remoteMessage.data.path == "review"){
        myInfo.saveData("review",1)
        navigate(routes.review,{type:1});    
      }  
      PushNotification.setApplicationIconBadgeNumber(Number(remoteMessage.data.msgCnt))
      
      this.setBottomBadge(remoteMessage);
    });
    // 
    messaging().onNotificationOpenedApp(remoteMessage => { //Background상태에서 FCM Notification을 클릭하여 Foreground로 될 때 클릭한 FCM정보를 얻는다.      
      // console.log(" onNotificationOpenedApp : ", remoteMessage);
      if(Boolean(remoteMessage)) {
        // console.log( 'onNotificationOpenedApp:', remoteMessage.notification, );
        // 
        this.handleNotification(remoteMessage);
        console.log('Message handled in the background!124');
      }
    });

    // Check whether an initial notification is available
    messaging().getInitialNotification().then(remoteMessage => { //앱이 꺼진 상태에서 FCM Notification을 클릭하여 앱이 기동할 때 클릭한 FCM정보를 얻는다.
      // console.log(" getInitialNotification : ", remoteMessage);
      if(Boolean(remoteMessage)) {
        // console.log(" getInitialNotification : ", remoteMessage);
        // 
        console.log('Message handled in the background!125');
        this.handleNotification(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => { //App Background상태에서 FCM을 받는 부분 
      console.log("fdsfds",remoteMessage.data.msgCnt)
      PushNotification.setApplicationIconBadgeNumber(Number(remoteMessage.data.msgCnt))
      this.setBottomBadge(remoteMessage);
    });
  }
  async setBottomBadge(remoteMessage) {
    if(remoteMessage.data && remoteMessage.data.path == "home" && myInfo.getData().id > 0){
      store.dispatch(badgeDisplay({cnt: 1}));
    }
    if(remoteMessage.data && remoteMessage.data.path == "matching" && myInfo.getData().id > 0){
      let rand_num = 0
      for (let i = 0; i < 3; i++) {
        rand_num += Math.floor(Math.random() * 10)
      }
      store.dispatch(badgeDisplay({s_cnt: rand_num}));
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {/* <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} /> */}
        <RootSwitch
          ref={navigatorRef => {
            setTopLevelNavigator(navigatorRef);
          }}
        />        
        <Popup />  
        {/* <Progress />        */}
      </View>
    );
  }
};

const ProviderApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default ProviderApp;