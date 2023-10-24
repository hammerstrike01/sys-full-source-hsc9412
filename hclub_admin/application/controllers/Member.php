<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH."libraries/Pagination.php"; // include the pagination class

class Member extends MY_Controller {
	
	function __construct()
	{
		parent::__construct();

		if (!$this->ion_auth->logged_in())	
			redirect('login', 'refresh'); 
		$this->data['menu_data'] = array('setting' => 0, 'member' => 1, 'cuppon' => 0, 'matching' => 0, 'payment' => 0); 
		$this->load->model('Users_model');
		$this->load->model('Common_model'); 
	}
	
	public function users()
	{  
		$this->data['sub_menu'] = 'users';
		
		$cur_page = 1;
		$records_per_page = 50;

		$pagination = new Pagination();
				
		$cur_page_num = $this->input->post_get('cur_page_num');

		if($cur_page_num)
			$cur_page = $cur_page_num;
        
        $limit = " LIMIT ".(($cur_page-1)*$records_per_page).", ".$records_per_page;
 
        $st_date = $this->input->post_get('st_date');
		$ed_date = $this->input->post_get('ed_date');
        $search_info = $this->input->post_get('search_info');
        $status = 1;
        if($this->input->post_get('status'))
        $status = $this->input->post_get('status');
        
        $where = ' WHERE U.cert_profile=3 ';
        
        if ($search_info)
        {
			$where .= ' AND (U.email LIKE "%'.$search_info.'%" OR U.nick_name LIKE "%'.$search_info.'%"';
			$where .= ' OR U.user_name LIKE "%'.$search_info.'%" OR U.phone LIKE "%'.$search_info.'%" OR U.invite_code LIKE "%'.$search_info.'%" )';
        }
		if ($st_date)
			$where .= ' AND U.reg_date >= "'.$st_date.'"';
		if ($ed_date)
			$where .= ' AND U.reg_date <= "'.$ed_date.'"';
		if ($status<4)
			$where .= ' AND U.user_status = "'.$status.'"';
		
		$this->data['list'] = $this->Users_model->getUsersList($where, $limit);
    	$row = $this->Users_model->getTotalUsersCount($where);
		
        $total_cnt = 0;

        if (isset($row) > 0)
        	$total_cnt = $row->cnt;
        
        $this->data['st_date'] = $st_date;
        $this->data['status'] = $status;
        
		$this->data['ed_date'] = $ed_date;
        $this->data['search_info'] = $search_info;
        $this->data['total_cnt'] = $total_cnt;
		$this->data['cur_page'] = $cur_page;
        $this->data['records_per_page'] = $records_per_page;
        $this->data['total_page_cnt'] = ceil($total_cnt/(int)$records_per_page);
		$this->data['pagination'] = $pagination;
		
		$this->render();
	}
 	
