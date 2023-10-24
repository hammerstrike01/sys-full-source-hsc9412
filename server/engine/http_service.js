var express = require("express");
var request = require("request");
var formidable = require("formidable");
var db = require("../utils/db");
var crypto = require("../utils/crypto");
const ejs = require('ejs');

var http = require("../utils/http");
var common = require("./common");
var configs = require("../configs");
var fcm = require("../utils/fcm");
var fs = require("fs");
var mv = require("mv");
const userMgr = require('./usermgr');
var app = express();
var config = null;
var async = require("async");
var path = require("path");
const aligosms = require("../utils/aligo_sms");
const authMiddleware = require('./auth/auth');
let jwt = require("jsonwebtoken"); 
app.set('view engine', 'ejs'); 
app.use(express.static('pages'))
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

//nice module
const bodyParser = require("body-parser");  // body-parser 모듈 추가
const exec = require("child_process").exec; // child_process 모듈 추가

var sSiteCode = "";
var sSitePW = "";
var sModulePath = "/var/www/html/nice_module/CPClient_64bit";
var niceSuccess = fs.readFileSync('../pages/nice_success.ejs', 'utf-8');
// var sModulePath = "D:\\Allproject\\h-club\\nice_webview\\CheckPlusSafe_JS_1\\module\\Window\\CPClient.exe";

var sAuthType = "";      	  //없으면 기본 선택화면, X: 공인인증서, M: 핸드폰, C: 카드
var sPopGubun 	= "N";			//Y : 취소버튼 있음 / N : 취소버튼 없음
var sCustomize 	= "";			  //없으면 기본 웹페이지 / Mobile : 모바일페이지
var sGender = "";      			// 없으면 기본 선택화면, 0: 여자, 1: 남자

var sReturnUrl = "";	// 성공시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
var sErrorUrl = "";	  	// 실패시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
////////


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: '',
    pass: '',
  },
});
//토큰생성
function getNewToken(email) {

  return jwt.sign({
      email: email,   // 토큰의 내용(payload)
  },
      configs.jwtObj().secret,    // 비밀 키
      {
          expiresIn: '1d'    // 유효 시간은 5분
      });
}

app.all("*", function (req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-access-ost"); 
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
}); 
function startScheduleten(){
  
}

exports.start = function (cfg) {
  config = cfg;
  app.listen(config.HTTP_PORT); 
  startScheduleten()
}; 
app.use('/auth', authMiddleware);
app.use('/auth', require('./auth'));


exports.GetValue = function (plaindata, key) {
  var arrData = plaindata.split(":");
  var value = "";
  for (i in arrData) {
    var item = arrData[i];
    if (item.indexOf(key) == 0) {
      var valLen = parseInt(item.replace(key, ""));
      arrData[i++];
      value = arrData[i].substr(0, valLen);
      break;
    }
  }
  return value;
}; 
app.get("/elb",(req,res)=>{
    res.status(200).send("Elb")
    console.log("/elb")
})
 
app.post("/checkEmail", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.checkEmail(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("checkEmail: " + err);
  });
});
app.post("/checkNickname", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.checkNickname(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("checkNickname: " + err);
  });
}); 
app.post("/getAddressSidoList", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getAddressSidoList(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAddressSidoList: " + err);
  });
}); 
app.post("/getAddressGugun", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getAddressGugun(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAddressGugun: " + err);
  });
});  
  
