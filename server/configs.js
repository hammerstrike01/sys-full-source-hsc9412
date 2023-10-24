var IP = "192.168.3.74";
var HTTP_PORT = 3041;
const SOCKET_PORT = 3333;
var API_URL = "http://192.168.3.74/hclub_admin/Api"; 
var IMG_PATH = "D:/xampp/htdocs/hclub_admin/upload/"; 

exports.mysql = function(){
	return {
		HOST:'localhost',
		USER:'root',
		PSWD:'',
		DB:'db_name', 
		PORT:3306,
	}
};

 
exports.staffs_server = function(){
	return {
		SERVER_IP: IP,
		HTTP_PORT: HTTP_PORT,
		SOCKET_PORT: SOCKET_PORT,
		API_URL: API_URL,
		IMG_PATH:IMG_PATH,
	};
};


exports.jwtObj = function(){
	return {
		secret:"securistkey",
	  };
};

exports.aligo = {
	apikey: "",
	userid: "",
	sender: "",
	adminphone: "",
	// senderkey: "ae4ccd5bcfae6e5719da9262a731423e910ba53d",
};