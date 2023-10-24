'use strict'
const router = require('express').Router();
var formidable = require('formidable');
var db = require('../../utils/db');
var http = require('../../utils/http');
var configs = require("../../configs");
var common = require("../common");
var fs = require("fs");
var request = require("request");
var async = require("async"); 
var fcm = require("../../utils/fcm");

//---------------딜러 기업 공유 API------------------
//가입정보 추가
router.post('/testurl', function(req,res){
    var form = new formidable.IncomingForm();
    form.multiples = true;

   form.parse(req, function (err, fields, files) {
        var usr_company = fields.testval;
        var usr_id = req.usr_id;
        var usr_email = req.usr_email; 
        http.send(res,0, "OK", {resulte:true});
   });
   // log any errors that occur
   form.on('error', function(err) {
       console.log('editcompany An error has occured: \n' + err);
   });
});

router.post("/getMyInfoHistoryState", function (req, res) {
 
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMyInfoHistoryState(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyInfoHistoryState: " + err);
  }); 
}); 
router.post("/getMyInfoPushStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMyInfoPushStatus(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyInfoPushStatus: " + err);
  }); 
});
router.post("/updatePushState", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.updatePushState(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updatePushState: " + err);
  }); 
}); 
router.post("/checkPassword", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.checkPassword(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("checkPassword: " + err);
  }); 
});
router.post("/updatePassword", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.updatePassword(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updatePassword: " + err);
  }); 
}); 
router.post("/insertReview", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertReview(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertReview: " + err);
  }); 
});
router.post("/getMyInfo", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMyInfo(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyInfo: " + err);
  }); 
});
router.post("/insertMyHistory", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.insertMyHistory(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertMyHistory: " + err);
  }); 
});
router.post("/insertMyHistory", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.insertMyHistory(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertMyHistory: " + err);
  }); 
});
router.post("/getMyHistoryList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMyHistoryList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMyHistoryList: " + err);
  }); 
});
router.post("/deleteMyHistory", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.deleteMyHistory(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteMyHistory: " + err);
  }); 
});
router.post("/getAddressSidoList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getAddressSidoList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAddressSidoList: " + err);
  }); 
});
router.post("/getAddressGugun", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getAddressGugun(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAddressGugun: " + err);
  }); 
});
router.post("/getMediaList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMediaList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMediaList: " + err);
  }); 
});
router.post("/updateLastDate", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.updateLastDate(fields,reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateLastDate: " + err);
  }); 
});

router.post("/getMediaPortfolioList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getMediaPortfolioList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMediaPortfolioList: " + err);
  }); 
});

router.post("/outChatingRoom", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.outChatingRoom(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("outChatingRoom: " + err);
  }); 
});
router.post("/getRoomStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getRoomStatus(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getRoomStatus: " + err);
  }); 
});

router.post("/updateViewsUsers", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.updateViewsUsers(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateViewsUsers: " + err);
  }); 
}); 
router.post("/getJobList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, function (err, fields, files) {
    db.getJobList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getJobList: " + err);
  }); 
});
router.post("/insertEmploy", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertEmploy(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertEmploy: " + err);
  }); 
});
router.post("/updateEmployStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.updateEmployStatus(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateEmployStatus: " + err);
  }); 
});
router.post("/updateEmploy", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.updateEmploy(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateEmploy: " + err);
  }); 
});
router.post("/deleteEmploy", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.deleteEmploy(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteEmploy: " + err);
  }); 
}); 
router.post("/deleteScrap", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.deleteScrap(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteScrap: " + err);
  }); 
}); 
router.post("/insertScrap", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertScrap(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertScrap: " + err);
  }); 
}); 

router.post("/getEmploySupportTotal", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getEmploySupportTotal(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getEmployStatus: " + err);
  }); 
});
router.post("/getEmployStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getEmployStatus(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getEmployStatus: " + err);
  }); 
});
router.post("/getAlarmList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getAlarmList(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAlarmList: " + err);
  }); 
});