	public function profile()
	{ 
		$this->data['sub_menu'] = 'profile';
		
		$cur_page = 1;
		$records_per_page = 50;

		$pagination = new Pagination();
				
		$cur_page_num = $this->input->post_get('cur_page_num');

		if($cur_page_num)
			$cur_page = $cur_page_num;
        
        $limit = " LIMIT ".(($cur_page-1)*$records_per_page).", ".$records_per_page;
 
        $st_date = $this->input->post_get('st_date');
		$ed_date = $this->input->post_get('ed_date');
        $search_info = $this->input->post_get('search_info');
        $status = $this->input->post_get('status');

        $where = ' WHERE cert_profile != 3';

        if ($search_info)
        {
			$where .= ' AND (U.email LIKE "%'.$search_info.'%" OR U.nick_name LIKE "%'.$search_info.'%"';
			$where .= ' OR U.user_name LIKE "%'.$search_info.'%" OR U.phone LIKE "%'.$search_info.'%" OR U.invite_code LIKE "%'.$search_info.'%" )';
        }
		if ($st_date)
			$where .= ' AND U.reg_date >= "'.$st_date.'"';
		if ($ed_date)
			$where .= ' AND U.reg_date <= "'.$ed_date.'"';
		if ($status)
			$where .= ' AND U.cert_profile = "'.$status.'"';
		
		$this->data['list'] = $this->Users_model->getProfileList($where, $limit);
    	$row = $this->Users_model->getTotalUsersCount($where);
		
        $total_cnt = 0;

        if (isset($row) > 0)
        	$total_cnt = $row->cnt;
        
        $this->data['st_date'] = $st_date;
        $this->data['status'] = $status;
        
		$this->data['ed_date'] = $ed_date;
        $this->data['search_info'] = $search_info;
        $this->data['total_cnt'] = $total_cnt;
		$this->data['cur_page'] = $cur_page;
        $this->data['records_per_page'] = $records_per_page;
        $this->data['total_page_cnt'] = ceil($total_cnt/(int)$records_per_page);
		$this->data['pagination'] = $pagination;

		$this->render(); 
	}
	public function userDetail()
	{ 
		$this->data['info'] = $this->Users_model->getUsersById($this->input->post_get('id'));
		$this->data['address'] = $this->Users_model->getAddressSido();
		$this->data['payment'] = $this->Users_model->getPaymentList($this->input->post_get('id'));
		$this->data['review'] = $this->Users_model->getReviewList($this->input->post_get('id'));
		// 후기 칭찬하기
		
		$this->data['badge'] = $this->Users_model->getBadgeList($this->input->post_get('id'));
		$gender = $this->data['info']->gender;
		$this->data['matching'] = $this->Users_model->getMatchingList($this->input->post_get('id'),$gender);

		$this->data['sub_menu'] = 'users';
		$this->render();
	}
 
