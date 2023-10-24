import {Platform, Dimensions, StatusBar} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

export const isIos = Platform.OS === 'ios';
export const screenHeight = 
  isIphoneX() ? Dimensions.get('window').height - 44 : 
  Platform.OS === 'ios' ? Dimensions.get('window').height - 20 : 
  Platform.OS === 'android' ? Dimensions.get('window').height - StatusBar.currentHeight :
  Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;
export const select = Platform.select;

const guidelineBaseWidth = 360; //411.42857142857144;
const guidelineBaseHeight = 780//722.57142857142857;

const guideScale = Math.sqrt(guidelineBaseWidth * guidelineBaseHeight)

const scale = Math.sqrt(screenWidth * screenHeight) / guideScale;
const horiPer = screenWidth / guidelineBaseWidth;
const vertiPer = screenHeight / guidelineBaseHeight;


const widthScale = size => horiPer * size;
const heightScale = size => vertiPer * size;
const moderateScale = size => scale * size;

export {moderateScale, widthScale, heightScale};
 
export const validationEmail = email => {
  return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

export const validationPhone = phone => {
  var regExp = /^\d{3}\d{4}\d{4}$/;

  if(regExp.test(phone))  
    return true;
  else
    return false;  
};

export const validationNickName = nickName => {
  // var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;
  var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]{2,12}$/;

  if(regExp.test(nickName))  
    return true;
  else
    return false;  
};

export const validationPassword = (password) => {
  if(password == null || password.length < 6 || password.length > 15)
    return false;
  var num = password.search(/[0-9]/g);
    
  var eng = password.search(/[a-zA-Z]/ig);
    
  var spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
  if(num < 0 || eng < 0 || spe < 0 ){ 
    return false;
  }
     
  return true;
};

