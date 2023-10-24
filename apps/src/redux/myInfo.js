import AsyncStorage from '@react-native-async-storage/async-storage';
export class myInfo{
  static data = {
    id: 0, 
    login_type:"1",  //1:남성 2: 여성
    email:'', 
    auth_token:'',
    intropage:'',
    tempID:'',  
    push_id:'',
    nick_name:'',
    review:2,
    push_update:1,
  };
  constructor() {
    myInfo.readData();
  }
  static async initload() {
    await myInfo.readData();
  }; 
  static getData(){
    return myInfo.data;
  };
  
  static async readData(){
    try {
      AsyncStorage.getItem("staffsInfo", (err, value)=>{
        if (err == null) {
          if (value != null) {
            myInfo.data = JSON.parse(value);
          }            
        }
      });
    } catch (error) {
      // Error saving data
    }
  };
  
  static async saveData(field, value){
    try {
      if (field === 'id') {
        myInfo.data.id = value;
      }
      else if (field === 'login_type') {
        myInfo.data.login_type = value;
      }
      else if (field === 'email') {
        myInfo.data.email = value;
      }
      else if (field === 'auth_token') {
        myInfo.data.auth_token = value;
      }
      else if (field === 'tempID') {
        myInfo.data.tempID = value;
      }
      else if (field === 'intropage') {
        myInfo.data.intropage = value;
      } 
      else if (field === 'push_id') {
        myInfo.data.push_id = value;
      }
      else if (field === 'nick_name') {
        myInfo.data.nick_name = value;
      } 
      else if (field === 'review') {
        myInfo.data.review = value;
      } 
      else if (field === 'push_update') {
        myInfo.data.push_update = value;
      } 
      
      await AsyncStorage.setItem("staffsInfo", JSON.stringify(myInfo.data));
    } catch (error) {
      // Error saving data
    }
  };   

  static async clearData(){
    myInfo.data = {
      id: 0,   
      login_type:"1",  
      email:'',  
      auth_token:'', 
      push_id:myInfo.data.push_id,
      tempID:'',  //뱃지등록 임시아이디 
      nick_name:'',
      review:2,     
      push_update:1,           
    };
    try {
      await AsyncStorage.setItem("staffsInfo", JSON.stringify(myInfo.data));
    } catch (error) {
      // Error saving data
    }
  };
}
 