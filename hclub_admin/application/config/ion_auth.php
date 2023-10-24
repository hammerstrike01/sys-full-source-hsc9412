<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	$config['tables']['member']  = 'admin';
	
	$config['hash_method'] = 'sha1';		// IMPORTANT: Make sure this is set to either sha1 or bcrypt 
	
	$config['default_rounds'] = 8;		// This does not apply if random_rounds is set to true

	$config['site_title']		   = "Example.com";

	$config['default_group']       = 'members';

	/**
	 * A database column which is used to
	 * login with.
	 **/
	$config['identity']            = 'account';
		 
	/**
	 * Minimum Required Length of Password
	 **/
	$config['min_password_length'] = 8;
	
	/**
	 * Maximum Allowed Length of Password
	 **/
	$config['max_password_length'] = 20;

	/**
	 * Manual Activation for registration
	 **/
	$config['manual_activation']    = false;
	
	/**
	 * Allow users to be remembered and enable auto-login
	 **/
	$config['remember_users']      = true;
	
	/**
	 * How long to remember the user (seconds)
	 **/
	$config['user_expire']         = 86500;
	
	/**
	 * Extend the users cookies everytime they auto-login
	 **/
	$config['user_extend_on_login'] = false;

	/**
	 * Send Email using the builtin CI email class
	 * if false it will return the code and the identity
	 **/
	$config['use_ci_email']= FALSE;

	/**
	 * Email content type
	 **/
	$config['email_type']           = 'html';

	/**
	 * Salt Length
	 **/
	$config['salt_length'] = 10;

	/**
	 * Should the salt be stored in the database?
	 * This will change your password encryption algorithm, 
	 * default password, 'password', changes to 
	 * fbaa5e216d163a02ae630ab1a43372635dd374c0 with default salt.
	 **/
	$config['store_salt'] = false;
	
	/**
	 * Message Start Delimiter
	 **/
	$config['message_start_delimiter'] = '<p>';
	
	/**
	 * Message End Delimiter
	 **/
	$config['message_end_delimiter'] = '</p>';
	
	/**
	 * Error Start Delimiter
	 **/
	$config['error_start_delimiter'] = '<p>';
	
	/**
	 * Error End Delimiter
	 **/
	$config['error_end_delimiter'] = '</p>';
	
/* End of file ion_auth.php */
/* Location: ./system/application/config/ion_auth.php */
