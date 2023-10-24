var mysql = require("mysql");
var fcm = require("./fcm");
var async = require("async");
var crypto = require("./crypto");
var conf = null;
var pool = null;

function nop(a, b, c, d, e, f, g) {}

function queryParams(sql, params, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, params, function (qerr, vals, fields) {
        conn.release();
        callback(qerr, vals, fields);
      });
    }
  });
}
function query(sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, function (qerr, vals, fields) {
        conn.release();
        callback(qerr, vals, fields);
      });
    }
  });
}
// 
exports.init = function (config) {
  pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PSWD,
    database: config.DB,
    port: config.PORT,
  });
  conf = config;
};

exports.multi_query = function (sqlList, cnt, callback) {
  callback = callback == null ? nop : callback;

  var connection = mysql.createConnection({
    host: conf.HOST,
    user: conf.USER,
    password: conf.PSWD,
    database: conf.DB,
    port: conf.PORT,
    multipleStatements: true,
  });
  connection.connect();

  connection.query(sqlList, [1, cnt], function (error, results, fields) {
    if (error) {
      callback(null);
      throw error;
    } else {
      if (results.length > 0) callback(results);
      else callback(0);
    }
  });
  connection.end();
};

//// -----------채팅부분------------////

exports.getChatListByRoomId = function(roomId, callback) {
  callback = callback == null? nop:callback; 
  if(roomId == null) {
      callback(false);
      return;
  } 
  var sql = 'SELECT H.*, U.user_name, U.m_profile  FROM chat_history AS H LEFT JOIN users AS U ON H.user_id=U.id';    
  sql += ' WHERE H.room_id="'+roomId+'" ORDER BY H.id ASC'; 
  query(sql, function(err, rows, fields) {
      if (err) {
          callback(false);
          throw err;
      } else {
          if (rows.length == 0)
              callback(false);            
          else
              callback(rows);
      }
  }); 
};

exports.addChatMsg = function(data, callback) {
  callback = callback == null? nop:callback;
  
  if(data == null) {
      callback(false);
      return;
  }
  
  var sql = '';
 
  sql = 'INSERT INTO chat_history(room_id, user_id, type, content, reg_time)';
  sql += ' VALUES("'+data.roomId+'","'+data.userId+'","'+data.type+'","'+data.content+'",NOW())';
   
  query(sql, function(err, rows, fields) {
    if (err) {
      if (err.code == 'ER_DUP_ENTRY') {
          callback(false);
          return;         
      }
      callback(false);
      throw err;
    } else {            
      sql = 'SELECT H.*, U.user_name, U.gender FROM chat_history AS H LEFT JOIN users AS U ON H.user_id=U.id';    
      sql += ' WHERE H.id="'+rows.insertId+'"';

      query(sql, function(err, rows1, fields) {
          if (err) {
              callback(false);
              throw err;
          } else {
              if (rows1.length == 0)
                  callback(false);            
              else {
                  callback(rows1[0]); 
              }                        
          }
      }); 
    }
  });
};

exports.delChatMsg = function(id,room_id, callback){ 
  callback = callback == null? nop:callback;

  if(id == null) {
      callback(false);
      return;
  }
  // 마지막 채팅인지 확인하고 마지막 채팅이면 이전채팅이력을 채팅방에 등록해준다 
  var sql = 'DELETE FROM chat_history WHERE id="'+id+'"'; 
  query(sql, function(err, rows, fields) {
    if (err) {
        callback(false);
        throw err;
    }
    callback(true);
  }); 
};

exports.readChatHistory = function(roomId, userId, callback){  
  callback = callback == null? nop:callback;

  if(roomId == null || userId == null)
      return; 
  var sql = 'UPDATE chat_history SET `read` = 1 WHERE room_id="'+roomId+'" AND user_id="'+userId+'"'; 
  query(sql, function(err, rows, fields) {
      if (err) {
          callback(false);
          throw err;
      }
      else {
          callback(true);
      }
  }); 
};

exports.getChatRoomList = function(data, callback) {
  callback = callback == null? nop:callback;

  if(data == null) {
      callback(false);
      return;
  }
  var sql = 'UPDATE users SET chatting_id = "0" where id = "'+data.user_id+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) {
        callback(false);
        throw err;
    } else {
      if(data.type==1){ // 개인회원의 경우 채팅내용이 없으면 노출안하도록
        var sql = 'SELECT T.*,';
        sql += ' (SELECT COUNT(*) FROM chat_history WHERE room_id=T.id AND user_id<>"'+data.user_id+'" AND `read`=0) AS no_read_cnt';
        sql += ' FROM';
        sql += ' (SELECT R.*,E.title, U.business_name, U.type as user_type, U.user_name,U.profile,U.age,U.gender, U.id AS o_user_id';
        sql += ' FROM chat_room AS R LEFT JOIN recruitment AS E on E.id = R.recruitment_id LEFT JOIN users AS U ON R.user_id2=U.id WHERE (R.type=2 or (R.type=1 and !ISNULL(last_content)) ) and R.user_id1="'+data.user_id+'" and R.status !="'+data.user_id+'" and U.user_state=1 ';
        sql += ' UNION';
        sql += ' SELECT R.*, E.title, U.business_name, U.type as user_type, U.user_name,U.profile,U.age,U.gender, U.id AS o_user_id';    
        sql += ' FROM chat_room AS R LEFT JOIN recruitment AS E on E.id = R.recruitment_id LEFT JOIN users AS U ON R.user_id1=U.id WHERE (R.type=2 or (R.type=1 and !ISNULL(last_content)) ) and R.user_id2="'+data.user_id+'" and R.status !="'+data.user_id+'" and U.user_state=1 ) AS T';
        sql += ' ORDER BY T.last_time DESC';
      
      }
      else{
        var sql = 'SELECT T.*,';
        sql += ' (SELECT COUNT(*) FROM chat_history WHERE room_id=T.id AND user_id<>"'+data.user_id+'" AND `read`=0) AS no_read_cnt';
        sql += ' FROM';
        sql += ' (SELECT R.*,E.title, U.business_name, U.type as user_type, U.user_name,U.profile,U.age,U.gender, U.id AS o_user_id';
        sql += ' FROM chat_room AS R LEFT JOIN recruitment AS E on E.id = R.recruitment_id LEFT JOIN users AS U ON R.user_id2=U.id WHERE R.user_id1="'+data.user_id+'" and R.status !="'+data.user_id+'" and U.user_state=1 ';
        sql += ' UNION';
        sql += ' SELECT R.*, E.title, U.business_name, U.type as user_type, U.user_name,U.profile,U.age,U.gender, U.id AS o_user_id';    
        sql += ' FROM chat_room AS R LEFT JOIN recruitment AS E on E.id = R.recruitment_id LEFT JOIN users AS U ON R.user_id1=U.id WHERE R.user_id2="'+data.user_id+'" and R.status !="'+data.user_id+'" and U.user_state=1 ) AS T';
        sql += ' ORDER BY T.last_time DESC';
      
      }
      
      query(sql, function(err, rows, fields) {
          if (err) {
              callback(false);
              throw err;
          } else {
              if (rows.length == 0)
                  callback(false);            
              else
                  callback(rows);
          }
      }); 
    }
  }); 
  
};

//// -----------채팅부분 end------------////




