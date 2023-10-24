<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
* Name:  MY_Controller
* 
* Author:  Ben Edmunds
* Created:  7.21.2009 
* 
* Description:  Class to extend the CodeIgniter Controller Class.  All controllers should extend this class.
* 
*/

class MY_Controller extends CI_Controller {
 
    protected $data = Array();
    protected $controller_name;
    protected $action_name;
    protected $previous_controller_name;
    protected $previous_action_name;    
    protected $save_previous_url = false; 
    protected $page_title;
   
    public function __construct() {
        parent::__construct();       
        //save the previous controller and action name from session
        $this->previous_controller_name = $this->session->flashdata('previous_controller_name'); 
        $this->previous_action_name     = $this->session->flashdata('previous_action_name'); 
        
        //set the current controller and action name
        $this->controller_name = $this->router->fetch_directory() . $this->router->fetch_class();
        $this->action_name     = $this->router->fetch_method();
        
        $this->data['content'] = '';
        $this->data['css']     = '';
        
    }
 
    protected function render($template='main') {
        //save the controller and action names in session
        if ($this->save_previous_url) {
        	$this->session->set_flashdata('previous_controller_name', $this->previous_controller_name);
        	$this->session->set_flashdata('previous_action_name', $this->previous_action_name);
        }
        else {
        	$this->session->set_flashdata('previous_controller_name', $this->controller_name);
        	$this->session->set_flashdata('previous_action_name', $this->action_name);
        }
    	
        $view_path = $this->controller_name . '/' . $this->action_name . '.php'; //set the path off the view
        if (file_exists(APPPATH . 'views/' . $view_path)) {
            $this->data['content'] .= $this->load->view($view_path, $this->data, true);  //load the view
        }

        $this->load->view("layouts/$template.tpl.php", $this->data);  //load the template
    }
    
    protected function save_url() {
    	$this->save_previous_url = true;
    }
}