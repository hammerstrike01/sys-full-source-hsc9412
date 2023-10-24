<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set('Asia/Seoul');

////////////////////////////////////////////////////////////////
// Local
$config['base_url'] = 'http://192.168.3.74/hclub_admin/';
$config['img_url'] = 'http://192.168.3.74/hclub_admin/upload/';
$config['img_path'] = './upload/';
$config['fcm_push'] = 'http://192.168.3.74:3041/fcmPush';
 

//////////////////////////////////////////////////////////////// inziqaofcmikayhj


$config['title'] = '관리시스템';

$config['index_page'] = is_file(FCPATH.'.htaccess') ? '' : 'index.php';

$config['smtp_user'] = "";
$config['smtp_pass'] = ""; 

$config['sms_user_id'] = "";
$config['sms_secure'] = ""; 


$config['uri_protocol']	= 'AUTO';

$config['url_suffix'] = '';

$config['subclass_prefix'] = 'MY_';

$config['language']	= 'english';

$config['charset'] = 'UTF-8';

$config['enable_hooks'] = FALSE;

$config['composer_autoload'] = FALSE;

$config['permitted_uri_chars'] = 'a-z 0-9~%.:_\-';

$config['allow_get_array'] = TRUE;
$config['enable_query_strings'] = FALSE;
$config['controller_trigger'] = 'c';
$config['function_trigger'] = 'm';
$config['directory_trigger'] = 'd';

$config['log_threshold'] = 0;

$config['log_path'] = '';

$config['log_file_extension'] = '';

$config['log_file_permissions'] = 0644;

$config['log_date_format'] = 'Y-m-d H:i:s';

$config['error_views_path'] = '';

$config['cache_path'] = '';

$config['cache_query_string'] = FALSE;

$config['encryption_key'] = 'YouReallyHaveToChangeThisKeyToSomethingElse';

$config['sess_cookie_name']		= 'ci_session';
$config['sess_expiration']		= 7200;
$config['sess_expire_on_close']	= FALSE;
$config['sess_encrypt_cookie']	= FALSE;
$config['sess_use_database']	= FALSE;
$config['sess_table_name']		= 'ci_sessions';
$config['sess_match_ip']		= FALSE;
$config['sess_match_useragent']	= TRUE;
$config['sess_time_to_update']	= 300;
$config['sess_driver'] = 'database';
$config['sess_save_path'] = 'ci_sessions';
$config['sess_regenerate_destroy'] = FALSE;

$config['cookie_prefix']	= '';
$config['cookie_domain']	= '';
$config['cookie_path']		= '/';
$config['cookie_secure']	= FALSE;
$config['cookie_httponly'] 	= FALSE;

$config['standardize_newlines'] = FALSE;

$config['global_xss_filtering'] = FALSE;

$config['csrf_protection'] = FALSE;
$config['csrf_token_name'] = 'csrf_test_name';
$config['csrf_cookie_name'] = 'csrf_cookie_name';
$config['csrf_expire'] = 7200;
$config['csrf_regenerate'] = TRUE;
$config['csrf_exclude_uris'] = array();

$config['compress_output'] = FALSE;

$config['time_reference'] = 'local';

$config['rewrite_short_tags'] = FALSE;

$config['proxy_ips'] = '';