exports.updateToken = function(id, token, callback)
{
    callback = callback == null? nop:callback; 
    var sql = 'DELETE FROM auth_token WHERE user_id = "' + id + '";';
    sql += 'INSERT INTO auth_token(user_id, auth_token) VALUES("' + id + '", "' + token + '");';

    exports.multi_query(sql, 2, function(err, rows, fields) {
        if (err) {
            callback(false);
            return ;
        }
        callback(true);
    }); 
}; 
exports.checkToken = function(user_id, token, callback)
{
    callback = callback == null? nop:callback;
    var sql = 'SELECT usr.id, usr.email as user_id, usr.user_name as user_name FROM auth_token as auth JOIN users as usr ON auth.user_id = usr.id WHERE auth.auth_token="'+token+'" AND auth.user_id="'+user_id+'"';
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(null);
            return ;
            // throw err;
        }
        if(rows.length == 0){ 
            callback(null);
            return;
        }
        callback(rows[0]);
    }); 
};
exports.checkEmail = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id, email from users where email="'+data.email+'"';  
  console.log(sql) 
  query(sql, function(err, rows, fields) {
      if (err) { 
        console.log(err) 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.checkNickname = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT nick_name from users where nick_name="'+data.nickname+'"';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getAddressSidoList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from address_si ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getAddressGugun = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT *, (select short_name from address_si where id =address_gu.sido_id ) as sido_name from address_gu where sido_id = "'+data.id+'"';    
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.insertTempBadge = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  // 이전기록 삭제하기
  var sql = 'delete from temp_badge where type = "'+data.type+'" and tempId = "'+data.id+'" ';   
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    if(data.img_list){
      var sql = 'INSERT INTO temp_badge(tempId,img,type, crt_date)VALUES("'+data.id+'","'+data.img_list+'","'+data.type+'","'+crt_date+'")'; 
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(data.img_list);
      });
    }
    else{
      callback(true);
    }
    
  });  
};
exports.getTempBadge = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type)
  var sql = 'SELECT * from temp_badge where tempId="'+data.id+'" and type = "'+data.type+'" ';   
  else
  var sql = 'SELECT * from temp_badge where tempId="'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      if(data.type)
      callback(rows[0]);
      else
      callback(rows);
  }); 
};
exports.getTempBadgeCnt = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id) as cnt from temp_badge where tempId="'+data.id+'" ';
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.creatAccount = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  // 이전기록 삭제하기
  var sql = 'INSERT INTO users(push_id,nick_name,user_name,phone,invite_code,gender,born,email,reg_date,m_profile)VALUES("'
  sql += data.push_id+'","'+data.nick_name+'","'+data.user_name+'","'+data.phone+'","'+data.invite_code+'","'+data.gender+'","'+data.born
  sql += '","'+data.email +'","'+crt_date +'","'+data.m_profile + '")'; 
  console.log(sql);
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    var sql = 'INSERT INTO `profile`(user_id,profile,job_profile,message,my_intro,intro1,ht,job,active_sido,active_gugun,address_sido,address_gugun,collage,collage_exit'
    sql += ',religion,smoking,tatu,single)VALUES("'
    sql += rows.insertId+'","'+data.m_profile+'","'+data.job_profile+'","'+data.message+'","'+data.my_intro+'","'+data.intro1+'","'+data.ht+'","'+data.job
    sql += '","'+data.active_sido +'","'+data.active_gugun+'","'+data.address_sido+'","'+data.address_gugun+'","'+data.collage+'","'+data.collage_exit 
    sql += '","'+data.religion +'","'+data.smoking +'","'+data.tatu +'","'+data.single + '")'; 
    query(sql, function(err, rows1, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      
      callback(rows.insertId);
    });
  });  
};
exports.updateBadge = function(data, callback)
{
  callback = callback == null? nop:callback;  
  var sql = 'UPDATE badge_cert SET  badge1 = "'+data.badge1+'",badge2 = "'+data.badge2+'",badge3 = "'+data.badge3+'",badge4 = "'+data.badge4+'" '
  sql += ' ,badge5 = "'+data.badge5+'" ,badge6 = "'+data.badge6+'" ,badge7 = "'+data.badge7+'" ,badge8 = "'+data.badge8+'",userbadge9_id = "'+data.badge9+'"'
  sql += ' ,badge10 = "'+data.badge10+'" ,badge11 = "'+data.badge11+'" ,badge12 = "'+data.badge12+'" ,badge13 = "'+data.badge13+'" ,badge14 = "'+data.badge14+'" '
  sql += ' ,badge15 = "'+data.badge15+'",badge16 = "'+data.badge16+'",badge17 = "'+data.badge17+'",badge18 = "'+data.badge18+'",badge19 = "'+data.badge19+'" '
  sql += '  where user_id = "'+data.user_id+'" ';  

  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  });  
};
exports.insertBadge = function(data, callback)
{
  callback = callback == null? nop:callback; 
  // 이전기록 삭제하기
  var sql = 'INSERT INTO badge_cert(user_id,badge1,badge2,badge3,badge4,badge5,badge6,badge7,badge8,badge9,badge10,badge11,badge12,badge13,badge14'
  sql += ',badge15,badge16,badge17,badge18,badge19)VALUES("'
  sql += data.user_id+'","'+data.badge1+'","'+data.badge2+'","'+data.badge3+'","'+data.badge4+'","'+data.badge5+'","'+data.badge6+'","'+data.badge7
  sql += '","'+data.badge8+'","'+data.badge9+'","'+data.badge10+'","'+data.badge11+'","'+data.badge12+'","'+data.badge13+'","'+data.badge14+'","'+data.badge15
  sql += '","'+data.badge16 +'","'+data.badge17 +'","'+data.badge18 +'","'+data.badge19 + '")'; 
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    // 이전 이력 삭제하기
    // var sql = 'delete from temp_badge where tempId = "'+data.tempId+'" ';  
    var sql = 'UPDATE temp_badge SET  tempId = "'+data.user_id+'" where tempId = "'+data.tempId+'" ';  
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
    }); 
  });  
};

exports.login = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  // password 
  var sql = 'SELECT U.*, P.favor_age_st from users as U left join `profile` as P on P.user_id = U.id where email="'+data.email+'" ';
  // 로그인 
   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false); 
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.updateProfileAge = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE `profile` SET like_type = "'+data.like_type+'",intro = "'+data.intro+'",favor_age_st = "'+data.favor_age_st+'", favor_age_ed = "'+data.favor_age_ed+'" where user_id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};
exports.insertPhoneList = function(data, callback)
{ 
  callback = callback == null? nop:callback; 
  
  var sql = 'DELETE FROM phone_list WHERE user_id="'+data.user_id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    var sql = 'INSERT INTO phone_list(user_id,phone)VALUES("'+data.user_id +'","'+data.phone + '")'; 
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(true);
    }); 
  });  
};
//  
exports.updatePassword = function(password,email, callback)
{ 
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET password="'+password+'"  where email = "'+email+'" ';   
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.checkPhone = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id,email from users where phone="'+data.phone+'"';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getUserData = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'SELECT P.*, U.cert_profile, U.nick_name,U.born, U.report from `profile` as P left join users as U on U.id = P.user_id where user_id="'+data.id+'" ';
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false); 
          return;
      } 
      callback(rows[0]);
  }); 
};

