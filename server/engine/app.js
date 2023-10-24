var db = require('../utils/db');
var configs = require("../configs");
var http_service = require("./http_service");
var socket_service = require("./socket_service");

var config = configs.staffs_server();
db.init(configs.mysql());

var fcm = require('../utils/fcm');
fcm.initFirebase();

http_service.start(config);
socket_service.start(config);
