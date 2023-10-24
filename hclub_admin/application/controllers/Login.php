<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends MY_Controller {
	
	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{		
		$this->load->view('login/index.php', $this->data);
	}

	public function checkLogin() 
	{	
		$m_id = $this->input->post('m_id');
		$m_pw = $this->input->post('m_pw');
	
		if ($this->ion_auth->login($m_id, $m_pw))
			echo "success";
		else		
			echo "fail";			
	} 
	public function dashboard()
	{	
		$m_id = $this->input->post('m_id');
		$m_pw = $this->input->post('m_pw');
	
		if ($this->ion_auth->login($m_id, $m_pw))
			redirect('member/users', 'refresh');		
		else		
			redirect('login/index', 'refresh');
	}

	public function logout()
	{
		$logout = $this->ion_auth->logout();
		redirect($this->config->item('base_url'), 'refresh');
	}
	public function updatePassword()
	{
		$m_id = $this->session->userdata('account');

		$new_pw = $this->input->post_get('pw');

		if ($this->ion_auth->change_password($m_id, '', $new_pw))
			echo "success";
		else		
			echo "fail";
	}
}