exports.updateUserData = function(data, callback)
{  
  callback = callback == null? nop:callback;
  
  var sql = 'UPDATE `profile` SET `profile` = "'+data.profile+'", job_profile = "'+data.jobCert+'", my_intro = "'+data.intro+'"'
  sql += ' , intro1 = "'+data.intro1+'", message = "'+data.message+'" where user_id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(data.cert_profile == "1"){
        var sql = 'UPDATE users SET m_profile = "'+data.profile+'", cert_profile =  "'+data.cert_profile+'" ,resend_status=1 where id = "'+data.id+'" ';    
      }
      else
        var sql = 'UPDATE users SET m_profile = "'+data.profile+'", cert_profile =  "'+data.cert_profile+'" where id = "'+data.id+'" ';  
      query(sql, function(err, rows, fields) {
          if (err) { 
              callback(false);
              return ; 
          }
          callback(true);
      }); 
  }); 
};
exports.getUserProfile = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'SELECT U.matching_card,U.pass_card, U.nick_name,U.m_profile,U.born,U.invite_code, A.short_name,G.name from `profile` as P left join users as U on U.id = P.user_id '
  sql += ' left join address_si as A on A.id = P.address_sido left join address_gu as G on G.id = P.address_gugun  where U.id="'+data.id+'" ';
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false); 
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.updateUserStatus = function(data,reg_time, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET user_status =  "3", out_date="'+reg_time+'" where id = "'+data.id+'" ';  

  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.logout = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET login_statue =  "2" where id = "'+data.id+'" ';  

  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.getIntorStatus = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT  intro_status from  users where id="'+data.id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false); 
      return;
    } 
    callback(rows[0]);
  }); 
};
exports.updateIntorStatus = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET user_status =  "'+data.intro_status+'" where id = "'+data.id+'" ';  

  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.getPaymentList = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT * from  cuppon where os_type="'+data.os_type+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(rows);
  }); 
};
exports.insertPayment = function(data, reg_time, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'INSERT INTO payment(user_id,status,pay_info,pay_type,amount,reg_time)VALUES("'
  sql += data.id+'","'+data.status+'","'+data.pay_info+'","'+data.pay_type+'","'+data.amount+'","'+reg_time+ '")';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }

      var sql = 'UPDATE users SET matching_card = matching_card+"'+data.m_card+'", pass_card = pass_card+ "'+data.p_card+'" where id = "'+data.id+'" ';  
      query(sql, function(err, rows, fields) {
          if (err) { 
              callback(false);
              return ; 
          }
          callback(true);
      }); 
  }); 
};
exports.getMyIdealType = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT * from  `profile` where user_id="'+data.id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(rows[0]);
  }); 
};
exports.updateProfile = function(data, callback)
{  
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE `profile` SET meet_area ="'+data.meet_area+'", result_collage =  "'+data.result_collage+'" , favor_smoking =  "'+data.favor_smoking+'"'
  sql += ', favor_tatu ="'+data.favor_tatu+'", favor_religion =  "'+data.favor_religion+'" , favor_single =  "'+data.favor_single+'"'
  sql += ', favor_job ="'+data.favor_job+'", favor_age_st =  "'+data.favor_age_st+'" , favor_age_ed =  "'+data.favor_age_ed+'"'
  sql += ', favor_ht_st ="'+data.favor_ht_st+'", favor_ht_ed =  "'+data.favor_ht_ed+'" , like_type =  "'+data.like_type+'" , intro ="'+data.intro+'"'
  sql += ' where user_id = "'+data.id+'" ';  
  console.log(sql)
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.getMyStatus = function(data, callback)
{  
  callback = callback == null? nop:callback;
  if(data.gender==1){
    var sql = 'SELECT U.nick_name, U.id,U.born, P.profile, P.sel_profile,P.ht,P.admin_intro, M.profile_type2 as pt, S.short_name ,G.name, U.cert_cnt , M.id as m_id, M.m_card1 as m_card, M.p_card1 as p_card '
    sql += ' from matching as M left join users as U on U.id = M.user_id2 left join `profile` as P on P.user_id = U.id  left join address_si as S on S.id = P.address_sido '
    sql += ' left join address_gu as G on G.id = P.address_gugun where (M.user_id1="'+data.id+'" or M.user_id2="'+data.id+'") and M.status = 1 and M.m_status = 2 order by M.id  ';
  }
  
  else {
    var sql = 'SELECT U.nick_name, U.id,U.born,P.profile, P.sel_profile,P.ht,P.admin_intro,M.profile_type1 as pt, S.short_name, G.name, U.cert_cnt , M.id as m_id, M.m_card2 as m_card, M.p_card2 as p_card'
    sql += ' from matching as M left join users as U on  U.id = M.user_id1 left join `profile` as P on P.user_id = U.id left join address_si as S on S.id = P.address_sido '
    sql += ' left join address_gu as G on G.id = P.address_gugun where (M.user_id1="'+data.id+'" or M.user_id2="'+data.id+'" )and M.status = 1 and M.m_status = 1 order by M.id  ';
  }
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(rows[0]);
  }); 
};
exports.getProfileById = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'SELECT P.*, U.pass_card,U.matching_card, U.cert_profile, U.nick_name,U.born ,S.short_name, G.name,S1.short_name as s_name, G1.name as g_name from `profile` as P left join users as U on U.id = P.user_id ';
  sql += ' left join address_si as S on S.id = P.active_sido left join address_gu as G on G.id = P.active_gugun '
  sql += ' left join address_si as S1 on S1.id = P.address_sido left join address_gu as G1 on G1.id = P.address_gugun  where user_id="'+data.id+'" '
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false); 
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getBadbeInfo = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT * from  badge_cert where user_id="'+data.id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false); 
      return;
  } 
    callback(rows[0]);
  }); 
};
exports.getMyCards = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT matching_card,pass_card,nick_name from  users where id="'+data.id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false); 
      return;
  } 
    callback(rows[0]);
  }); 
};
exports.updateMatchingStatus = function(data,reg_date, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET matching_card = matching_card-"'+data.m_card+'", pass_card = pass_card- "'+data.p_card+'" where id = "'+data.user_id+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(data.status==3)
    var sql = 'UPDATE matching SET fcm_status="2", status ="'+data.status+'", m_status = "'+data.m_status+'" , pass_txt = "'+data.pass_txt+'" , st_date="'+reg_date+'" where id = "'+data.m_id+'" ';  
    else
    var sql = 'UPDATE matching SET status ="'+data.status+'", m_status = "'+data.m_status+'" , pass_txt = "'+data.pass_txt+'" , st_date="'+reg_date+'" where id = "'+data.m_id+'" ';  
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(true);
    }); 
  }); 
};
exports.getMyMatchingList = function(data, callback)
{  
  callback = callback == null? nop:callback;
  if(data.gender==1){
    var sql = 'SELECT (SELECT COUNT(*) FROM chat_history WHERE room_id=M.id AND user_id<>"'+data.id+'" AND `read`=0) AS no_read_cnt,'
    sql += ' U.nick_name, U.id,P.profile, P.sel_profile, M.profile_type2 as pt, M.id as m_id, M.status,M.meeting_date, M.place,M.address '
    sql += ' from matching as M left join users as U on U.id = M.user_id2 left join `profile` as P on P.user_id = U.id  '
    sql += ' where (M.user_id1="'+data.id+'" or M.user_id2="'+data.id+'") and M.status > 2 and M.status < 8 AND M.after_id1 = 0 order by M.id  ';
  }
  
  else {
    var sql = 'SELECT (SELECT COUNT(*) FROM chat_history WHERE room_id=M.id AND user_id<>"'+data.id+'" AND `read`=0) AS no_read_cnt,'
    sql += ' U.nick_name, U.id, P.profile, P.sel_profile, M.profile_type1 as pt, M.id as m_id, M.status,M.meeting_date, M.place,M.address '
    sql += ' from matching as M left join users as U on  U.id = M.user_id1 left join `profile` as P on P.user_id = U.id '
    sql += ' where (M.user_id1="'+data.id+'" or M.user_id2="'+data.id+'" )and M.status  > 2 and M.status < 8 AND M.after_id2 = 0 order by M.id  ';
  } 
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false); 
      return;
  } 
    callback(rows);
  }); 
};
exports.getMatchingMeetDate = function(data, callback)
{  
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from matching  where id = "'+data.id+'"';
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false); 
      return;
  } 
    callback(rows[0]);
  }); 
};
exports.updateMachingDate = function(data, callback)
{  
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE matching SET meeting_date1 = "'+data.meeting_date1+'", meeting_date2 = "'+data.meeting_date2+'", meeting_date3 = "'+data.meeting_date3+'" where id = "'+data.id+'" ';  
  if(data.meeting_date){ 
    var sql = 'UPDATE matching SET  meeting_date = "'+data.meeting_date+'" where id = "'+data.id+'" ';    
  }
  if(data.status){ //역제안 성공
    var sql = 'UPDATE matching SET status="'+data.status+'", meeting_date1 = "'+data.meeting_date1+'", meeting_date2 = "'+data.meeting_date2+'", meeting_date3 = "'+data.meeting_date3+'" where id = "'+data.id+'" ';  
  }
  console.log(sql);

  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.exitMatching = function(data,reg_date, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE matching SET status ="'+data.status+'",   st_date="'+reg_date+'" where id = "'+data.id+'" ';  
  if(data.place)
  var sql = 'UPDATE matching SET status ="'+data.status+'", place ="'+data.place+'", address ="'+data.address+'",  st_date="'+reg_date+'" where id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.updateMatchingFavor = function(data,reg_date, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'UPDATE matching SET status ="4", favor_area="'+data.favor_area+'",favor_meet="'+data.favor_meet+'", st_date="'+reg_date+'" where id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.checkAfter = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT  COUNT(A.id) AS cnt, COUNT(M.id) AS m_cnt from matching as M left join after as A on A.m_id = M.id and A.user_id = "'+data.id+'" where status = "7" ';
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    if(rows.length == 0){ 
      callback(false); 
      return;
    } 
    callback(rows[0]); 
  }); 
};
exports.insertAfter = function(data,reg_date, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'INSERT INTO after(user_id,send_id, m_id,times,face,maner,likes, memo,canceler,cancel_txt,crt_date)VALUES('
  sql += '"'+data.id+'","'+data.send_id+'","'+data.m_id+'","'+data.times+'","'+data.face+'","'+data.maner+'","'+data.likes+'","'+data.memo+'","'+data.canceler+'","'+data.cancel_txt+'","'+reg_date+'")';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.getAfter = function(data, callback)
{  
  callback = callback == null? nop:callback;
  var sql = 'SELECT * from after  where user_id = "'+data.user_id+'" and m_id ="'+data.m_id+'"  ';
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    if(rows.length == 0){ 
      callback(false); 
      return;
    } 
    callback(rows[0]); 
  }); 
};
exports.updateMeetingDate = function(data, callback)
{  
  callback = callback == null? nop:callback;
  
  var sql = 'UPDATE matching SET meeting_date="'+data.meeting_date+'" where id = "'+data.m_id+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.updatePushId = function(data,reg_date, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET push_id = "'+data.pushId+'", login_statue= 1 where id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(true);
  }); 
};
exports.insertInviteCode = function(reg_code, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET matching_card = matching_card + 2 where invite_code = "'+reg_code+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};


exports.getUserInfo = function(id, callback){
  callback = callback == null? nop:callback; 
  if(id == null && id == 0){
      callback(false);
      return;
  }  
  var sql = 'SELECT id,push_id,push_cnt ,cert_profile,report FROM users  WHERE id="'+id+'"  ' ;  
  console.log(sql)
  query(sql, function(err, rows, fields) {
      if (err) {
          callback(false);
          throw err;
      }
      else {
          if(rows.length == 0)
              callback(false);
          else
              callback(rows[0]);
      }
  });
}; 
exports.getPushCount = function(data, callback){
  callback = callback == null? nop:callback; 
  
  var sql = 'SELECT id,push_cnt FROM users  WHERE  id="'+data.id+'"  ' ;  

  query(sql, function(err, rows, fields) {
    if (err) {
        callback(false);
        throw err;
    }
    else { 
      callback(rows[0]);
    }
  }); 
}; 
exports.updatePushCnt = function(id, callback)
{  
  var sql = 'UPDATE users SET push_cnt = push_cnt+1 where id = "'+id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};
exports.updatePushCntAlarm = function(id,title,content,reg_time, callback)
{  
  var sql = 'UPDATE users SET push_cnt = push_cnt+1 where id = "'+id+'" ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      var sql = 'INSERT INTO alarm(title,content,user_id,crt_date)VALUES("'+title+'","'+content+'","'+id+'","'+reg_time+'")';
      query(sql, function(err, rows2, fields) {
        if (err) { 
          callback(false);
          return ; 
        }
        callback(true);
      });
  }); 
};
exports.updatePushCntAlarm1 = function(id,title,content,reg_time, callback)
{  
  var sql = 'UPDATE users SET push_cnt = push_cnt+1 where id = "'+id+'" ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(true);
  }); 
};
exports.insertFCM = function(data,crt_date, callback)
{  
  var sql = 'INSERT INTO fcm_temp(title,content,user_id,crt_date,path)VALUES("'+data.title+'","'+data.content+'","'+data.id+'","'+crt_date+'","'+data.path+'")';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  }); 
};
exports.getEndMatching = function(today,yesterday,status, callback)
{  
  //제안하기 일정선택한한 목록 
  var sql = 'SELECT M.*,W.nick_name, U.nick_name as nickname1 FROM matching as M left join users as U on U.id = M.user_id1 left join users as W on W.id = M.user_id2   WHERE  st_date<="'+yesterday+'"  and status = "'+status+'"' ;  
  query(sql, function(err, rows1, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows1.length == 0){ 
      callback(false);
      return;
    } 
    //해당 매칭 취소상태로 변경
    var sql = 'UPDATE matching SET st_date="'+today+'", status = 8 , fcm_status = "'+status+'" where st_date<="'+yesterday+'"   and status = "'+status+'"' ;  
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(rows1);
    }); 
    
  }); 
};
exports.sendEndMatchingFCM1 = function(today,yesterday,status, callback)
{  
  //제안하기 일정선택한한 목록 
  var sql = 'SELECT M.*,W.nick_name, U.nick_name as nickname1 FROM matching as M left join users as U on U.id = M.user_id1 left join users as W on W.id = M.user_id2 WHERE  st_date<="'+today+'"  and fcm_status = "'+status+'"' ;  
  query(sql, function(err, rows1, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows1.length == 0){ 
      callback(false);
      return;
      
    } 
    var sql = 'UPDATE matching SET fcm_status = 0  where  st_date<="'+today+'"  and  fcm_status = "'+status+'"' ;  
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(rows1);
    });  
  }); 
};
exports.sendEndMatchingFCM = function(today,yesterday,status, callback)
{  
  //제안하기 일정선택한한 목록 
  var sql = 'SELECT M.*,W.nick_name, U.nick_name as nickname1 FROM matching as M left join users as U on U.id = M.user_id1 left join users as W on W.id = M.user_id2 WHERE fcm_status = "'+status+'" ' ;  
  query(sql, function(err, rows1, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows1.length == 0){ 
      callback(false);
      return;
      
    } 
    var sql = 'UPDATE matching SET fcm_status = 0  where  fcm_status = "'+status+'"' ;  
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(rows1);
    });  
  }); 
};
exports.getCertMatching = function(today, callback)
{  
  // 1일전 만남 푸쉬보내기 
  var sql = 'SELECT M.*,W.nick_name, U.nick_name as nickname1 FROM matching as M left join users as U on U.id = M.user_id1 left join'
   sql += ' users as W on W.id = M.user_id2 WHERE meeting_date = "'+today+'" and status = 6' ;  
  query(sql, function(err, rows1, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows1.length == 0){ 
      callback(false);
      return; 
    } 
    callback(rows1);
  }); 
};
exports.getCertMatching1 = function(today, callback)
{  
  //제안하기 일정선택한한 목록 
  var sql = 'SELECT M.*,W.nick_name, U.nick_name as nickname1 FROM matching as M left join users as U on U.id = M.user_id1 left join'
   sql += ' users as W on W.id = M.user_id2 WHERE meeting_date = "'+today+'" and status = 6' ;  
  query(sql, function(err, rows1, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows1.length == 0){ 
      callback(false);
      return; 
    } 
    var sql = 'UPDATE matching SET status = 7  where meeting_date = "'+today+'" and status = 6 ' ;  
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(rows1);
    });  
  }); 
}; 
exports.getUserToken = function(id,room_id, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT push_id, push_cnt from users where id="'+id+'"  ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 
exports.getAlarmList = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE users SET push_cnt = 0  where id = "'+data.id+'"  ' ;  
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      var sql = 'SELECT * from alarm  where user_id="'+data.id+'" '; 
      query(sql, function(err, rows, fields) {
          if (err) { 
              callback(false);
              return ; 
          }
          if(rows.length == 0){ 
              callback(false); 
              return;
          } 
          callback(rows);
      }); 
    });   
};



