export const numberWithCommas = (number) => {
  if(number != null)
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else
    return '';
};
export const uncomma = (str) => {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}
export const formatDateWeekday = (str_time) => {  
  if(str_time == "")
    return "";

  var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');

  let now_date = new Date(str_time);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  var week_index = now_date.getDay();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes(); 
  let gubun = '오전';
  if(hour > 11){
      gubun = '오후';
      if(hour > 12)
        hour = hour - 12;        
  }
  let t_hour = hour < 10 ? hour : hour;   
  let t_minute = minute < 10 ? '0'+minute : minute;  

  let returnStr = year+"년 "+t_month+"월 "+t_day+"일 "+week[week_index]+"" +" "+gubun+" "+t_hour+":"+t_minute;;
  
  return returnStr;
};
export const formatDateWeekday1 = (str_time) => {  
  if(str_time == "")
    return "";

  var week = new Array('(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)');

  let now_date = new Date(str_time);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  var week_index = now_date.getDay();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes(); 
  let gubun = '오전';
  if(hour > 11){
      gubun = '오후';
      if(hour > 12)
        hour = hour - 12;        
  }
  let t_hour = hour < 10 ? hour : hour;   
  let t_minute = minute < 10 ? '0'+minute : minute;  

  let returnStr =t_month+"월 "+t_day+"일 "+week[week_index]+"" +" "+gubun+" "+t_hour+":"+t_minute;;
  
  return returnStr;
};
export const formatDate = (str_date) => {  
  if(str_date == "" || str_date == undefined)
    return "";

  let now_date = new Date(str_date);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;   
  
  let returnStr = year+'.'+t_month+"."+t_day;
  
  return returnStr;
}; 
export const formatTime = (str_date) => {
  if(str_date == "" || str_date == undefined)
    return "";
    
  let now_date = new Date(str_date);
  let hour = now_date.getHours();
  let minute = now_date.getMinutes();
  let t_hour = hour < 10 ? '0'+hour : hour;
  let t_minute = minute < 10 ? '0'+minute : minute;  
  let returnStr = t_hour+":"+t_minute;  
   
  return returnStr;
};
export const formatDateTime = (str_time) => {  
  if(str_time == "")
    return "";
  let now_date = new Date(str_time);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  var week_index = now_date.getDay();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes(); 
 
  let t_hour = hour < 10 ? '0'+hour : hour;   
  let t_minute = minute < 10 ? '0'+minute : minute;  

  let returnStr = year+"."+t_month+"."+t_day+" "+t_hour+":"+t_minute;;
  
  return returnStr;
};
export const formatDateTimeSql = (str_time) => {  
  if(str_time == "")
    return "";
 
  let now_date = new Date(str_time);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  var week_index = now_date.getDay();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes(); 
   
  let t_hour = hour < 10 ? '0'+ hour : hour;   
  let t_minute = minute < 10 ? '0'+minute : minute;  

  let returnStr = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute;;
  
  return returnStr;
};
export const formatDateSql = (str_time) => {  
  if(str_time == "")
    return "";
 
  let now_date = new Date(str_time);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();  
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  var week_index = now_date.getDay();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes(); 
   
  let t_hour = hour < 10 ? '0'+ hour : hour;   
  let t_minute = minute < 10 ? '0'+minute : minute;  

  let returnStr = year+"-"+t_month+"-"+t_day;
  
  return returnStr;
};
export const profileImg = (img) => {
  if(img == "" || img == undefined)
    return "";
    
  var returnStr = ''
  returnStr = img.split(",")
  
  return returnStr[0];
};
export const getAge = (birthday) => {
  let today = new Date();
  let birthDay = new Date(birthday);
  let age = today.getFullYear() - birthDay.getFullYear();
  
  let todayMonth = today.getMonth() + 1;
  let birthMonth = birthDay.getMonth() + 1;
  
  if (birthMonth > todayMonth || (birthMonth === todayMonth && birthDay.getDate() >= today.getDate())) {
    age--;
  } 
  return age;
};
export const remaindTime = () => { 
  var now = new Date(); //현재시간을 구한다. 
  var open = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59);

  var nt = now.getTime(); // 현재의 시간만 가져온다
  var ot = open.getTime(); // 오픈시간만 가져온다

  if(nt<ot){ //현재시간이 오픈시간보다 이르면 오픈시간까지의 남은 시간을 구한다.   
   var  sec = parseInt(ot - nt) / 1000;
   var hour = parseInt(sec/60/60);
   sec = (sec - (hour*60*60));
   var min = parseInt(sec/60);
   sec = parseInt(sec-(min*60));

   if(hour<10){hour="0"+hour;}
   if(min<10){min="0"+min;}
   if(sec<10){sec="0"+sec;} 
    return hour+'시간 '+min+'분 '+sec+'초'
  } else{ //현재시간이 종료시간보다 크면
    return '1'
  }
}
export const compareDate = (str_date,cnt) => {
   
  if(str_date == "" || str_date == undefined)
    return false;
    
    var now_date1 = new Date(str_date); // st
    let now_date =  new Date(now_date1.setDate(now_date1.getDate() - Number(cnt) )); //ed
    
    var now_d = new Date(); // 현재일 
    console.log(now_date)
    if(now_d < now_date){
      return false
    }
  
    return true;
};
export const getAfterDateTime = (a_day) => {
  let now_date = new Date();
  now_date.setDate(now_date.getDate()+a_day);
  now_date.setHours(19);
  now_date.setMinutes(0);
  now_date.setSeconds(0);
  let year = now_date.getFullYear();
  let month = now_date.getMonth() + 1;
  let day = now_date.getDate();
  let hour = now_date.getHours();
  let minute = now_date.getMinutes();
  let second = now_date.getSeconds();
  let t_month = month < 10 ? '0'+month : month;
  let t_day = day < 10 ? '0'+day : day;
  let t_hour = hour < 10 ? '0'+hour : hour;
  let t_minute = minute < 10 ? '0'+minute : minute;
  let t_second = second < 10 ? '0'+second : second;
  let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
  return now_date;
};