app.post('/insertTempBadge', function(req, res){	 
	var form = new formidable.IncomingForm();
	form.multiples = true;
    form.parse(req, function (err, fields, files) {        
      if(fields.img_list == ''){
        let reg_time = common.getCurrentTime();
        if(fields.oldImg){
          fields.img_list = fields.oldImg
        }
        db.insertTempBadge(fields, reg_time, function(result) {            
          if(result)
            http.send(res, 0, "ok", {result: result});
          else
            http.send(res, 0, "ok", {result: false});
        }); 
      }
      else{
          var image_name_arr = [];
          var image_arr = fields.img_list.split(':::');
          var cnt = 1;
          var filepath = configs.staffs_server().IMG_PATH;
          !fs.existsSync(filepath) && fs.mkdirSync(filepath);

          async.forEachOf(image_arr, (value, key, callback) => {
              var timestamp = parseInt(new Date().getTime()/1000);
              var img_name = 'post'+timestamp+'_'+cnt+'.jpg';
              
              var buff = Buffer.from(value, 'base64');
              fs.writeFile(filepath + "/" + img_name, buff, function (err) {
                  if(err == null) {
                      image_name_arr.push(img_name);
                      callback('');
                  }
                  else
                      callback('');
              });
              cnt++;                
            }, err => {
              if (err) 
                  console.error(err.message);	

              fields.img_list = image_name_arr.join();
              if(fields.oldImg){
                fields.img_list +=","
                fields.img_list +=fields.oldImg
              }
              let reg_time = common.getCurrentTime();
              db.insertTempBadge(fields, reg_time, function(result) {            
                  if(result)
                      http.send(res, 0, "ok", {result: result});
                  else
                      http.send(res, 0, "ok", {result: false});
              });
          });
      }         
	  });	
    form.on('error', function(err) {
		console.log('insertTempBadge: '+err);
	});
});
app.post("/getTempBadge", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getTempBadge(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getTempBadge: " + err);
  });
});  
app.post("/getTempBadgeCnt", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getTempBadgeCnt(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getTempBadgeCnt: " + err);
  });
}); 
app.post("/creatAccount", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    const {password} = fields;
    db.creatAccount(fields,reg_time, async (result) =>
		{
      if(result) {
        let encStr = await crypto.getBcryptHash(password);
        db.updatePassword(encStr, fields.email, function() {}); 
        db.insertInviteCode(fields.reg_code, function() {}); 
        http.send(res, 0, "ok", { result: result });
      } 
      else {
        http.send(res, 0, "ok", { result: false });
      }
    });
    
    // db.(fields, reg_time, function (result) {
    //   if(result) http.send(res, 0, "ok", {result: result});
    //   else http.send(res, 0, "ok", { result: false });
    // });
  });
  form.on("error", function (err) {
    console.log("creatAccount: " + err);
  });
}); 
app.post("/insertBadge", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.insertBadge(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertBadge: " + err);
  });
}); 
app.post("/updateBadge", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.updateBadge(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateBadge: " + err);
  });
}); 
app.post("/login", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    // db.login(fields, function (result) {
    //   http.send(res, 0, "ok", {result: result});  
    // });
    const {password} = fields;
    db.login(fields, async (result) =>
		{
      if(result) {        // user already exist
        // 
        let checkPass = await crypto.compareBcryptHash(password, result.password);
        console.log(password, result.password)
        if(checkPass) {
          http.send(res, 0, "ok", {result: result});
        }
        else {
          http.send(res, 0, "ok", {result: false});
        }
      } 
      else {
        http.send(res, 0, "ok", {result: false});
      }
    });
  });
  form.on("error", function (err) {
    console.log("login: " + err);
  });
});
app.post("/updateProfileAge", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.updateProfileAge(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateProfileAge: " + err);
  });
}); 
app.post("/insertPhoneList", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.insertPhoneList(fields, function (result) {
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertPhoneList: " + err);
  });
}); 
app.post("/sendCode", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    var email = fields.email; 
    
    let rand_num = ''
    for (let i = 0; i < 6; i++) {
      rand_num += Math.floor(Math.random() * 10)
    }
    transporter.sendMail({
      from: '"h-club"', // sender address
      to: email,//email , // list of receivers
      subject: "h-club 인증번호 안내입니다", // Subject line
      text: "h-club", // plain text body
      html: '<h3>h-club 인증번호</h3><p>'+rand_num+'</p>', // html body
    }).then(info => {
      console.log({info});  
      http.send(res, 0, "ok", { result: rand_num });
    }).catch(console.error);
  });
}); 
app.post("/updatePassword", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    
    // db.updatePassword(fields, function (result) {
    //   if (result) http.send(res, 0, "ok", { result: result });
    //   else http.send(res, 0, "ok", { result: false });
    // });
    
    const {password} = fields
    db.checkEmail(fields, async (result) =>
    {
      if(result) {
        let encStr = await crypto.getBcryptHash(password);
        db.updatePassword(encStr, result.email, function() {}); 
        http.send(res, 0, "ok", { result: true });
      } 
      else {
        http.send(res, 0, "ok", { result: false });
      }
    });

  });
  form.on("error", function (err) {
    console.log("updatePassword: " + err);
  });
});
app.post("/checkPhone", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) { 
    db.checkPhone(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("checkPhone: " + err);
  });
});
app.post('/sendSms', function(req, res){  
  var form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, function (err, fields, files) {        
     
    var phone = fields.phone;
    var rand_code = fields.authnum;// (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            
    var smsreq = {
        body : {
            receiver: phone,
            msg: "hclub 인증번호 : ["+rand_code+"] 를 입력해주세요."
        }
    };
    console.log("dddfff",phone,rand_code)
    aligosms.send(smsreq, (ret) => {
      console.log("ddd",ret)
        if(ret != null)
            http.send(res, 0, "ok", {result: rand_code});                            
        else
            http.send(res, 0, "ok", {result: 'fail'});
    });
      
  });
  // log any errors that occur
  form.on('error', function(err) {
      console.log('sendSMS: '+err);
  });
}); 
app.post('/getEmailByPhone', function(req, res){	
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  var url   = configs.staffs_server().API_URL;
  // var phone_num =  fields.phone;
  form.parse(req, function (err, fields, files) {
    db.checkPhone(fields, function (result) {
      var phone = fields.phone;
      var rand_code = result.email;// (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
              
      var smsreq = {
          body : {
              receiver: phone,
              msg: "hclub 아이디 찾기 : 회원님의 아이디는 ["+rand_code+"] 입니다."
          }
      };
      aligosms.send(smsreq, (ret) => {
        http.send(res, 0, "ok", {result: true});
      });
      // request(
      //   {
      //     method: "POST",
      //     uri: url+"/sendEmail",
      //     headers: { "content-Type": "multipart/form-data" },
      //     json: true,
      //     formData: {
      //       phone_num: phone_num,
      //       email: result.email
      //     },
      //   },
      //   function (error, response, html) { 
      //     var result = response.body;  
      //     http.send(res, 0, "ok", { result: result });
      //   }
      // ); 
    }); 
  });
});
app.post("/getUserData", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getUserData(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getUserData: " + err);
  });
}); 
app.post("/updateUserData", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.updateUserData(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateUserData: " + err);
  });
}); 
app.post("/getUserProfile", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getUserProfile(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getUserProfile: " + err);
  });
}); 
app.post("/updateUserStatus", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.updateUserStatus(fields, reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateUserStatus: " + err);
  });
}); 
app.post("/logout", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.logout(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("logout: " + err);
  });
}); 
app.post("/updateIntorStatus", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.updateIntorStatus(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateIntorStatus: " + err);
  });
}); 
app.post("/getIntorStatus", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getIntorStatus(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getIntorStatus: " + err);
  });
}); 
app.post("/getPaymentList", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getPaymentList(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getPaymentList: " + err);
  });
}); 
app.post("/insertPayment", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.insertPayment(fields, reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertPayment: " + err);
  });
}); 
app.post("/getMyIdealType", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getMyIdealType(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyIdealType: " + err);
  });
}); 
app.post("/updateProfile", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.updateProfile(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateProfile: " + err);
  });
}); 
app.post("/getMyStatus", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getMyStatus(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyStatus: " + err);
  });
}); 
app.post("/getProfileById", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getProfileById(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getProfileById: " + err);
  });
}); 
app.post("/getBadbeInfo", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getBadbeInfo(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getBadbeInfo: " + err);
  });
}); 
app.post("/getMyCards", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getMyCards(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyCards: " + err);
  });
}); 
app.post("/updateMatchingStatus", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.updateMatchingStatus(fields,reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateMatchingStatus: " + err);
  });
}); 
app.post("/getMyMatchingList", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getMyMatchingList(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyMatchingList: " + err);
  });
}); 
app.post("/getMatchingMeetDate", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getMatchingMeetDate(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMatchingMeetDate: " + err);
  });
});
app.post("/updateMachingDate", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.updateMachingDate(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateMachingDate: " + err);
  });
});
app.post("/exitMatching", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.exitMatching(fields,reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("exitMatching: " + err);
  });
}); 
app.post("/updateMatchingFavor", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.updateMatchingFavor(fields,reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateMatchingFavor: " + err);
  });
}); 
app.post("/checkAfter", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {  
    db.checkAfter(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("checkAfter: " + err);
  });
}); 
app.post("/insertAfter", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true; 
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {  
    db.insertAfter(fields, reg_time, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertAfter: " + err);
  });
}); 
app.post("/getAfter", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {  
    db.getAfter(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAfter: " + err);
  });
});
app.post("/getPushCnt", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {  
    db.getPushCnt(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getPushCnt: " + err);
  });
});