exports.updateComment = function(data, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE comment SET content = "'+data.content+'", nickname_state = "'+data.nickname_state+'" where id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(true);
  }); 
};

 
exports.checkRcruitment = function(reg_date, callback)
{ 
  callback = callback == null? nop:callback;
  var sql = 'UPDATE recruitment SET status = "2" , end_update_date="'+reg_date+'"  where end_date < "'+reg_date+'" and status=1';   
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    // 다음 채용확정 알림대상목록얻기
    // var sql = 'SELECT R.id,R.title,R.users_id, U.push_id FROM recruitment as R left join users as U on R.users_id=U.id where  (TIMESTAMPDIFF(DAY, R.end_update_date, CURDATE() ))=7 and U.user_state=1  AND (SELECT COUNT(id) FROM support_list WHERE recruitment_id = R.id and type=1)>0'
    var sql = 'SELECT R.id,R.title,R.users_id, U.push_id FROM recruitment as R left join users as U on R.users_id=U.id where  (TIMESTAMPDIFF(DAY, R.end_update_date, CURDATE() ))=1 and U.user_state=1  AND (SELECT COUNT(id) FROM support_list WHERE recruitment_id = R.id and type=1)>0'
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }  
      if(rows.length == 0){ 
        callback(false);
        return;
      } 
      // 알림목록 추가하기
      callback(rows);
    });  
  }); 
};
exports.getSupportFcmPushId = function(type, callback)
{ 
  callback = callback == null? nop:callback;
  if(type==1){
    var sql = '  SELECT S.id, R.users_id ,B.push_id ,U.user_name, B.business_name  FROM support_list AS S '
    sql += ' LEFT JOIN recruitment AS R ON R.id = S.recruitment_id LEFT JOIN users AS B ON B.id = R.users_id '
    // sql += ' LEFT JOIN users AS U ON S.users_id=U.id WHERE   (TIMESTAMPDIFF(DAY, S.select_date, CURDATE() ))=6 AND U.user_state=1 AND S.type=1'
    sql += ' LEFT JOIN users AS U ON S.users_id=U.id WHERE   (TIMESTAMPDIFF(DAY, S.select_date, CURDATE() ))=1 AND U.user_state=1 AND S.type=1'
  }
  else{
    var sql = '  SELECT S.id, S.users_id ,U.push_id ,U.user_name, B.business_name  FROM support_list AS S '
    sql += ' LEFT JOIN recruitment AS R ON R.id = S.recruitment_id LEFT JOIN users AS B ON B.id = R.users_id '
    // sql += ' LEFT JOIN users AS U ON S.users_id=U.id WHERE   (TIMESTAMPDIFF(DAY, S.select_date, CURDATE() ))=6 AND U.user_state=1 AND S.type=1'
    sql += ' LEFT JOIN users AS U ON S.users_id=U.id WHERE   (TIMESTAMPDIFF(DAY, S.select_date, CURDATE() ))=1 AND U.user_state=1 AND S.type=1' 
  }
  // 알림목록 추가하기
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }  
    if(rows.length == 0){ 
      callback(false);
      return;
    } 
    callback(rows);
  });  
};


exports.getBusinessName = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET chatting_id = "'+data.room_id+'" where id = "'+data.userId+'" ';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    var sql = 'SELECT type,user_name,business_name from users where id="'+data.id+'"';   
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        }
        if(rows.length == 0){ 
            callback(false);
            return;
        } 
        callback(rows[0]);
    }); 
  });
  
};
exports.getTerms = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from terms where type="'+data.type+'"';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getMyInfoHistoryState = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT business_name,history_on_off,`profile`,email_on_off,phone_on_off,phone,time_on_off,start_time,end_time from users  where id="'+data.id+'"';   

  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 


exports.getMyInfoPushStatus = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT history_push_on_off, chatting_push_on_off, marketing_agree from users where id="'+data.id+'"';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 

exports.getPortfolioState = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id from support_list where users_id = "'+data.users_id+'" and recruitment_id = "'+data.id+'" and type = 2 ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getScrapStatus = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id from scrap where users_id = "'+data.users_id+'" and portfolio_id = "'+data.portfolio_id+'" ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(true);
  }); 
};

exports.getMyHistoryList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from myhistory where users_id="'+data.users_id+'"';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
}; 
exports.deleteScrap = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type){
    var sql = 'delete from scrap where users_id = "'+data.users_id+'" and portfolio_id = "'+data.portfolio_id+'" ';  
  }
  else
  var sql = 'delete from scrap where users_id = "'+data.users_id+'" and recruitment_id = "'+data.recruitment_id+'" ';  
  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  });  
}
exports.deleteEmploy = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'delete from recruitment where id="'+data.id+'"';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  });  
}

exports.deleteBlockList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'delete from block_list where id="'+data.id+'"';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    callback(true);
  });  
}
exports.deleteMyHistory = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'delete from myhistory where id="'+data.id+'"';  
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    var sql = 'SELECT * from myhistory where users_id="'+data.users_id+'"';   
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
    }); 
  });  
};
 

exports.getEmployListTotal = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT COUNT(R.id) AS total FROM recruitment AS R  LEFT JOIN users AS U ON U.id = R.users_id  where R.del_flag != "1" and status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), end_date))>=0  '+data.search+' order by end_date';    
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows[0]);
  }); 
};
exports.getReviewDetail = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from reviews  where id =  '+data.id+' ';    
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ;
      } 
      callback(rows[0]);
  }); 
};

exports.getPortfolioListTotal = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id) as total from users  where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1 '+data.search+' order by port_date desc, id desc';    
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows[0]);
  }); 
};

exports.getReviewBySId = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==2){
    
      var sql = '  SELECT S.review_id , S.id,S.users_id ,U.user_name,U.age,U.history,U.business_name FROM support_list  AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += ' AND R.users_id = "'+data.users_id+'" LEFT JOIN users AS U ON S.users_id = U.id ' 
      // sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND  U.user_state=1 '   
      sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0 AND  U.user_state=1 '   
      sql += '  AND S.id= "'+data.id+'"  ORDER BY  S.id DESC  '
    
  } 
  else{ // 기업회원에대한 리뷰
   
      var sql = 'SELECT S.review2_id as review_id , S.id ,R.users_id,U.user_name,U.age,U.history,U.business_name FROM support_list AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += '  AND S.users_id = "'+data.users_id+'"  LEFT JOIN users AS U ON R.users_id = U.id  ';
      // sql += '  WHERE S.id= "'+data.id+'" and S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND  U.user_state=1  ';
      sql += '  WHERE S.id= "'+data.id+'" and S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0 AND  U.user_state=1  ';
    
  }  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows);
  }); 
};

