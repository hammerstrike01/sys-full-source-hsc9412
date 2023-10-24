import axios from 'axios';
import Config from '../Config';
import { myInfo } from '../redux/myInfo';
import {goBack,navigate} from './navigation';
import routes from './routes'; 

export const requestPatch = async (url, updateData) => {
  try {
    const response = await axios.patch(
      `${Config.HTTP_URL}${url}`,
      updateData,
    );
    const data = response.data;
    if (data.error) {
      throw data;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const requestFile = async (url, formData, callback) => {
  try {
    const response = await axios.post(`${Config.HTTP_URL}${url}`, formData, {headers: {     
      Accept: 'application/json', 
      'Content-Type': 'multipart/form-data',
      }});
    const data = response.data;
    if (data.errcode != 0) {
      console.log("requestFile("+url+") Data Err :", data);
      throw data;
    }
    callback(data.result);
  } catch (error) {
    console.log("requestFile("+url+") Err :", error);
    throw error;
  }
};

export const requestGet = async (url, callback) => {
  try {
    const response = await axios(`${url}`);
    const data = response.data;
    if (data.error) {
      throw data;
    }
    callback(data);
  } catch (error) {
    // callback(null);
    throw error;
  }
};

export const requestPost = async (url, body, callback) => { 
  try {
    console.log(111)
    const response = await axios.post(`${Config.HTTP_URL}${url}`, body, {headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': myInfo.getData().auth_token,
      'x-access-ost': myInfo.getData().id,
    }}); 
    if(response.headers["x-new-token"])  {
      myInfo.saveData('auth_token', response.headers["x-new-token"]);
    }
    const data = response.data;
    if(data.errcode == 101){ 
      myInfo.clearData();   
      navigate(routes.signIn) 
    }
    if (data.errcode != 0) {
      // console.log("requestPost("+url+") Data Err :", data);
      throw data;
    }
    callback(data.result,response.headers["x-new-token"]);
  } catch (error) {
    // console.log("requestPost("+url+") Err :", error); 
    throw "no";    
  }
};
export const requestUpload = async (url, formData, callback) => {
  try {
    const response = await axios.post(`${Config.HTTP_URL}${url}`, formData, {headers: {      
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': myInfo.getData().auth_token,
      'x-access-ost': myInfo.getData().id,
    }});
    const data = response.data;
    if (data.errcode != 0) {
      throw data;
    }
    callback(data.result);
  } catch (error) {    
    throw error;
  }
};