router.post("/getAlarmStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getAlarmStatus(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAlarmStatus: " + err);
  }); 
});
router.post("/getMediaPages", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getMediaPages(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getMediaPages: " + err);
  }); 
});

router.post("/deleteAlarmList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.deleteAlarmList(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteAlarmList: " + err);
  }); 
});
router.post("/getBusinessName", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getBusinessName(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getBusinessName: " + err);
  }); 
});
router.post("/alertNoViewCntByUserId", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.alertNoViewCntByUserId(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("alertNoViewCntByUserId: " + err);
  }); 
});

router.post("/getAddressSido", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getAddressSido(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getAddressSido: " + err);
  }); 
});
router.post("/deleteSupport", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.deleteSupport(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteSupport: " + err);
  }); 
});
router.post("/getPushCount", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) {
    db.getPushCount(fields,  function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getPushCount: " + err);
  }); 
});
router.post("/certSend", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  form.parse(req, function (err, fields, files) { 
    var url   = configs.staffs_server().API_URL; 
    var b_no = fields.businessNumber
    request(
      {
        method: "POST",
        uri: url+"/sendBusnessNumber",
        headers: { "content-Type": "multipart/form-data" },
        json: true,
        formData: {
          b_no: b_no,
        }, 
      },
      function (error, response, html) { 
        var result = response.body; 
        console.log(result)
        http.send(res, 0, "ok", { result: result });
      }
    ); 
  });
  form.on("error", function (err) {
    console.log("certSend: " + err);
  }); 
});



router.post('/sendFcm', function(req, res){   
  // 알림목록 추가하기
  console.log(111)
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    var crt_date = common.getCurrentTime(); 
    console.log(crt_date)
    db.getUserInfo(fields.users_id,crt_date,fields.content,fields.room_id, function (userInfo) {  
      if(userInfo && userInfo.push_id != ""&& userInfo.push_id != null && userInfo.history_push_on_off==1) {  
        // 이동경로 정하기 
        fcm.sendMessage(userInfo.push_id, "[올스탭스]알림", fields.content, {msgCnt: userInfo.push_cnt+1,path:fields.path,
        oUserId: fields.oUserId, oNickName: fields.oUserId, type: fields.type, room_id:fields.room_id,s_cnt:fields.s_cnt
        });
        db.updatePushCnt(fields.users_id, function (result) {
          http.send(res, 0, "ok");
        });
      }
      else http.send(res, 0, "ok");
    });
  });
  form.on("error", function (err) {
    console.log("sendFcm: " + err);
  });
});
router.post("/insertSupport", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true; 
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertSupport(fields, reg_time, function (result) { 
      // 알림 발송하기
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertSupport: " + err);
  }); 
});
router.post("/getPortfolioState", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getPortfolioState(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getPortfolioState: " + err);
  }); 
});
router.post("/getScrapStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getScrapStatus(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getScrapStatus: " + err);
  }); 
});
router.post("/getSupportList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getSupportList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getSupportList: " + err);
  }); 
});
router.post("/getSupportPages", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getSupportPages(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getSupportPages: " + err);
  }); 
});
router.post("/getEmployListTotal", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getEmployListTotal(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getEmployListTotal: " + err);
  }); 
});
router.post("/getPortfolioListTotal", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getPortfolioListTotal(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getPortfolioListTotal: " + err);
  }); 
});
router.post("/getChattingRoomId", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getChattingRoomId(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getChattingRoomId: " + err);
  }); 
});
router.post("/updateSubscript", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.updateSubscript(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateSubscript: " + err);
  }); 
});
router.post("/getCommunitySubscript", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getCommunitySubscript(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getCommunitySubscript: " + err);
  }); 
});
router.post("/updateViews", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.updateViews(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateViews: " + err);
  }); 
});
router.post("/getCommentList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getCommentList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getCommentList: " + err);
  }); 
});
router.post("/getCommentTotals", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getCommentTotals(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getCommentTotals: " + err);
  }); 
});
router.post("/deleteCommunity", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.deleteCommunity(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteCommunity: " + err);
  }); 
});
router.post("/deleteComment", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.deleteComment(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteComment: " + err);
  }); 
});
router.post("/updateComment", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.updateComment(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateComment: " + err);
  }); 
});
router.post("/sendStopResult", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.sendStopResult(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("sendStopResult: " + err);
  }); 
});
router.post("/getBlockList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getBlockList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getBlockList: " + err);
  }); 
});
router.post("/deleteBlockList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.deleteBlockList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("deleteBlockList: " + err);
  }); 
});
router.post("/getReviewList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getReviewList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getReviewList: " + err);
  }); 
});
router.post("/getReviewDetail", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getReviewDetail(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getReviewDetail: " + err);
  }); 
});
router.post("/getBusinessReviewList", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getBusinessReviewList(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getBusinessReviewList: " + err);
  }); 
});
router.post("/getUserReview", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getUserReview(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getUserReview: " + err);
  }); 
});
router.post("/getReviewBySId", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getReviewBySId(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getReviewBySId: " + err);
  }); 
});