exports.getReviewList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==2){
    if(data.editor==1){
      var sql = '  SELECT S.review_id , S.id,S.users_id ,U.user_name,U.age,U.history,U.business_name FROM support_list  AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += '  LEFT JOIN users AS U ON S.users_id = U.id ' 
      // sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND (TIMESTAMPDIFF(DAY, R.end_update_date,CURDATE()))<1 AND  U.user_state=1 '   
      sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0  AND (TIMESTAMPDIFF(DAY, R.end_update_date,CURDATE()))<2 AND  U.user_state=1 '  
      sql += '  AND S.review_id=0 AND R.users_id = "'+data.users_id+'" ORDER BY  S.id DESC  '
    } 
    else{
      var sql = ' SELECT S.review_id , S.id,S.users_id ,U.user_name,U.age,U.history,U.business_name FROM support_list  AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += ' LEFT JOIN users AS U ON S.users_id = U.id ' 
      // sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND   U.user_state=1 '   
      sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0 AND   U.user_state=1 ' 
      sql += '  AND S.review_id>0 AND R.users_id = "'+data.users_id+'"  ORDER BY S.review_id DESC , S.id DESC '
    }
  }
  else{ // 기업회원에대한 리뷰
    if(data.editor==1){
      var sql = 'SELECT S.review2_id as review_id , S.id ,R.users_id,U.user_name,U.age,U.history,U.business_name FROM support_list AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += '  AND S.users_id = "'+data.users_id+'"  LEFT JOIN users AS U ON R.users_id = U.id  ';
      // sql += '  WHERE S.review2_id=0 and S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND  U.user_state=1  ';
      sql += '  WHERE S.review2_id=0 and S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0  AND (TIMESTAMPDIFF(DAY, R.end_update_date,CURDATE()))<1 AND  U.user_state=1  ';
    } 
    else{
      var sql = ' SELECT S.review2_id as review_id , S.id,R.users_id ,U.user_name,U.age,U.history,U.business_name FROM support_list  AS S LEFT JOIN recruitment AS R ON R.id = S.recruitment_id AND S.type=1 ';
      sql += ' AND S.users_id = "'+data.users_id+'" LEFT JOIN users AS U ON R.users_id = U.id ' 
      // sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>5 AND   U.user_state=1 '   
      sql += ' WHERE S.status=1 AND (TIMESTAMPDIFF(DAY, S.select_date,CURDATE()))>=0 AND   U.user_state=1 ' 
      sql += '  AND S.review2_id>0 ORDER BY S.review_id DESC , S.id DESC    '
    }
  } 
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows);
  }); 
};
exports.getAddressSido = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT sido_id  from address_gu where id = "'+data.id+'"';    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 

exports.getSupportPages = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id)as total  from support_list where users_id = "'+data.users_id+'"';    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 
exports.getSupportList = function(data, callback) 
{
  callback = callback == null? nop:callback;  
  var sql = 'SELECT R.* ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date)) AS dday, U.business_name  FROM support_list AS S LEFT JOIN  recruitment AS R ON S.recruitment_id = R.id '
  sql += ' left join users as U on U.id = R.users_id  WHERE   R.del_flag!=1 and S.users_id = "'+data.id+'"' 
  sql += ' ORDER BY id  LIMIT  ' + data.page + ',' + data.limit ;   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getSupporters = function(data, callback) 
{
  callback = callback == null? nop:callback;  
  var sql = 'SELECT U.*,S.status,S.id as s_id FROM support_list AS S '
  sql += ' left join users as U on U.id = S.users_id  WHERE S.recruitment_id = "'+data.id+'" and U.user_state=1' 
  sql += ' ORDER BY S.id desc   '  ;    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};

exports.alertNoViewCntByUserId = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id)as chat_cnt  from chat_history where users_id = "'+data.userId+'" and `read` !=1';    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getScrapPages = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id)as total  from scrap where users_id = "'+data.users_id+'"';    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
}; 
exports.getScrapList = function(data, callback) 
{
  callback = callback == null? nop:callback; 
  if(data.type==1){
    var sql = 'SELECT R.* ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date)) AS dday, U.business_name  FROM scrap AS S LEFT JOIN  recruitment AS R ON S.recruitment_id = R.id '
    sql += ' left join users as U on U.id = R.users_id  WHERE   R.del_flag!=1 and S.users_id = "'+data.id+'" ' 
    sql += ' ORDER BY S.register_date desc  LIMIT  ' + data.page + ',' + data.limit ;  
  }
  else{
    var sql = 'SELECT U.* FROM scrap AS S LEFT JOIN  users AS U ON S.portfolio_id = U.id WHERE U.user_state=1 and U.history_on_off=1 and U.type = 1 AND U.del_flag != 1 and S.users_id = "'+data.id+'"'
    sql += ' ORDER BY S.register_date desc LIMIT  ' + data.page + ',' + data.limit ; 
  }
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};

exports.getPortfolioList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type){  
    var sql = 'SELECT * from users  where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1 and (homepage like "%https://www.youtube.com/watch?v=%" or homepage like "%https://m.youtube.com/watch?v=%" or homepage like "%https://youtu.be/%" ) order by port_date DESC , id desc  limit '+data.page+', '+ data.limit ; 
  }
  else{ //긴급인재
    if(data.search)
    var sql = 'SELECT * from users  where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1  '+data.search+' order by port_date DESC , id desc  limit '+data.page+', '+ data.limit ; 
    else
    var sql = 'SELECT * from users  where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1    order by port_date DESC , id desc  limit '+data.page+', '+ data.limit ; 
  }  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getEmployListAll = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==1){  //긴급인재
    var sql = 'SELECT  R.title, R.id, R.end_date, U.business_name, R.register_date , R.media_name ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date)) AS dday , R.status '; 
    sql += ' from recruitment as R left join users as U on U.id = R.users_id  where R.del_flag != "1" and R.status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))>=0 ';  
    sql += ' and (TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))<=3   order by R.end_date ,R.id desc limit '+data.page+', '+ data.limit
  }
  else if(data.type==3){
    var sql = 'SELECT  R.title, R.id, R.end_date, U.business_name, R.register_date , R.media_name ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date)) AS dday , R.status '; 
    sql += ' from recruitment as R left join users as U on U.id = R.users_id  where R.del_flag != "1" and R.status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))>=0 ';  
    sql += '   order by R.end_date ,R.id desc limit '+data.page+', '+ data.limit
  }
  else{ //검색엔진
    var sql = 'SELECT  R.title, R.id, R.end_date, U.business_name, R.register_date , R.media_name ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date)) AS dday , R.status '; 
    sql += ' from recruitment as R left join users as U on U.id = R.users_id  where R.del_flag != "1" and R.status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))>=0 ' +data.search; 
    
    sql +=  ' order by R.end_date ,R.id desc limit '+data.page+', '+ data.limit
    
  }   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getEmployList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT  R.title, R.id, R.end_date, U.business_name, R.register_date , R.media_name ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))AS dday , R.status '; 
  sql += ' from recruitment as R left join users as U on U.id = R.users_id  where R.del_flag != "1" and R.users_id = "'+data.users_id+'"   order by id desc ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getCommentTotals = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id) as cnt from comment where community_id = "'+data.community_id+'" ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows[0]);
  }); 
}; 

