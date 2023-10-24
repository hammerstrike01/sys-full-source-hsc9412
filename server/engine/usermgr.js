var roomSocketList = {};

exports.addSocket = function(roomId, userId, socket) {
    if (!roomSocketList['room'+roomId])
        roomSocketList['room'+roomId] = {};

    if (!roomSocketList['room'+roomId]['user'+userId])
        roomSocketList['room'+roomId]['user'+userId] = null;

    roomSocketList['room'+roomId]['user'+userId] = socket;    
};

exports.delSocket = function(roomId, userId) {
    delete roomSocketList['room'+roomId]['user'+userId];
};

exports.sendMsg = function(roomId, userId, event, msgData) {    
    let socket = roomSocketList['room'+roomId]['user'+userId];

    if (socket == null)
        return;

    socket.emit(event, msgData);
};

exports.roomSendMsg = function(roomId, event, msgData) {    
    Object.values(roomSocketList['room'+roomId]).forEach(socket => {        
        if (socket) {
            socket.emit(event, msgData);
        }
    });    
};