	public function profileDetail()
	{
		$this->data['info'] = $this->Users_model->getUsersById($this->input->post_get('id'));
		$this->data['address'] = $this->Users_model->getAddressSido();
		$this->data['badge'] = $this->Users_model->getBadgeList($this->input->post_get('id'));

		$this->data['sub_menu'] = 'profile';

		$this->render();
	}
	public function updateDate()
	{
		if($this->input->post_get('cert_profile')){
			if($this->input->post_get('report_txt')){
				$data = array(
		        	'memo' => $this->input->post_get('memo'),
		        	'cert_profile' => $this->input->post_get('cert_profile'),
		        	'report' => $this->input->post_get('report_txt'),
		        	'cert_cnt' => $this->input->post_get('cnt'),
		        	'resend_status' => 0,
		    	);   
			}
			else{
				$data = array(
		        	'memo' => $this->input->post_get('memo'),
		        	'cert_profile' => $this->input->post_get('cert_profile'),
		        	'cert_cnt' => $this->input->post_get('cnt'),
		        	'resend_status' => 0,
		    	);
			} 
			if($this->input->post_get('cert_profile')==4){
	    		$title = '앱이름 심사결과 안내';
				$content = '심사결과: 초대거절  거절사유가 있는 경우 확인하여 보강 후 재신청해주세요.';
				$path = 'reviewReport';
				$id = $this->input->post_get('id');
				$memo = $this->input->post_get('report_txt');
				$returnUrl = $this->config->item('fcm_push').'?id='.$id.'&title='.urlencode($title).'&content='.urlencode($content).'&path='.$path.'&type=1&memo='.urlencode($memo);
				
			 	$isPost = false;
			 	$ch = curl_init();
			 	curl_setopt($ch, CURLOPT_URL, $returnUrl);
			 	curl_setopt($ch, CURLOPT_POST, $isPost);
			 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			 	curl_setopt($ch, CURLOPT_ENCODING, "");
			 	curl_exec($ch);
			 	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			 	curl_close ($ch); 
	    	}  
	    	if($this->input->post_get('cert_profile')==3){
	    		$title = '앱이름 심사결과 안내';
				$content = '심사결과: 초대 합격 축하드립니다! 앱이름 심사에 합격하셨습니다.';
				$path = 'review';
				$id = $this->input->post_get('id');
				$returnUrl = $this->config->item('fcm_push').'?id='.$id.'&title='.urlencode($title).'&content='.urlencode($content).'&path='.$path.'&type=1';
				
			 	$isPost = false;
			 	$ch = curl_init();
			 	curl_setopt($ch, CURLOPT_URL, $returnUrl);
			 	curl_setopt($ch, CURLOPT_POST, $isPost);
			 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			 	curl_setopt($ch, CURLOPT_ENCODING, "");
			 	curl_exec($ch);
			 	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			 	curl_close ($ch); 
	    	}
		}
		else{
			$data = array(
				'cert_profile' =>$this->input->post_get('cert_profile'),
	        	'memo' => $this->input->post_get('memo'),
	        	'cert_cnt' => $this->input->post_get('cnt'),
	        	'user_status' => $this->input->post_get('user_status'),
	        	'resend_status' => 0,
	    	);
		}
		
    	$result = $this->Common_model->updateData('users', $this->input->post_get('id'), $data);

		if ($result)
			echo $returnUrl;// "success";
		else
			echo "fail";
	}
	public function updateProfile()
	{
		$data = array(
        	'admin_intro' => $this->input->post_get('admin_intro'),
        	'admin_memo' => $this->input->post_get('admin_memo'),

        	'address_sido' => $this->input->post_get('address_sido'),
        	'address_gugun' => $this->input->post_get('address_gugun'),
        	'active_sido' => $this->input->post_get('active_sido'),
        	'active_gugun' => $this->input->post_get('active_gugun'),
        	// 'cert_cnt' => $this->input->post_get('cnt')
    	);

    	$result = $this->Common_model->updateData('profile', $this->input->post_get('id'), $data);

		if ($result)
			echo "success";
		else
			echo "fail";
	}
	public function addProfile()
	{
		$dir = $this->config->item('img_path');
		$data['sel_profile'] = '' ; 
		if(isset($_FILES['img']) && !$_FILES['img']['error'])
		{
			$path_parts = pathinfo($_FILES['img']["name"]);
			$img = "banner".time().".".$path_parts['extension'];

			if(move_uploaded_file($_FILES['img']['tmp_name'], $dir.$img)){
				if($this->input->post_get('oldImg')){
					$data['sel_profile'] = $this->input->post_get('oldImg')."," ;
				}
				$data['sel_profile'] = $img;
			}
		}
		$this->Common_model->updateData('profile', $this->input->post_get('id'), $data);
		echo $img;

	}
	public function getAddressGugun()
	{
		$resut = $this->Common_model->getDataList('address_gu', 'id', ' where sido_id="'.$this->input->post_get('id').'" ', '');
		echo json_encode($resut); 
	}
	public function deleteUser()
	{
		$this->Common_model->deleteData('users',$this->input->post_get('id'));
		$this->Common_model->allData($this->input->post_get('id'));
		echo "success"; 
	}
	public function resetUser()
	{
		$data['user_status'] = 1;
		$this->Common_model->updateData('users',$this->input->post_get('id'),$data);
		
		echo "success"; 
	}
	
	public function downloadFile()
	{
		// $id = $this->input->post_get('id');
		$names = explode(",", $this->input->post_get('names'));
		$files1 = $this->input->post_get('files1');
		
		if($files1){
			$files = explode(",", $files1); 
			$tmpFile = tempnam('./upload', ''); 
			$zip = new ZipArchive;
			$zip->open($tmpFile, ZipArchive::CREATE);
			foreach ($files as $file) { 
			    $fileContent = file_get_contents($this->config->item('img_path').$file); 
			    $zip->addFromString(basename($this->config->item('img_path').$file), $fileContent);
			}
			$zip->close(); 
			header('Content-Type: application/zip');
			header('Content-disposition: attachment; filename='.$names[0].'.zip');
			header('Content-Length: ' . filesize($tmpFile));
			readfile($tmpFile); 
			unlink($tmpFile); 
		}
		redirect('member/profile', 'refresh');
 
	}
	