router.post("/insertReviews", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertReviews(fields,reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertReviews: " + err);
  }); 
}); 
router.post("/updateSupporterStatus", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.updateSupporterStatus(fields,reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("updateSupporterStatus: " + err);
  }); 
}); 
router.post("/insertReport", function (req, res) { 
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertReport(fields,reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertReport: " + err);
  }); 
});





router.post("/insertComment", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.insertComment(fields,reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("insertComment: " + err);
  }); 
});
 
router.post("/createChattingRoom", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  let reg_time = common.getCurrentTime();
  form.parse(req, function (err, fields, files) {
    db.createChattingRoom(fields, reg_time, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("createChattingRoom: " + err);
  }); 
});
router.post("/getSupporters", function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiples = true;  
  form.parse(req, function (err, fields, files) {
    db.getSupporters(fields, function (result) { 
      if (result) http.send(res, 0, "ok", { result: result });
      else http.send(res, 0, "ok", { result: false });
    });
  });
  form.on("error", function (err) {
    console.log("getSupporters: " + err);
  }); 
});
router.post('/insertCommunity', function(req, res){  
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
router.post('/updateCommunity', function(req, res){  
  var form = new formidable.IncomingForm();
  form.multiples = true;
    form.parse(req, function (err, fields, files) {        
        if(fields.img_list == ''){
            let reg_time = common.getCurrentTime();
            db.updateCommunity(fields, reg_time, function(result) {            
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
            // var filepath = 'D:/xampp/htdocs/rcroom_admin/upload/';
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
                let reg_time = common.getCurrentTime();
                db.updateCommunity(fields, reg_time, function(result) {            
                    if(result)
                        http.send(res, 0, "ok", {result: result});
                    else
                        http.send(res, 0, "ok", {result: false});
                });
            });
        }         
  }); 
    form.on('error', function(err) {
    console.log('updateCommunity: '+err);
  });
});










 




router.post('/updateMyInfo', function(req, res){	
	var form = new formidable.IncomingForm();
	form.multiples = true;
  let  crt_date =  common.getCurrentTime();
    form.parse(req, function (err, fields, files) {        
        if(fields.img_list == ''){ 
          console.log('fields.img_list',fields.img_list)
            db.updateMyInfo(fields, crt_date,  function(result) {            
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
            // var filepath = 'D:/xampp/htdocs/rcroom_admin/upload/';
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

                fields.profile = image_name_arr.join(); 
                db.updateMyInfo(fields, crt_date,  function(result) {            
                    if(result)
                        http.send(res, 0, "ok", {result: result});
                    else
                        http.send(res, 0, "ok", {result: false});
                });
            });
        }         
	});	
    form.on('error', function(err) {
		console.log('updateMyInfo: '+err);
	});
});






module.exports = router