app.post("/updateMeetingDate", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  console.log(12)
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {  
    db.updateMeetingDate(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateMeetingDate: " + err);
  });
});
app.post("/updatePushId", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.updatePushId(fields,reg_time, function (result) { 
      if(fields.nickname){
        var message = fields.nickname+'님의 가입신청이 완료되었으며 승인을 기다리는 중입니다.'
        fcm.sendMessage(fields.pushId, "앱이름 가입신청 완료", message, {msgCnt: 0,path:""});
      }
      if(result) http.send(res, 0, "ok", {result: result});
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updatePushId: " + err);
  });
});
app.get('/fcmPush', function(req, res){	  
  console.log("userInfofds")
	db.getUserInfo(req.query.id, function(userInfo) {
    console.log("userInfo",userInfo)
		if(userInfo && userInfo.push_id != ""&& userInfo.push_id != null) { 	  
      fcm.sendMessage(userInfo.push_id, req.query.title, req.query.content, {msgCnt: 0,path:req.query.path,memo:req.query.memo});
      if(req.query.type==2){
        db.updatePushCnt(req.query.id, function (result) {
          http.send(res, 0, "ok");
        });
      }
      else{
        http.send(res, 0, "ok");
      }
      
		}
    else http.send(res, 0, "ok");
	}); 
});
app.post('/sendFcm', function(req, res){	
  
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) { 
      db.getUserInfo(fields.id, function(userInfo) { 
        console.log("userInfo:",userInfo)
        if(userInfo && userInfo.push_id != ""&& userInfo.push_id != null) { 
          
          var content = fields.content.split("n");
          var cc = ''
          var fcm_cc = ''
          if(content.length>0)
        	for( var i=0; i<content.length ; i++ ){
            cc+= content[i]+"\\"+"\\"+"n";
            fcm_cc+=content[i]+"\n";
          }
          cc = cc.slice(0,-1)
          cc = cc.slice(0,-1)
          cc = cc.slice(0,-1)

          fcm.sendMessage(userInfo.push_id, fields.title, fcm_cc, {msgCnt: userInfo.push_cnt+1, path:fields.path});
          db.updatePushCntAlarm(fields.id,fields.title, cc,reg_time,fields.path, function (result) {
            http.send(res, 0, "ok", { result: false });
          });
        }
        else http.send(res, 0, "ok", { result: false });
      });
  });
  form.on("error", function (err) {
    console.log("updatePushId: " + err);
  }); 
});
app.post('/tempSendFcm', function(req, res){	 // 예약발송하기
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  
  form.parse(req, function (err, fields, files) { 
    db.insertFCM(fields,reg_time, function(result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updatePushId: " + err);
  }); 
});

app.post("/checkplus_main", function(request, response) { 
	var d = new Date();
	var sCPRequest = sSiteCode + "_" + d.getTime(); 
	var sPlaincData = ""; 
	var sEncData = ""; 
	var sRtnMSG = ""; 
  
	sPlaincData = "7:REQ_SEQ" + sCPRequest.length + ":" + sCPRequest +
				"8:SITECODE" + sSiteCode.length + ":" + sSiteCode +
				"9:AUTH_TYPE" + sAuthType.length + ":" + sAuthType +
				"7:RTN_URL" + sReturnUrl.length + ":" + sReturnUrl +
				"7:ERR_URL" + sErrorUrl.length + ":" + sErrorUrl +
				"11:POPUP_GUBUN" + sPopGubun.length + ":" + sPopGubun +
				"9:CUSTOMIZE" + sCustomize.length + ":" + sCustomize +
				"6:GENDER" + sGender.length + ":" + sGender ;  
	var cmd = sModulePath + " " + "ENC" + " " + sSiteCode + " " + sSitePW + " " + sPlaincData;
  
	var child = exec(cmd , {encoding: "euc-kr"});
	child.stdout.on("data", function(data) {
		
		sEncData += data;
	});
	child.on("close", function() { 
		if (sEncData == "-1"){
		sRtnMSG = "암/복호화 시스템 오류입니다.";
		}
		else if (sEncData == "-2"){
		sRtnMSG = "암호화 처리 오류입니다.";
		}
		else if (sEncData == "-3"){
		sRtnMSG = "암호화 데이터 오류 입니다.";
		}
		else if (sEncData == "-9"){
		sRtnMSG = "입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.";
		}
		else{
		sRtnMSG = "";
		}
		http.send(response, 0, "ok", {result:sEncData});
	});
});
app.use(bodyParser.urlencoded({extended: true}));
app.get("/nice_success", function(req, res) {
  //chrome80 이상 대응   
  var sEncData = req.query.EncodeData;
  var cmd = "";
  if(/^0-9a-zA-Z+\/=/.test(sEncData) == true){
      sRtnMSG = "입력값 오류";
      requestnumber = "";
      authtype = "";
      errcode = "";
      

      
      //  
    // var render = ejs.render(niceFail, {sRtnMSG, requestnumber, authtype, errcode});
    // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    // res.write(render);
    // res.end();


    res.header("Content-Type", "text/html;charset=utf-8"); 
    res.render('../pages/postcode', { EncodeData: 1});
    return;
  }
  
  if(sEncData != "")
    cmd = sModulePath + " " + "DEC" + " " + sSiteCode + " " + sSitePW + " " + sEncData;
  
  var sDecData = "";
  
  var child = exec(cmd , {encoding: "euc-kr"});
  child.stdout.on("data", function(data) {
      sDecData += data;
  });
  child.on("close", function() {
      //처리 결과 메시지
    var sRtnMSG = "";   
    var name = "";
    var birthdate = "00000000";
    var gender = 0;
    var mobileno = 0;
    // var name = "테스트";
    // var birthdate = "19990203";
    // var gender = 1;
    // var mobileno = '01012345678';
      //처리 결과 확인
 
      if (sDecData == "-1")
      sRtnMSG = "암/복호화 시스템 오류";   
      else if (sDecData == "-4")
      sRtnMSG = "복호화 처리 오류";    
      else if (sDecData == "-5")
      sRtnMSG = "HASH값 불일치 - 복호화 데이터는 리턴됨";   
      else if (sDecData == "-6")
      sRtnMSG = "복호화 데이터 오류";     
      else if (sDecData == "-9")
      sRtnMSG = "입력값 오류";   
      else if (sDecData == "-12")
      sRtnMSG = "사이트 비밀번호 오류";    
      else{ 
      //항목의 설명은 개발 가이드를 참조
      // var requestnumber = decodeURIComponent(GetValue(sDecData , "REQ_SEQ"));     //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
      // var responsenumber = decodeURIComponent(GetValue(sDecData , "RES_SEQ"));    //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
      // var authtype = decodeURIComponent(GetValue(sDecData , "AUTH_TYPE"));        //인증수단
      name = decodeURIComponent(exports.GetValue(sDecData , "UTF8_NAME")); 
                      //이름
      birthdate = decodeURIComponent(exports.GetValue(sDecData , "BIRTHDATE"));       //생년월일(YYYYMMDD)
      gender = decodeURIComponent(exports.GetValue(sDecData , "GENDER"));             //성별(0: Female, 1: Male)
      var nationalinfo = decodeURIComponent(exports.GetValue(sDecData , "NATIONALINFO")); //내.외국인정보
      var dupinfo = decodeURIComponent(exports.GetValue(sDecData , "DI"));                //중복가입값(64byte)
      var conninfo = decodeURIComponent(exports.GetValue(sDecData , "CI"));               //연계정보 확인값(88byte)
      mobileno = decodeURIComponent(exports.GetValue(sDecData , "MOBILE_NO"));        //휴대폰번호(계약된 경우)
      var mobileco = decodeURIComponent(exports.GetValue(sDecData , "MOBILE_CO"));        //통신사(계약된 경우)
      }
    
      var render = ejs.render(niceSuccess, { name, birthdate, gender,mobileno, });
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(render);
    res.end();
    // res.header("Content-Type", "text/html;charset=utf-8"); 

    // console.log("checkplus_success:::",mobileno,name,gender);

    // res.render('../pages/nice_success', { name: name,birthdate:birthdate,gender:gender,mobileno:mobileno});
  });  
});
app.get("/checkplus_success", function(request, response) { 
	var form = new formidable.IncomingForm();
	form.multiples = true;   
    form.parse(request, function (err, fields, files) {	
		var sEncData = fields.EncodeData; 
		var cmd = ""; 
		if( /^0-9a-zA-Z+\/=/.test(sEncData) == true){
			sRtnMSG = "입력값 오류";
			requestnumber = "";
			authtype = "";
			errcode = ""; 
		} 
		if(sEncData != "")
		{
			cmd = sModulePath + " " + "DEC" + " " + sSiteCode + " " + sSitePW + " " + sEncData;
		}   
		var sDecData = ""; 
		var child = exec(cmd , {encoding: "euc-kr"});
		child.stdout.on("data", function(data) {
			sDecData += data;
		});
		child.on("close", function() {  
			var sRtnMSG = "";  
			if (sDecData == "-1")
				sRtnMSG = "암/복호화 시스템 오류"; 
			else if (sDecData == "-4")
				sRtnMSG = "복호화 처리 오류";
			else if (sDecData == "-5")
				sRtnMSG = "HASH값 불일치 - 복호화 데이터는 리턴됨";
			else if (sDecData == "-6")
				sRtnMSG = "복호화 데이터 오류";		
			else if (sDecData == "-9")
				sRtnMSG = "입력값 오류";		
			else if (sDecData == "-12")
				sRtnMSG = "사이트 비밀번호 오류";
			
			else
			{

				var requestnumber = decodeURIComponent(exports.GetValue(sDecData , "REQ_SEQ"));     //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
				var responsenumber = decodeURIComponent(exports.GetValue(sDecData , "RES_SEQ"));    //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
				var authtype = decodeURIComponent(exports.GetValue(sDecData , "AUTH_TYPE"));        //인증수단
				var name = decodeURIComponent(exports.GetValue(sDecData , "UTF8_NAME"));            //이름
				var nationalinfo = decodeURIComponent(exports.GetValue(sDecData , "NATIONALINFO")); //내.외국인정보
				var dupinfo = decodeURIComponent(exports.GetValue(sDecData , "DI"));                //중복가입값(64byte)
				var conninfo = decodeURIComponent(exports.GetValue(sDecData , "CI"));               //연계정보 확인값(88byte)
				var mobileno = decodeURIComponent(exports.GetValue(sDecData , "MOBILE_NO"));        //휴대폰번호(계약된 경우)
				var mobileco = decodeURIComponent(exports.GetValue(sDecData , "MOBILE_CO"));        //통신사(계약된 경우)

        
        var birthdate = decodeURIComponent(GetValue(sDecData , "BIRTHDATE"));       //생년월일(YYYYMMDD)
        var gender = decodeURIComponent(GetValue(sDecData , "GENDER"));             //성별(0: Female, 1: Male)

			}  
      
				// http.send(response, 0, "ok", {sRtnMSG , requestnumber , responsenumber , authtype , name ,  nationalinfo , dupinfo , conninfo , mobileno , mobileco});
        response.header("Content-Type", "text/html;charset=utf-8"); 
 
        response.render('../pages/postcode', { name: name,birthdate:birthdate,gender:gender,mobileno:mobileno});

		});
	});	
});
app.get("/checkplus_fail", function(request, response) { 
	var sEncData = request.body.EncodeData;
	var cmd = ""; 
	if( /^0-9a-zA-Z+\/=/.test(sEncData) == true){
	  sRtnMSG = "입력값 오류";
	  requestnumber = "";
	  authtype = "";
	  errcode = "";
	  response.render("checkplus_fail.ejs", {sRtnMSG , requestnumber , authtype , errcode});
	} 
	if(sEncData != "")
	{
	   cmd = sModulePath + " " + "DEC" + " " + sSiteCode + " " + sSitePW + " " + sEncData;
	} 
	var sDecData = ""; 
	var child = exec(cmd , {encoding: "euc-kr"});
	child.stdout.on("data", function(data) {
	  sDecData += data;
	});
	child.on("close", function() { 
	  var sRtnMSG = ""; 
	  if (sDecData == "-1"){
		sRtnMSG = "암/복호화 시스템 오류";
	  }
	  else if (sDecData == "-4"){
		sRtnMSG = "복호화 처리 오류";
	  }
	  else if (sDecData == "-5"){
		sRtnMSG = "HASH값 불일치 - 복호화 데이터는 리턴됨";
	  }
	  else if (sDecData == "-6"){
		sRtnMSG = "복호화 데이터 오류";
	  }
	  else if (sDecData == "-9"){
		sRtnMSG = "입력값 오류";
	  }
	  else if (sDecData == "-12"){
		sRtnMSG = "사이트 비밀번호 오류";
	  }
	  else
	  { 
		var requestnumber = decodeURIComponent(GetValue(sDecData , "REQ_SEQ"));     //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
		var authtype = decodeURIComponent(GetValue(sDecData , "AUTH_TYPE"));        //인증수단
		var errcode = decodeURIComponent(GetValue(sDecData , "ERR_CODE"));          //본인인증 실패 코드
	  }
	  http.send(response, 0, "ok", {sRtnMSG , requestnumber , authtype , errcode}); 
	});
}); 

app.get('/checkplus_success_page', function (req, res) {
  res.header("Content-Type", "text/html;charset=utf-8"); 
  res.render('../pages/postcode', { EncodeData: req.query.EncodeData});
});
app.get('/checkplus_fail_page', function (req, res) {
  res.header("Content-Type", "text/html;charset=utf-8"); 
  res.render('../pages/postcode', { EncodeData: 1});
});
app.post("/getAlarmList", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.getAlarmList(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAlarmList: " + err);
  });
}); 
app.post("/deleteAlarmById", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.deleteAlarmById(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteAlarmById: " + err);
  });
}); 
app.post("/deleteAlarmAll", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  form.parse(req, function (err, fields, files) {  
    db.deleteAlarmAll(fields, function (result) {
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteAlarmAll: " + err);
  });
}); 








 















app.post("/registerAcount", function (req, res) { 
  var form = new formidable.IncomingForm(); 
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) { 
    db.registerAcount(fields, reg_time, function (result) {
      // if (result) http.send(res, 0, "ok", { result: result });
      // else http.send(res, 0, "ok", { result: false });
      if(result==false){
        http.send(res, 0, "ok", { result: result });
      }
      else{
        var timestamp = parseInt(new Date().getTime()/1000);
        var newToken = getNewToken(result + timestamp);
        db.updateToken(result, newToken,function(result1) { 
          res.setHeader('x-new-token', newToken);
          http.send(res, 0, "ok", {result: result});
        }); 
      } 
    });
  });
  form.on("error", function (err) {
    console.log("registerAcount: " + err);
  });
});
 

