var admin = require("firebase-admin");
const async = require("async");
var serviceAccount = require("./service_key.json");
const aligosms = require("./aligo_sms");
var fcmapp = null;

exports.initFirebase = function()
{
    fcmapp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
};

// exports.sendMessage = function(token, title, body, msgdata)
// {
//     try {
//         const message = {
//             token: token,
//             notification: {
//                 title: title,
//                 body: body, 
//             },
//         };
//         if(msgdata != null) {
//             Object.keys(msgdata).forEach(function(el){
//                 msgdata[el] = (msgdata[el])+''
//             })
//             message.data = msgdata;
//         };
        
//         fcmapp.messaging().send(message).then((response) => {
//             console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//             console.log('Error sending message:', error);
//         });
        
//     } catch (error) {
//         console.log('fcm error:', error)
//     }
// };
exports.sendMessage = function(token, title, body, msgdata)
{
    console.log(token, title, body, msgdata)
    try {
        const message = {
            token: token,
            notification: {
                title: title,
                body: body
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: Number(msgdata.msgCnt),
                    },
                },
            },
        };
        if(msgdata != null)
        {
            Object.keys(msgdata).forEach(function(el){
                msgdata[el] = (msgdata[el])+''
            })
            message.data = msgdata;
        };
        
        fcmapp.messaging().send(message).then((response) => {
            // console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
        
    } catch (error) {
        console.log('fcm error:', error)
    }
}
exports.sendmultiFCM = function(token, title, body, msgdata)
{
    var r_tokens = token.filter((item) => item != null && item != "" );
    var message = {
        tokens: r_tokens,
        notification: {
            title: title,
            body: body,
        },
    };

    if(msgdata != null)
    {
        message.data = msgdata;
    }

    fcmapp.messaging().sendMulticast(message).then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(r_tokens[idx]);
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
    });
};
exports.sendSMS = function ( phones, msg, callback=()=>{} ) {
    if(!phones) {
        callback(false);
        return;
    }
    let arrPhone = phones ? phones.split(',') : [];
    // 
    let arrFunctions = [];
    let callbackFn = function(hps) {
        return function (cb) {
            var smsreq = {
                body : {
                    receiver: hps,    // , 로 구분
                    msg: '[그린라이트] ' + msg
                }
            };
            aligosms.send(smsreq, (ret) => {
                // if(ret != null)
                //     callback(true);     // success
                // else
                //     callback(false);
                cb(null);
            });
        };
    }
    for (let i = 0; i < arrPhone.length; i += 999) {
        const hps = arrPhone.slice(i, i + 999);
        arrFunctions.push(callbackFn(hps.join()));
    }
    async.parallel(
        arrFunctions,
        function(err, rst) { }
    );
    // 
}
