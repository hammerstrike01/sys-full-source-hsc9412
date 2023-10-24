

<?php

$fullPath = __FILE__;
// $UPLOAD_PATH = '/var/www/html/doit_uploads/';		// remote
// define("SERVER_SUB", "http://map2159.vps.phps.kr/doit_uploads/");

$UPLOAD_PATH = "/var/www/html/dreamRider_admin/upload/";

define("SERVER_SUB", "http://183.111.227.112/dreamRider_admin/upload/");

// $UPLOAD_PATH = "C://xampp/htdocs/doit_uploads/";
// define("SERVER_SUB", "http://192.168.3.66/doit_uploads/");

$sFileInfo = '';
$headers = array();
 
foreach($_SERVER as $k => $v) {
	if(substr($k, 0, 9) == "HTTP_FILE") {
		$k = substr(strtolower($k), 5);
		$headers[$k] = $v;
	} 
}

$filename = rawurldecode($headers['file_name']);
$filename_ext = strtolower(array_pop(explode('.',$filename)));
$allow_file = array("jpg", "png", "bmp", "gif"); 

if(!in_array($filename_ext, $allow_file)) {
	echo "NOTALLOW_".$filename;
} else {
	$file = new stdClass;
	$file->name = 'p_'.time().'.'.$filename_ext;	// 파일명 변경
	$file->content = file_get_contents("php://input");

	if( ! file_exists($UPLOAD_PATH)) {
	    $mask=umask(0);
	    mkdir($UPLOAD_PATH, 0777);
	    umask($mask);
	}
	$newPath = $UPLOAD_PATH.$file->name;

	if(file_put_contents($newPath, $file->content)) {
		$sFileInfo .= "&bNewLine=true";
		$sFileInfo .= "&sFileName=".$file->name;
		$sFileInfo .= "&sFileURL=".SERVER_SUB.$file->name;
	}

	echo $sFileInfo;
}
?>

 