app.get('/postcode', function (req, res) {
  console.log("testtest")
  res.header("Content-Type", "text/html;charset=utf-8");
  var defQ = req.query.defQ;
  res.render('../pages/postcode', { defaultQ: defQ });
}); 
// app.post('/upload_chat_file', function(req, res) {
//   console.log("fileupload:")
// 	var form = new formidable.IncomingForm();
// 	form.multiples = true;
//     form.parse(req, function(err, fields, files) {		
// 		fields.mime = files.file.mimetype; 
//     fields.fileName = files.file.originalFilename;
    
// 		fields.content = 'chat' + parseInt(new Date().getTime()/1000) + '.' + files.file.originalFilename.split('.').pop();

// 		var filepath = config.IMG_PATH;
//     console.log('filepath:',filepath)
// 		!fs.existsSync(filepath) && fs.mkdirSync(filepath);

// 		var oldpath = files.file.filepath;
//       	var newpath = filepath + '/' + fields.content;
		
// 		mv(oldpath, newpath, function(err) {		
//         	db.addChatMsg(fields, function(result) {
// 				http.send(res, 0, "ok", {result: true});
// 				userMgr.roomSendMsg(fields.roomId, 'receive_new_msg', result);				
// 			});
//       	});
// 	});	
//     form.on('error', function(err) {
// 		console.log('upload_chat_file: '+err);
// 	});
// });

