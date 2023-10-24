'use strict'
var db = require('../../utils/db');
var http = require('../../utils/http');

const authMiddleware = (req, res, next) => {
    // read the token from header or url 
    var token = req.headers['x-access-token'];
    var user_id = req.headers['x-access-ost']; 
    // token does not exist
    if(!token || !user_id) {
        http.send(res,0, "ok", {resulte:null});
        return ;
    }
    db.checkToken(user_id, token, function(retval) {
        if(retval === null)
        {
            http.send(res,101, "ok", {resulte:null});//로그인 할것
        }else{
            
            req.id = retval.id;
            req.usr_id = user_id;  
            req.uer_name = retval.user_name; 
            next();
        }
    });
}

module.exports = authMiddleware