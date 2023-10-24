<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends MY_Controller {
	
	function __construct()
	{
		parent::__construct();
		$this->load->model('Users_model');
	}

	public function getAuthNum()
	{
		$phone = $this->input->post_get('phone_num');			
		$auth = mt_rand(100000, 999999);
		
		// 발송 URL
		$sms_url = "http://sslsms.cafe24.com/sms_sender.php";

		// 계정 정보
		$sms['user_id'] = base64_encode($this->config->item('sms_user_id')); //계정아이디
		$sms['secure'] = base64_encode($this->config->item('sms_secure')); // 인증키 

		// 메시지 내용
		$sms['msg'] = base64_encode("h-club 인증번호 : ".$auth);

		// 받는 번호
		$rphone1 = substr($phone, 0, 3);
		$rphone2 = substr($phone, 3, 4);
		$rphone3 = substr($phone, 7, 4);

		$sms['rphone'] = base64_encode($rphone1."-".$rphone2."-".$rphone3);
		
		// 보내는 번호
		$sms['sphone1'] = base64_encode(substr($this->config->item('sphone'), 0, 3));
		$sms['sphone2'] = base64_encode(substr($this->config->item('sphone'), 4, 4));
		$sms['sphone3'] = base64_encode(substr($this->config->item('sphone'), 9, 4));
		
		// base64_encode 사용시 반드시 1로 세팅할 것
		$sms['mode'] = base64_encode("1");

		// 경로 설정
		$host_info = explode("/", $sms_url);
		$host = $host_info[2];
		$path = $host_info[3];

		$boundary = "---------------------".substr(md5(rand(0,32000)),0,10);

		// 헤더 생성
		$header = "POST /".$path ." HTTP/1.0\r\n";
		$header .= "Host: ".$host."\r\n";
		$header .= "Content-type: multipart/form-data, boundary=".$boundary."\r\n";

		$data = "";
		// 본문 생성
		foreach($sms AS $index => $value)
		{
			// echo "sms[$index] : ". base64_decode($value). "<br>";
			$data .="--$boundary\r\n";
			$data .= "Content-Disposition: form-data; name=\"".$index."\"\r\n";
			$data .= "\r\n".$value."\r\n";
			$data .="--$boundary\r\n";
		}

		$header .= "Content-length: " . strlen($data) . "\r\n\r\n";

		// 보내기
		$fp = fsockopen($host, 80);

		$status = "fail";
		$alert = "";
		
	    if ($fp) 
	    { 
	        fputs($fp, $header.$data);
	        $rsp = '';

	        while(!feof($fp)) 
	        { 
	            $rsp .= fgets($fp,8192); 
	        }

	        fclose($fp);

			$msg = explode("\r\n\r\n",trim($rsp));
			$rMsg = explode(",", $msg[1]);

			$Result= $rMsg[0]; //발송결과
			$Count= $rMsg[1]; //잔여건수

			//발송결과 알림
	        if($Result=="success") 
	        {
	            $alert = "성공";
	            $alert .= " 잔여건수는 ".$Count."건 입니다.";
	            $status = "success";
	        }
	        else if($Result=="reserved")
	        {
	            $alert = "성공적으로 예약되었습니다.";
	            $alert .= " 잔여건수는 ".$Count."건 입니다.";
	        }
	        else if($Result=="3205")
	        {
	            $alert = "잘못된 번호형식입니다.";
	        }
			else if($Result=="0044")
			{
	            $alert = "스팸문자는발송되지 않습니다.";
	        }
	        else
	        {        	
	            $alert = "[Error]".$Result;
	        }
		}
	    else
	    {    	
	        $alert = "Connection Failed";
	    }
		// echo $Result;
		// exit;
		
		if($status == "success")
			echo $auth;			
		else
			echo "fail";
		// echo "1234";
	}
   
    public function send_email()
	{    
    	$email =$this->input->post_get('email');
		$rand_num = mt_rand(100000, 999999);
    	
		//Load email library
		$this->load->library('email');
		
        $config = Array(
          	'protocol' => 'smtp',
          	'smtp_host' => 'ssl://smtp.gmail.com', //smtp.gmail.com  //'ssl://smtp.googlemail.com',
          	'smtp_port' => 465,
          	'smtp_user' => $this->config->item('smtp_user'), // change it to yours
          	'smtp_pass' => $this->config->item('smtp_pass'), // change it to yours
          	'mailtype' => 'html',
          	'charset' => 'utf-8',
          	'wordwrap' => TRUE,
          	'crlf' => "\r\n",
          	'newline' => "\r\n" 
          	 
        ); 

		$this->email->initialize($config);
		$this->email->set_mailtype("html");
		$this->email->set_newline("\r\n");
		
		//Email content
		$htmlContent = '<h3>h-club 인증번호</h3>';
		$htmlContent .= '<p>'.$rand_num.'</p>';
		
		$this->email->from($this->config->item('smtp_user'),'h-club');
		$this->email->to($email);
		$this->email->subject('h-club 인증번호 안내입니다.');
		$this->email->message($htmlContent);
        
        if($this->email->send()){
            echo $rand_num;
        }
        else
        	echo $this->email->print_debugger();
 	}
}
