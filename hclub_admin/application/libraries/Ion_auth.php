<?php  
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Ion_auth
{
	/**
	 * CodeIgniter global
	 *
	 * @var string
	 **/
	protected $ci;

	/**
	 * account status ('not_activated', etc ...)
	 *
	 * @var string
	 **/
	protected $status;

	/**
	 * extra where
	 *
	 * @var array
	 **/
	public $_extra_where = array();

	/**
	 * extra set
	 *
	 * @var array
	 **/
	public $_extra_set = array();

	/**
	 * __construct
	 *
	 * @return void
	 * @author Ben
	 **/
	public function __construct()
	{
		$this->ci =& get_instance();
		$this->ci->load->config('ion_auth', TRUE);
		$this->ci->load->library('email');
		$this->ci->lang->load('ion_auth');
		$this->ci->load->model('ion_auth_model');
		$this->ci->load->helper('cookie');
	
		$email_config = array(
			'mailtype' => $this->ci->config->item('email_type', 'ion_auth')
		);
		$this->ci->email->initialize($email_config);

		$this->ci->ion_auth_model->trigger_events('library_constructor');
	}

	/**
	 * __call
	 *
	 * Acts as a simple way to call model methods without loads of stupid alias'
	 *
	 **/
	public function __call($method, $arguments)
	{
		if (!method_exists( $this->ci->ion_auth_model, $method) )
		{
			throw new Exception('Undefined method Ion_auth::' . $method . '() called');
		}

		return call_user_func_array( array($this->ci->ion_auth_model, $method), $arguments);
	}

	/**
	 * register
	 *
	 * @return void
	 * @author Mathew
	 **/
	public function register($username, $password, $additional_data = array(), $group_name = array()) //need to test email activation
	{
		$this->ci->ion_auth_model->trigger_events('pre_account_creation');

		$id = $this->ci->ion_auth_model->register($username, $password, $additional_data, $group_name);
		if ($id !== FALSE)
		{
			$this->set_message('account_creation_successful');
			$this->ci->ion_auth_model->trigger_events(array('post_account_creation', 'post_account_creation_successful'));
			return $id;
		}
		else
		{
			$this->set_error('account_creation_unsuccessful');
			$this->ci->ion_auth_model->trigger_events(array('post_account_creation', 'post_account_creation_unsuccessful'));
			return FALSE;
		}

	}

	/**
	 * logout
	 *
	 * @return void
	 * @author Mathew
	 **/
	public function logout()
	{
		$this->ci->ion_auth_model->trigger_events('logout');

		$identity = $this->ci->config->item('identity', 'ion_auth');
		$this->ci->session->unset_userdata($identity);
		$this->ci->session->unset_userdata('id');

		//delete the remember me cookies if they exist
		if (get_cookie('identity'))
		{
			delete_cookie('identity');
		}

		$this->ci->session->sess_destroy();

		$this->set_message('logout_successful');
		return TRUE;
	}

	/**
	 * logged_in
	 *
	 * @return bool
	 * @author Mathew
	 **/
	public function logged_in()
	{
		$this->ci->ion_auth_model->trigger_events('logged_in');

		$identity = $this->ci->config->item('identity', 'ion_auth');

		return (bool) $this->ci->session->userdata($identity);
	}
}