	public function updateBadgeCert()
	{
		if($this->input->post_get('cert_profile')){  
			if($this->input->post_get('report_txt')){
				$data1 = array( 
		        	'cert_profile' => $this->input->post_get('cert_profile'),
		        	'report' => $this->input->post_get('report_txt'),
		        	'resend_status' => 0,
		        	'cert_cnt' => $this->input->post_get('cnt')
		    	); 
			}
			else{
				$data1 = array( 
		        	'cert_profile' => $this->input->post_get('cert_profile'),
		        	'resend_status' => 0,
		        	'cert_cnt' => $this->input->post_get('cnt')
		    	);
			} 
			if($this->input->post_get('cert_profile')==4){
	    		$title = '앱이름 심사결과 안내';
				$content = '심사결과: 초대거절  거절사유가 있는 경우 확인하여 보강 후 재신청해주세요.';
				$path = 'reviewReport';
				$memo = $this->input->post_get('report_txt');
				$id = $this->input->post_get('u_id');
				$returnUrl = $this->config->item('fcm_push').'?id='.$id.'&title='.urlencode($title).'&content='.urlencode($content).'&path='.$path.'&type=1&memo='.urlencode($memo);
				
			 	$isPost = false;
			 	$ch = curl_init();
			 	curl_setopt($ch, CURLOPT_URL, $returnUrl);
			 	curl_setopt($ch, CURLOPT_POST, $isPost);
			 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			 	curl_setopt($ch, CURLOPT_ENCODING, "");
			 	curl_exec($ch);
			 	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			 	curl_close ($ch); 
	    	}  
	    	if($this->input->post_get('cert_profile')==3){
	    		$title = '앱이름 심사결과 안내';
				$content = '심사결과: 초대 합격  축하드립니다! 앱이름 심사에 합격하셨습니다.';
				$path = 'review';
				$id = $this->input->post_get('u_id');
				$returnUrl = $this->config->item('fcm_push').'?id='.$id.'&title='.urlencode($title).'&content='.urlencode($content).'&path='.$path.'&type=1';
				
			 	$isPost = false;
			 	$ch = curl_init();
			 	curl_setopt($ch, CURLOPT_URL, $returnUrl);
			 	curl_setopt($ch, CURLOPT_POST, $isPost);
			 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			 	curl_setopt($ch, CURLOPT_ENCODING, "");
			 	curl_exec($ch);
			 	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			 	curl_close ($ch); 
	    	} 
			$this->Common_model->updateData('users', $this->input->post_get('u_id'), $data1); 
		}
		else{
			$data1 = array(  
	        	'cert_cnt' => $this->input->post_get('cnt')
	    	);
			$this->Common_model->updateData('users', $this->input->post_get('u_id'), $data1); 
		}
		 
		$data = array(
        	'b_status1' => $this->input->post_get('b_status1'),
        	'b_status2' => $this->input->post_get('b_status2'),
        	'b_status3' => $this->input->post_get('b_status3'),
        	'b_status4' => $this->input->post_get('b_status4'),
        	'b_status5' => $this->input->post_get('b_status5'),
        	'b_status6' => $this->input->post_get('b_status6'),
        	'b_status7' => $this->input->post_get('b_status7'),
        	'b_status8' => $this->input->post_get('b_status8'),
        	'b_status9' => $this->input->post_get('b_status9'),
        	'b_status10' => $this->input->post_get('b_status10'),
        	'b_status11' => $this->input->post_get('b_status11'),
        	'b_status12' => $this->input->post_get('b_status12'),
        	'b_status13' => $this->input->post_get('b_status13'),
        	'b_status14' => $this->input->post_get('b_status14'),
        	'b_status15' => $this->input->post_get('b_status15'),
        	'b_status16' => $this->input->post_get('b_status16'),
        	'b_status17' => $this->input->post_get('b_status17'),
        	'b_status18' => $this->input->post_get('b_status18'),
        	'b_status19' => $this->input->post_get('b_status19'),
    	);	
		
    	$result = $this->Common_model->updateData('badge_cert', $this->input->post_get('id'), $data);
 
		if ($result)
			echo 'success';
		else
			echo "fail";

	}
	
	
	
	
}