exports.getBlockList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT B.* , U.profile from block_list as B left join users as U on U.id = B.com_id where users_id = "'+data.users_id+'"  and B.type = "1" ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
        callback(false);
        return ; 
      }
      if(rows.length == 0){ 
        callback(false);
        return;
      } 
      else
        callback(rows);
  }); 
};
exports.getCommunitySubscript = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id from block_list where users_id = "'+data.users_id+'" and com_id = "'+data.id+'" and type = "'+data.type+'" ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      else callback(true);
  }); 
};
exports.getCommentList = function(data, callback)
{ 
  callback = callback == null? nop:callback;  
  
  var sql = 'SELECT  C.*, U.user_name,U.profile,U.business_name,U.type as u_type,TIMESTAMPDIFF(MINUTE, C.register_date, NOW()) AS diff_min, B.id as sub_state FROM comment as C left join users as U on C.users_id = U.id LEFT JOIN block_list AS B ON C.id = B.com_id AND B.type =3 ';  
  sql += ' WHERE (SELECT COUNT(id) FROM block_list WHERE users_id = "'+data.users_id+'" AND C.users_id = com_id AND type = 1 ) = 0 and C.community_id =  "'+data.com_id+'" and C.deep="1" order by C.register_date desc'
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      else{
        var sql = 'SELECT  C.*, U.user_name,U.profile,U.business_name,U.type as u_type,TIMESTAMPDIFF(MINUTE, C.register_date, NOW()) AS diff_min, B.id as sub_state FROM comment as C left join users as U on C.users_id = U.id LEFT JOIN block_list AS B ON C.id = B.com_id AND B.type =3';  
        sql += ' WHERE (SELECT COUNT(id) FROM block_list WHERE users_id = "'+data.users_id+'" AND C.users_id = com_id AND type = 1 ) = 0 and C.community_id =  "'+data.com_id+'" and C.deep != "1" order by C.register_date desc'
        
        query(sql, function(err, small, fields) { 
            if (err) {  
                callback(false);
                return ; 
            }
             if(small.length == 0){  
              var arr = [];
              for(var i=0;i<rows.length;i++){  
                arr[i]={
                  'nickname_state':rows[i].nickname_state,
                  'content':rows[i].content, 
                  'id':rows[i].id,
                  'deep':rows[i].deep,
                  'users_id':rows[i].users_id,
                  'subscript':rows[i].subscript,
                  'sub_state':rows[i].sub_state,
                  'crt_date':rows[i].diff_min,
                  'register_date':rows[i].register_date,
                  'user_name':rows[i].user_name,
                  'profile':rows[i].profile, 
                  'business_name':rows[i].business_name, 
                  'u_type':rows[i].u_type, 
                  'comment':[],   
                }
              }
              callback(arr);
                return;
            } 
            else{ 
              // 대댓글 하위로 등록하기
              var arr = [];
              for(var i=0;i<rows.length;i++){ 
                var s_arr=[];
                var g=0;
                for(var k=0;k<small.length;k++){
                  if(rows[i].id==small[k].deep_id){
                    s_arr[g]={
                      'nickname_state':small[k].nickname_state,
                      'content':small[k].content, 
                      'id':small[k].id,
                      'users_id':small[k].users_id,
                      'subscript':small[k].subscript,
                      'sub_state':small[k].sub_state,
                      'register_date':small[k].register_date,
                      'deep':small[k].deep,
                      'crt_date':small[k].diff_min,
                      'user_name':small[k].user_name,
                      'profile':small[k].profile, 
                      'business_name':small[k].business_name, 
                      'u_type':small[k].u_type, 
                    }
                    g++;
                  } 
                } 
                arr[i]={
                  'nickname_state':rows[i].nickname_state, 
                  'content':rows[i].content, 
                  'id':rows[i].id,
                  'register_date':rows[i].register_date,
                  'sub_state':rows[i].sub_state,
                  'subscript':rows[i].subscript,
                  'deep':rows[i].deep,
                  'users_id':rows[i].users_id,
                  'crt_date':rows[i].diff_min,
                  'user_name':rows[i].user_name,
                  'profile':rows[i].profile, 
                  'business_name':rows[i].business_name, 
                  'u_type':rows[i].u_type, 
                  'comment':s_arr, 
                }
              } 
              callback(arr);
            }
            
        }); 
      } 
  }); 
};
exports.insertComment = function(data,crt_date, callback)
{ 
  callback = callback == null? nop:callback;
   
  var sql = 'INSERT INTO comment(nickname_state, deep_id,content,deep,community_id,users_id, register_date)VALUES("'+data.nickname_state+'","'+data.deep_id+'","'+data.content+'","'+data.deep+'","'+data.com_id+'","'+data.users_id+'","'+crt_date+'")';
 
  query(sql, function(err, rows, fields) {
    if (err) { 
      callback(false);
      return ; 
    }  
    var sql = 'UPDATE community SET comment=comment+1  where id = "'+data.com_id+'" '; 
    query(sql, function(err, rows1, fields) {
      if (err) { 
        callback(false);
        return ; 
      }
      if(data.re_id==data.users_id){
        callback(true);
        return;
      } 
      callback(true);
      // if(data.deep > 1){  // 대댓글
      //   if(data.re_id==data.u_id){
      //     callback(true);
      //     return;
      //   }
      //   var sql = 'INSERT INTO tb_alarm(maker_id,u_id,c_id, type, content,deep_id)VALUES("'+data.u_id+'","'+data.re_id+'","'+data.c_id+'","3" ,"'+data.content+'","'+data.deep_id+'")';
      //   query(sql, function(err, rows2, fields) {
      //     if (err) { 
      //       callback(false);
      //       return ; 
      //     }
      //     callback(true);
      //   }); 
      // }  
      // else{
      //   var sql = 'INSERT INTO tb_alarm(maker_id,u_id,c_id, type)VALUES("'+data.u_id+'","'+data.re_id+'","'+data.c_id+'","2" )';
      //   query(sql, function(err, rows2, fields) {
      //     if (err) { 
      //       callback(false);
      //       return ; 
      //     }
      //     callback(true);
      //   }); 
      // }
    }); 
   
  }); 
};

exports.sendStopResult = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'INSERT INTO block_list(type, com_id,users_id,block_name)VALUES("'+data.type+'","'+data.c_id+'","'+data.users_id+'","'+data.block_name+'")';
  query(sql, function(err, rows1, fields) {
    if (err) { 
      callback(false);
      return ; 
    }
    callback(true); 
  });   
};
exports.updateViews = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id from block_list where users_id = "'+data.users_id+'" and com_id = "'+data.id+'" and type = "'+data.type+'"'
  query(sql, function(err, rows, fields) {
    if (err) {  
        callback(false);
        return ; 
    }
    if(rows.length == 0){
      var sql = 'INSERT INTO block_list(type, com_id,users_id)VALUES("'+data.type+'","'+data.id+'","'+data.users_id+'")';
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        // 게시글 조회수 업데이트하기
        var sql = 'UPDATE community SET view=view+1  where id = "'+data.id+'" '; 
        query(sql, function(err, rows1, fields) {
          if (err) { 
            callback(false);
            return ; 
          }
          if(data.re_id==data.users_id){
            callback(true);
            return;
          } 
          callback(true);
          
        });  
      }); 
    }
    else
      callback(false);
     
  });  
};
exports.updateCommunity = function(data,crt_date, callback)
{  
  var img = '';//data.img_list;
  if(data.old_list)
    img = data.old_list;
  
  if(data.img_list){
    if(img!='')
    img = img+","+data.img_list;
    else
    img += data.img_list;
  }
  callback = callback == null? nop:callback;
  var sql = 'UPDATE community SET content = "'+data.content+'",title = "'+data.title+'" ,img = "'+img+'",nickname_state = "'+data.nickname_state+'" where id = "'+data.id+'" ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(true);
  }); 
};
exports.updateSubscript = function(data, callback)
{
  callback = callback == null? nop:callback; 
  
  if(data.state)
  var sql = 'INSERT INTO block_list(type, com_id,users_id)VALUES("'+data.type+'","'+data.com_id+'","'+data.users_id+'")';
  else
  var sql = 'DELETE FROM block_list WHERE type="'+data.type+'" and users_id = "'+data.users_id+'" and com_id = "'+data.com_id+'" ';
  query(sql, function(err, rows, fields) {
    if (err) {  
        callback(false);
        return ; 
    }
    if(data.type==2){  // 
      if(data.state)
      var sql = 'UPDATE community SET subscript = subscript+1  where id = "'+data.com_id+'" '; 
      else
      var sql = 'UPDATE community SET subscript = subscript-1  where id = "'+data.com_id+'" '; 
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(true);
      });  
    }
    else{
      if(data.state)
      var sql = 'UPDATE comment SET subscript = subscript+1  where id = "'+data.com_id+'" '; 
      else
      var sql = 'UPDATE comment SET subscript = subscript-1  where id = "'+data.com_id+'" '; 
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(true);
      });  
    }
  });
 
    
};
exports.getAlarmStatus = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET chatting_id = "0" where id = "'+data.id+'" '; 
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    var sql = 'SELECT  count(id) as total from alarm where users_id = "'+data.id+'" and status = 0'; 
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        }
        callback(rows[0]);
    }); 
  });  
};
exports.getMediaPages = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT  count(id) as total from users where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1 and (homepage like "%https://www.youtube.com/watch?v=%" or homepage like "%https://m.youtube.com/watch?v=%"  or homepage like "%https://youtu.be/%" )  order by port_date desc';
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(rows[0]);
  }); 
};
exports.getMediaPortfolioList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sort = "port_date"; 
  if(data.sort ==1){
    sort = "views"
  }
  
  var sql = 'SELECT  * from users where user_state=1 and history_on_off=1 and type = 1 and age>0 and del_flag!=1 and (homepage like "%https://www.youtube.com/watch?v=%" or homepage like "%https://m.youtube.com/watch?v=%" or homepage like "%https://youtu.be/%" )  order by '+sort+' desc  LIMIT  ' + data.page + ',' + data.limit ; 
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(rows);
  }); 
};

exports.getCommunityList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = ' SELECT C.*,  TIMESTAMPDIFF(MINUTE, C.crt_date, NOW()) AS diff_min, U.profile,U.user_name,U.type as u_type,U.business_name from community as C left join users as U on C.users_id = U.id '; 
  sql += '   WHERE  (SELECT COUNT(id) FROM block_list WHERE users_id = "'+data.u_id+'" AND C.users_id = com_id AND TYPE = 1 ) = 0 and C.type="'+data.type+'"  '
  sql += '  order by C.crt_date desc  limit '+data.limit_st+','+data.limit_ed;  
 
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getEmployStatus = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT  R.id, U.id AS scrap_id, S.id AS support_id,S.status  FROM recruitment AS R LEFT JOIN scrap AS U ON U.recruitment_id = R.id  AND U.users_id =  '; 
  sql += ' "'+data.users_id+'" LEFT JOIN support_list AS S ON S.recruitment_id = R.id   AND S.users_id = "'+data.users_id+'" where R.del_flag != "1" and R.id = "'+data.id+'" ';  
  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getChattingRoomId = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT id FROM chat_room where recruitment_id= "'+data.recruitment_id+'" and user_id2= "'+data.user_id2+'" and user_id1= "'+data.user_id1+'"  '; 
   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getTotalPages = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==1){
    var sql = ' select * from ((select count(id) as pot_cnt from users where type=1 and age>0 and user_state=1 and history_on_off=1   ) as T , ';
    sql+= '(select count(id) as em_cnt from recruitment where del_flag != "1" and status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), end_date))>=0 '+data.search+' ) as A)' 
  }
  else{
    var sql = ' select * from ((select count(id) as pot_cnt from users where type=1 and age>0 and user_state=1 and history_on_off=1 '+data.search+'  ) as T , ';
    sql+= '(select count(id) as em_cnt from recruitment where del_flag != "1" and status=1 and (TIMESTAMPDIFF(DAY, CURDATE(), end_date))>=0  ) as A)' 
  }
  
   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};

