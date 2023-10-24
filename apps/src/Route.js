import React from 'react';
import {widthScale,moderateScale} from './libs/utils'; 
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import BottomTabTxt from './components/bottomtab-txt/BottomTabTxt'; 
import BottomTabIcon from './components/bottomtab-icon/BottomTabIcon';
import routes from './libs/routes';
import images from './libs/images';
import colors from './libs/colors';

import Splash from './screens/splash/Splash';
import Intro from './screens/home/Intro';
import Intro1 from './screens/home/Intro1';
import Intro2 from './screens/home/Intro2';
import Intro3 from './screens/home/Intro3';
import SignIn from './screens/sign/SignIn.js';
import SignIn1 from './screens/sign/SignIn1.js';
import FindPassword from './screens/sign/FindPassword.js';
import FindId from './screens/sign/FindId.js';
import CertEmail from './screens/sign/CertEmail.js';
import CreatePassword from './screens/sign/CreatePassword.js';
import Register from './screens/sign/Register.js';
import Invite from './screens/sign/Invite.js';
import CertPhone from './screens/sign/CertPhone.js';
import Register1 from './screens/sign/Register1.js';
import Register2 from './screens/sign/Register2.js';
import Register3 from './screens/sign/Register3.js';
import Register4 from './screens/sign/Register4.js';
import Register5 from './screens/sign/Register5.js';
import Register6 from './screens/sign/Register6.js';
import Register7 from './screens/sign/Register7.js';
import RegisterBadge from './screens/sign/RegisterBadge.js';
import BadgeDetail from './screens/sign/BadgeDetail.js';
import RegisterProfile from './screens/sign/RegisterProfile.js';
import RegisterJob from './screens/sign/RegisterJob.js';
import RegisterIntro from './screens/sign/RegisterIntro.js';
import RegisterMatching from './screens/sign/RegisterMatching.js';
import RegisterBeauti from './screens/sign/RegisterBeauti.js';
import CreateComplete from './screens/sign/CreateComplete.js';
import Review from './screens/sign/Review.js';
import ReviewReport from './screens/sign/ReviewReport.js';
import FavorAge from './screens/sign/FavorAge';
import FavorMeet from './screens/sign/FavorMeet';
import FavorUser from './screens/sign/FavorUser';
import FavorType from './screens/sign/FavorType';
import Home from './screens/home/Home';
import ProfileDetail from './screens/home/ProfileDetail';
import Agree1 from './screens/home/Agree1';
import Agree2 from './screens/home/Agree2';
import Managerchanel from './screens/home/Managerchanel'; 
import Alarm from './screens/alarm/Alarm';  
import Matching from './screens/Matching/Matching';
import MatchingMeeting from './screens/Matching/MatchingMeeting';
import ResetSchedule from './screens/Matching/ResetSchedule';
import Standby from './screens/Matching/Standby';
import Chatting from './screens/Matching/Chatting';
import MatchingAfter from './screens/Matching/MatchingAfter';
import Place from './screens/Matching/Place'; 
import Setting from './screens/my/Setting';
import Frend from './screens/my/Frend';
import My from './screens/my/My';
import Payment from './screens/my/Payment';
import MySetting from './screens/my/MySetting'; 
import StopIntro from './screens/my/StopIntro'; 



   
import Duplicate from './screens/sign/Duplicate.js';   


const TabBarComponent = props => <BottomTabBar {...props} />;

const Main = createBottomTabNavigator(
  {
    [routes.home]: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => <BottomTabTxt tintColor={tintColor} label={''} />,
        tabBarIcon: ({focused}) => <BottomTabIcon image={focused ? images.i1_on : images.i1_off} width={moderateScale(28)} />,
      },
    },
    [routes.matching]: {
      screen: Matching,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => <BottomTabTxt tintColor={tintColor} label={''} />,
        tabBarIcon: ({focused}) => <BottomTabIcon image={focused ? images.i2_on : images.i2_off} width={moderateScale(28)} />,        
      },
    }, 
    [routes.my]: {
      screen: My,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => <BottomTabTxt tintColor={tintColor} label={''} />,
        tabBarIcon: ({focused}) => <BottomTabIcon image={focused ? images.i3_on : images.i3_off} width={moderateScale(28)} />,
      },
    },
  },
  {  
    initialRouteName: routes.home,
    tabBarOptions: {      
      activeTintColor: colors.colorY,
      inactiveTintColor: colors.black,
      tabStyle: {
        backgroundColor: colors.white,        
      },
      style: {        
        height: moderateScale(65),
        bottom: 0,
        left: 0,
      },
    },
    tabBarComponent: props =>{
      return(
        <React.Fragment>          
          <TabBarComponent {...props} />          
        </React.Fragment>
      )
    }
  },
);

const MainStack = createStackNavigator(
  {    
    [routes.main]: Main,  
    [routes.intro]: Intro, 
    [routes.signIn]: SignIn,  
    [routes.signIn1]: SignIn1,  
    [routes.findPassword]: FindPassword,
    [routes.findId]: FindId,
    [routes.createPassword]: CreatePassword,
    [routes.certEmail]: CertEmail,
    [routes.register]: Register,
    [routes.invite]: Invite,
    [routes.certPhone]: CertPhone,
    [routes.register1]: Register1,
    [routes.register2]: Register2,
    [routes.register3]: Register3,
    [routes.register4]: Register4,
    [routes.register5]: Register5,
    [routes.register6]: Register6,
    [routes.register7]: Register7,
    [routes.registerBadge]: RegisterBadge,
    [routes.badgeDetail]: BadgeDetail,
    [routes.registerProfile]: RegisterProfile,
    [routes.registerJob]: RegisterJob,
    [routes.registerIntro]: RegisterIntro,
    [routes.registerMatching]: RegisterMatching,
    [routes.registerBeauti]: RegisterBeauti,
    [routes.createComplete]: CreateComplete, 
    [routes.review]: Review, 
    [routes.reviewReport]: ReviewReport, 
    [routes.favorType]: FavorType, 
    [routes.favorUser]: FavorUser, 
    [routes.favorAge]: FavorAge, 
    [routes.favorMeet]: FavorMeet, 
    [routes.profileDetail]: ProfileDetail, 
    [routes.agree1]: Agree1, 
    [routes.agree2]: Agree2, 
    [routes.alarm]: Alarm, 
    [routes.meeting]: MatchingMeeting,
    [routes.resetSchedule]: ResetSchedule,
    [routes.setting]: Setting,
    [routes.chatting]: Chatting,
    [routes.matchingAfter]: MatchingAfter,
    [routes.place]: Place, 
    [routes.standby]: Standby,
    [routes.frend]: Frend, 
    [routes.payment]: Payment,
    [routes.mySetting]: MySetting,
    [routes.stopIntro]: StopIntro,
    [routes.managerchanel]: Managerchanel,
    [routes.intro1]: Intro1,
    [routes.intro2]: Intro2,
    [routes.intro3]: Intro3,
    
    
    [routes.duplicate]: Duplicate,  
        
    
    
     
  },
  {
    initialRouteName: routes.main,
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

const RootSwitch = createSwitchNavigator(
  {
    [routes.splash]: Splash,    
    [routes.mainStack]: MainStack,
  },
  {
    initialRouteName: routes.splash,
  },
);

export default createAppContainer(RootSwitch);