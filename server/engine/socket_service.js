const userMgr = require('./usermgr');
const db = require('../utils/db');
var fcm = require("../utils/fcm");
// var common = require("./common");
var io = null;

exports.start = function(config) {	
	io = require('socket.io')(config.SOCKET_PORT);
	
	io.sockets.on('connection', function(socket) {		
		socket.on('disconnect', function() {			
			if (socket.roomId && socket.userId) {
				userMgr.delSocket(socket.roomId, socket.userId);
				socket.roomId = null;
				socket.userId = null;				
			}
		});

		socket.on('connect_chat', function(data) {	
			if(!data.userId || !data.roomId)
				return;
			
			socket.roomId = data.roomId;
			socket.userId = data.userId;			
			userMgr.addSocket(data.roomId, data.userId, socket);
				
			db.getChatListByRoomId(data.roomId, function(result) {						
				userMgr.sendMsg(data.roomId, data.userId, 'receive_chat_list', result);
			});
		});
		
		socket.on('send_message', function(data) {
			// fcm 추가하기  
			db.getUserToken(data.sendId,data.roomId, function (userInfo) {   
				var title = data.nickname+'님의 만남 메시지 도착';
				var content = ''
				content+= '메시지 내용 : '
				content+= '“'+data.content+'”'
				content+= '-------------';
				content+= '상대방이 님이 답장을 기다리고 계십니다.'
				content+= '답장이 1시간 이상 늦어지면 약속 취소로 오해받을 수 있으니, 지금 바로 앱에서 답장 톡을 남겨주세요.'

				fcm.sendMessage(userInfo.push_id, title, content, {msgCnt: userInfo.push_cnt+1,path:"matching",});
				 

			});

			db.addChatMsg(data, function(result) {				
				userMgr.roomSendMsg(data.roomId, 'receive_new_msg', result);
			});
		});

		socket.on('read_msg', function(data) {
			db.readChatHistory(data.roomId, data.oUserId, function(result) {						
				userMgr.sendMsg(data.roomId, data.oUserId, 'receive_read_msg', true);
			});
		});
	});

	console.log("Socket server is running on " + config.SOCKET_PORT);	
};