app.post('/upload_chat_file', function(req, res){
	var form = new formidable.IncomingForm();
	form.multiples = true;
    form.parse(req, function (err, fields, files) {
		var filepath = config.IMG_PATH;
		!fs.existsSync(filepath) && fs.mkdirSync(filepath); 
				
		fields.content = 'chat' + parseInt(new Date().getTime()/1000) + '.' + fields.fileName.split('.').pop();

		var buff = Buffer.from(fields.file, 'base64');
		fs.writeFile(filepath + "/" + fields.content, buff, function (err) {
			if(err == null) {					
				db.addChatMsg(fields, function(result) {
					http.send(res, 0, "ok", {result: true});
					userMgr.roomSendMsg(fields.roomId, 'receive_new_msg', result);				
				});
			}
			else
				http.send(res, 0, "ok", {result: false});
		});
	});	
    form.on('error', function(err) {
		console.log('upload_chat_file: '+err);
	});
});
app.post('/del_chat_msg', function(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = true;
    form.parse(req, function (err, fields, files) {
		db.delChatMsg(fields.id,fields.roomId, function(result) {            
			http.send(res, 0, "ok", {result: result});			
        });
	});	
    form.on('error', function(err) {
		console.log('del_chat_msg: '+err);
	});
});

app.post('/get_chat_room_list', function(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = true;
    form.parse(req, function (err, fields, files) {
		db.getChatRoomList(fields, function(result) {            
			http.send(res, 0, "ok", {result: result});			
        });
	});	
    form.on('error', function(err) {
		console.log('get_chat_room_list: '+err);
	});
});



