exports.getEmploySupportTotal = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT count(id) as cnt from support_list  where  recruitment_id = "'+data.id+'" ';  
  // 지원자수 얻기

  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.getEmployDetail = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT  R.* ,(select avg(sub) from reviews where users_id = R.users_id)as avg_mark ,(select count(id) from reviews where users_id = R.users_id)as cnt ,(TIMESTAMPDIFF(DAY, CURDATE(), R.end_date))AS dday , U.profile, U.business_name, U.address_si, U.user_name '; 
  sql += ' from recruitment as R left join users as U on U.id = R.users_id  where R.del_flag != "1" and R.id = "'+data.id+'" ';  
  // 지원자수 얻기

  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.updateViewsUsers = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET views = views+1 where id = "'+data.id+'" ';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(true);
  });
};

 

exports.deleteCommunity = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'DELETE FROM community WHERE id="'+data.id+'"';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    var sql = 'DELETE FROM comment WHERE community_id="'+data.id+'"';   
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }  
      var sql = 'DELETE FROM report WHERE community_id="'+data.id+'" ';   
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        }  
        callback(true);
      }); ;
    }); 
  });  
};
exports.deleteComment = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'select id FROM comment WHERE id="'+data.id+'" or deep_id="'+data.id+'"';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
      callback(false);
      return;
    } 
    var sql = 'update community SET comment = comment - '+rows.length+'  WHERE id="'+data.com_id+'" ';
    query(sql, function(err, rows1, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      var sql = 'DELETE FROM comment WHERE id="'+data.id+'" or deep_id="'+data.id+'"';
      query(sql, function(err, rows2, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        callback(rows.length);
      });  
    });  
  });  
};

exports.deleteSupport = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'DELETE FROM support_list WHERE recruitment_id="'+data.recruitment_id+'" and users_id ="'+data.user_id+'"';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
        callback(false);
        return;
    }  
    var sql = 'update  recruitment set support_count = support_count-1 where  id = "'+data.recruitment_id+'" ';   
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      callback(true);
    }); 
  });  
};


exports.deleteAlarmList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'DELETE FROM alarm WHERE id="'+data.id+'"';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    }
    if(rows.length == 0){ 
        callback(false);
        return;
    } 
    var sql = 'SELECT * from alarm where  users_id = "'+data.users_id+'" ';   
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
    }); 
  });  
};

exports.getRoomStatus = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data.userId>0){
    var sql = 'SELECT COUNT(id)as cnt FROM chat_history WHERE room_id="'+data.id+'" AND user_id<>"'+data.userId+'" AND `read`=0' ; 
    query(sql, function(err, rows, fields) {
      var sql = 'UPDATE users SET push_cnt = push_cnt- '+rows[0].cnt+' where id = "'+data.userId+'" ';  
      query(sql, function(err, rows, fields) {
        var sql = 'SELECT status ,(select user_name from users where id = chat_room.status) as user_name'
        sql += ',(select type from users where id = chat_room.status) as type ,(select business_name from users where id = chat_room.status) as business_name'
        sql += ' from chat_room where id="'+data.id+'"';   
        query(sql, function(err, rows, fields) {
            if (err) { 
                callback(false);
                return ; 
            }
            if(rows.length == 0){ 
                callback(false);
                return;
            } 
            callback(rows[0]);
        }); 
      });
    });
  }
  else{
    var sql = 'SELECT status ,(select user_name from users where id = chat_room.status) as user_name'
    sql += ',(select type from users where id = chat_room.status) as type ,(select business_name from users where id = chat_room.status) as business_name'
    sql += ' from chat_room where id="'+data.id+'"';   
    query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        }
        if(rows.length == 0){ 
            callback(false);
            return;
        } 
        callback(rows[0]);
    }); 
  } 
};

exports.getMediaList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from media_largecategory order by sort';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      var arr = [];
        var cnt = 0;
        async.forEachOf(rows, (value, key, callback1) => {
          var sql = 'select *, (select name from media_largecategory where id = "'+value.id+'") as large_name from media_subcategory  where media_largecategory_id = "'+value.id+'"  order by sort ';  
          query(sql, function(errs, row1, fields) { 
            if(row1.length>0){
              arr.push(row1);  
            } 
            callback1('');
          });
        }, err => {
          if (err) 
              console.error(err.message);  
          callback(arr); 
        })
  }); 
};
exports.getJobList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT * from job_largecategory order by sort';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      var arr = [];
        var cnt = 0;
        async.forEachOf(rows, (value, key, callback1) => { 
          var sql = 'select *, (select name from job_largecategory where id = "'+value.id+'") as large_name from job_subcategory  where job_largecategory_id = "'+value.id+'"  order by sort ';  
          query(sql, function(errs, row1, fields) { 
            if(row1.length>0){
              arr.push(row1);  
            } 
            callback1('');
          }); 
        }, err => {
          if (err) 
              console.error(err.message);  
          callback(arr); 
        })
  }); 
};
exports.getBusinessReviewList = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT R.*, U.user_name,U.business_name from reviews as R left join users as U on R.maker_id = U.id where users_id = "'+data.id+'" ' 
   //and (TIMESTAMPDIFF(DAY, CURDATE(), end_date))< 2
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
  }); 
};
exports.getUserReview = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT SUM(sub1) AS sb1 ,SUM(sub2) AS sb2 ,SUM(sub3) AS sb3 ,SUM(sub4) AS sb4 ,SUM(sub5) AS sb5 ,SUM(sub6) AS sb6 FROM reviews'
  sql += ' where users_id = "'+data.id+'"'  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};


exports.getMyInfo = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'SELECT U.*, S.name as sido, G.name as gugun, ' 
  sql += ' (select count(id) from reviews where users_id = "'+data.id+'")as cnt, '
  sql += ' (select avg(sub) from reviews where users_id = "'+data.id+'")as avg_mark '
  sql += ' from users  as U left join address_si as S on S.id = U.address_si left join address_gu as G on G.id = U.address_gu  where U.id="'+data.id+'"';  

  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows[0]);
  }); 
};
exports.insertReport = function(data,crt_date, callback)
{ 
  callback = callback == null? nop:callback;
   
  var sql = 'INSERT INTO report(report_type,content,re_id,community_id,users_id, type,crt_date)VALUES("'+data.report_type+'","'+data.content+'","'+data.re_id+'","'+data.community_id+'","'+data.users_id+'","'+data.type+'","'+crt_date+'")';
  query(sql, function(err, rows, fields) {
    if (err) { 
      callback(false);
      return ; 
    } 
    if(data.type==1){
      var sql = 'UPDATE community SET report=report+1  where id = "'+data.community_id+'" ';
      query(sql, function(err, rows1, fields) {
        if (err) { 
          callback(false);
          return ; 
        }
        callback(false);
      }); 
    }
    else{
      var sql = 'UPDATE comment SET report=report+1  where id = "'+data.id+'" ';
      query(sql, function(err, rows1, fields) {
        if (err) { 
          callback(false);
          return ; 
        }
        callback(false);
      }); 
    }  
  }); 
};
exports.createChattingRoom = function(data, crt_date, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'INSERT INTO chat_room(user_id1,user_id2, recruitment_id,reg_time)VALUES("'+data.user_id1+'","'+data.user_id2+'","'+data.recruitment_id+'","'+crt_date+'")';  
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(rows.insertId);
  }); 
};
exports.insertScrap = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type){
    var sql = 'INSERT INTO scrap(users_id, portfolio_id,register_date)VALUES("'+data.users_id+'","'+data.portfolio_id+'","'+crt_date+'")';
  }
  else
    var sql = 'INSERT INTO scrap(users_id, recruitment_id,register_date)VALUES("'+data.users_id+'","'+data.recruitment_id+'","'+crt_date+'")';
    
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};

exports.insertCommunity = function(data,reg_date, callback)
{
  callback = callback == null? nop:callback; 
  if(data == null ) {
      callback(false);
      return;
  }  
  var sql = 'INSERT INTO community(crt_date,title, users_id, content,img,nickname_state)VALUES("'+reg_date+'", "'+data.title+'","'+data.users_id+'","'+data.content+'","'+data.img_list+'","'+data.nickname_state+'")';
   
  query(sql, function(err, rows, fields) {
      if (err) {
          callback(false);
          throw err;
      } else {
        callback(true);
      }
  });
};
exports.insertAlarm = function(data, callback)
{
  callback = callback == null? nop:callback; 
  if(data == null ) {
      callback(false);
      return;
  }  
  var sql = 'INSERT INTO alarm(users_id,  content, crt_date ,room_id,type)VALUES("'+data.users_id+'","'+data.content+'","'+data.reg_date+'","'+data.room_id+'","'+data.type+'")'; 
   
  query(sql, function(err, rows, fields) {
      if (err) {
          callback(false);
          throw err;
      } else {
        var sql = 'UPDATE users SET push_cnt = push_cnt+1 where id = "'+data.users_id+'" ';  
        console.log("insertAlarm:",sql);
        query(sql, function(err, rows, fields) {
            if (err) { 
                callback(false);
                return ; 
            } 
            callback(true);
        });
      }
  });
};

exports.outChatingRoom = function(data, callback)
{  
  // var sql = 'DELETE FROM chat_history WHERE id="'+id+'"';

  if(data.type){
    var sql = 'DELETE from chat_room where id = "'+data.id+'" ';  
  }
  else
    var sql = 'UPDATE chat_room SET status = "'+data.users_id+'" where id = "'+data.id+'" ';   
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(data.type){
        var sql = 'DELETE from chat_history where room_id = "'+data.id+'" '; 
        query(sql, function(err, rows, fields) {
          if (err) {
              callback(false);
              throw err;
          }
          callback(true);
          return
        });
      }
      else
        callback(true);
  }); 
};