app.get('/push_test', function(req, res){
	let push_id = "eRZ2a337TUOwSGjdQD1hQY:APA91bGnnCz1oHLpRQKMiBWPQzuKKTm3jDv7p99pBSbwLOXrr0BgZxq2AaUK0iVAL-uc3Pt4_DYg0mrfnyA0rkRoG2lZDJ9EnKea1VRlhHsRQ8h4qEw5ruJZ3w_6L8zgcaaVVfGGeJP_";
  fcm.sendMessage(push_id, "알림", "테스트\ntest<br/>test", {msgCnt: 15});
  console.log(15);
	http.send(res, 0, "ok", true);
});
 
/// fileupload
app.post('/insertCommunity', function(req, res){	
	var form = new formidable.IncomingForm();
	form.multiples = true;
    form.parse(req, function (err, fields, files) {        
        if(fields.img_list == ''){
            let reg_time = common.getCurrentTime();
            db.insertCommunity(fields, reg_time, function(result) {            
                if(result)
                    http.send(res, 0, "ok", {result: result});
                else
                    http.send(res, 0, "ok", {result: false});
            });
        }
        else{
            var image_name_arr = [];
            var image_arr = fields.img_list.split(':::');		
            var cnt = 1;
            // var filepath = '/home/ubuntu/html/rcroom_admin/upload/';
            var filepath = configs.staffs_server().IMG_PATH;
            // var filepath = 'D:/xampp/htdocs/rcroom_admin/upload/';
            !fs.existsSync(filepath) && fs.mkdirSync(filepath); 

            async.forEachOf(image_arr, (value, key, callback) => {
                var timestamp = parseInt(new Date().getTime()/1000);
                var img_name = 'post'+timestamp+'_'+cnt+'.jpg';
                
                var buff = Buffer.from(value, 'base64');
                fs.writeFile(filepath + "/" + img_name, buff, function (err) {
                    if(err == null) {
                        image_name_arr.push(img_name);
                        callback('');
                    }
                    else
                        callback('');
                });
                cnt++;                
              }, err => {
                if (err) 
                    console.error(err.message);	

                fields.img_list = image_name_arr.join();
                let reg_time = common.getCurrentTime();
                db.insertCommunity(fields, reg_time, function(result) {            
                    if(result)
                        http.send(res, 0, "ok", {result: result});
                    else
                        http.send(res, 0, "ok", {result: false});
                });
            });
        }         
	});	
    form.on('error', function(err) {
		console.log('insertCommunity: '+err);
	});
});
 
 