exports.insertSupport = function(data, crt_date, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==2) // 열람하기 클릭시
  var sql = 'INSERT INTO support_list(users_id, recruitment_id, support_date,type)VALUES("'+data.users_id+'","'+data.recruitment_id+'", "'+crt_date+'","'+data.type+'")';
  else  // 지원하기 클릭시
  var sql = 'INSERT INTO support_list(users_id, recruitment_id, support_date)VALUES("'+data.users_id+'","'+data.recruitment_id+'", "'+crt_date+'")';
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      // 룸 창조하기
      if(data.type==2)
      var sql = 'INSERT INTO chat_room(type,user_id1,user_id2, recruitment_id,reg_time)VALUES("'+data.type+'","'+data.users_id+'","'+data.recruitment_id+'","'+data.recruitment_id+'","'+crt_date+'")';  
      else
      var sql = 'INSERT INTO chat_room(type,user_id1,user_id2, recruitment_id,reg_time)VALUES("'+data.type+'","'+data.users_id+'","'+data.user_id2+'","'+data.recruitment_id+'","'+crt_date+'")';  
      query(sql, function(err, rows, fields) {
        if (err) { 
            callback(false);
            return ; 
        } 
        var room_id = rows.insertId 
        if(data.type!=2){ // 지원하기의 경우 지원자수
          var sql = 'UPDATE recruitment SET  support_count=support_count+1 where id = "'+data.recruitment_id+'" '
          query(sql, function(err, rows, fields) {
            if (err) { 
                callback(false);
                return ; 
            } 
            callback(room_id);
          }); 
        }
        else{
          callback(room_id);
        }
      });  
  }); 
}; 
exports.insertReviews = function(data, crt_date, callback) 
{
  callback = callback == null? nop:callback; 
  var sql = 'INSERT INTO reviews(users_id,content,maker_id,sub1,sub2,sub3,sub4,sub5,sub6,sub, register_date)VALUES';
  sql += '("'+data.users_id+'", "'+data.content+'","'+data.maker_id+'","'+data.sub1+'","'+data.sub2+'","'+data.sub3+'","'+data.sub4+'","'+data.sub5+'","'+data.sub6+'","'+data.sub+'","'+crt_date+'")'
   
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    if(data.type==1)
    var sql = 'UPDATE support_list SET  review_id= "'+rows.insertId+'"   where id = "'+data.s_id+'" ';  
    else
    var sql = 'UPDATE support_list SET  review2_id= "'+rows.insertId+'"   where id = "'+data.s_id+'" ';   
    query(sql, function(err, rows, fields) { 
      if (err) { 
          callback(false);
          return ; 
      } 
      if(data.sub==1){
        var sql = 'UPDATE users SET subscript= subscript+1 where id = "'+data.users_id+'" ';   
        query(sql, function(err, rows, fields) { 
          if (err) { 
              callback(false);
              return ; 
          } 
          callback(true);
        });  
      }
      else{
        callback(true);
      }
    });  
  }); 
};

exports.insertEmploy = function(data, crt_date, callback)
{
  callback = callback == null? nop:callback; 
  if(data.period==1){
    var sql = 'INSERT INTO recruitment(period,register_date,gender,title,work_type,end_date,work_name,max_count,pay,pay_type,r_type,support_type,intro,r_phone,media_sub,job_sub,address_id,users_id,media_name,job_name,address_name)'
  sql += 'VALUES( "'+data.period+'","'+crt_date+'","'+data.gender+'","'+data.title+'","'+data.work_type+'","'+data.end_date+'","'+data.work_name+'" ,"'+data.max_count+'","'+data.pay+'"';
  sql += ',"'+data.pay_type+'","'+data.r_type+'","'+data.support_type+'","'+data.intro+'","'+data.r_phone+'" ,"'+data.media_sub+'","'+data.job_sub+'"';
  sql += ',"'+data.address_id+'","'+data.users_id+'","'+data.media_name+'","'+data.job_name+'","'+data.address_name+'")'
  }
  else{
    var sql = 'INSERT INTO recruitment(period,period_st,period_ed,register_date,gender,title,work_type,end_date,work_name,max_count,pay,pay_type,r_type,support_type,intro,r_phone,media_sub,job_sub,address_id,users_id,media_name,job_name,address_name)'
    sql += 'VALUES( "'+data.period+'","'+data.period_st+'","'+data.period_ed+'","'+crt_date+'","'+data.gender+'","'+data.title+'","'+data.work_type+'","'+data.end_date+'","'+data.work_name+'" ,"'+data.max_count+'","'+data.pay+'"';
    sql += ',"'+data.pay_type+'","'+data.r_type+'","'+data.support_type+'","'+data.intro+'","'+data.r_phone+'" ,"'+data.media_sub+'","'+data.job_sub+'"';
    sql += ',"'+data.address_id+'","'+data.users_id+'","'+data.media_name+'","'+data.job_name+'","'+data.address_name+'")'
  }
 
  console.log(sql);
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};
exports.insertReview = function(data, crt_date, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'INSERT INTO after(mark,content,users_id,register_date)VALUES( "'+data.mark+'","'+data.content+'","'+data.id+'","'+crt_date+'")';
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};
exports.insertMyHistory = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'INSERT INTO myhistory(users_id,start_date,end_date,introduct)VALUES( "'+data.users_id+'","'+data.start_date+'","'+data.end_date+'","'+data.introduct+'")';
  query(sql, function(err, rows, fields) {
    if (err) { 
        callback(false);
        return ; 
    } 
    var sql = 'SELECT * from myhistory where users_id="'+data.users_id+'"';   
    query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      }
      if(rows.length == 0){ 
          callback(false);
          return;
      } 
      callback(rows);
    }); 
  }); 
};

 

 
exports.updateEmploy = function(data, crt_date, callback) 
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE recruitment SET period="'+data.period+'",period_st="'+data.period_st+'",period_ed="'+data.period_ed+'", register_date="'+crt_date+'", gender="'+data.gender+'", title="'+data.title+'", work_type="'+data.work_type+'", end_date="'+data.end_date+'" '; 
  sql += ', work_name="'+data.work_name+'", max_count="'+data.max_count+'", pay="'+data.pay+'", pay_type="'+data.pay_type+'", r_type="'+data.r_type+'", support_type="'+data.support_type+'"'; 
  sql += ', intro="'+data.intro+'", r_phone="'+data.r_phone+'", media_sub="'+data.media_sub+'", job_sub="'+data.job_sub+'", address_id="'+data.address_id+'", media_name="'+data.media_name+'"'; 
  sql += ', media_name="'+data.media_name+'", job_name="'+data.job_name+'", address_name="'+data.address_name+'"'; 
  sql += ' where id = "'+data.id+'" '
 
  query(sql, function(err, rows, fields) {
      if (err) { 
          callback(false);
          return ; 
      } 
      callback(true);
  }); 
};

exports.updatePushState = function(data, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET '+data.column+'="'+data.val+'"  where id = "'+data.id+'" ';   
  query(sql, function(err, rows, fields) {
    
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
}; 

exports.updateSupporterStatus = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE support_list SET  status= "1" , select_date = "'+crt_date+'"  where id = "'+data.id+'" ';  
  
  query(sql, function(err, rows, fields) {
    
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.updateLastDate = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE users SET  last_time= "'+crt_date+'" ,chatting_id = "0" where id = "'+data.id+'" ';   
  query(sql, function(err, rows, fields) {
    
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};
exports.updateEmployStatus = function(data,crt_date, callback)
{
  callback = callback == null? nop:callback; 
  var sql = 'UPDATE recruitment SET  status=2 ,end_update_date =  "'+crt_date+'"  where id = "'+data.id+'" ';  
  
  query(sql, function(err, rows, fields) {
    
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
}; 

exports.updateMyInfo = function(data, crt_date, callback)
{
  callback = callback == null? nop:callback; 
  if(data.type==1){
    var sql = 'UPDATE users SET port_date = "'+crt_date+'", user_name="'+data.user_name+'",birth="'+data.birth+'",address_si="'+data.address_si+'",address_gu="'+data.address_gu+'"    ';  
    sql += ' ,homepage="'+data.homepage+'",intro="'+data.intro+'",age="'+data.age+'",gender="'+data.gender+'",profile="'+data.profile+'" '
    sql += ' ,media_name="'+data.media_name+'",job_name="'+data.job_name+'",address_detail="'+data.address_detail+'"  '
    sql += ' ,history_on_off="'+data.history_on_off+'",email_on_off="'+data.email_on_off+'",phone_on_off="'+data.phone_on_off+'"  '
    sql += ' ,time_on_off="'+data.time_on_off+'",start_time="'+data.start_time+'",end_time="'+data.end_time+'"  '
    sql += ' ,favor_area="'+data.favor_area+'" ,favor_job="'+data.favor_job+'" ,favor_media="'+data.favor_media+'" where id = "'+data.id+'"'
  }
  else{
    var sql = 'UPDATE users SET  b_no="'+data.b_no+'", cert="'+data.cert+'", user_name="'+data.user_name+'",business_name="'+data.business_name+'",address_si="'+data.address_si+'",address_detail="'+data.address_detail+'"    ';  
    sql += ' ,homepage="'+data.homepage+'",intro="'+data.intro+'",profile="'+data.profile+'" '
    sql += ' where id = "'+data.id+'"'
  } 
  console.log(sql);
  query(sql, function(err, rows, fields) {
    
    if (err) { 
        callback(false);
        return ; 
    } 
    callback(true);
  }); 
};  











 
 

exports.query = query;
