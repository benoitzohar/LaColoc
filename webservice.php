<?

/****************
 *	webservice.php (for ajax use)
 *	
 *	@author	Benoit Zohar
 ****************/
 
// Start buffering (the result must be a JSON file ... )
ob_start();

/*
 *  json_exit() Echo a jsonized array and exit
 *  @param Boolean $status
 *  @param Array $data OR String eg : "key1:param1,key2:param2"
 *	@param String	$message
 */
function json_exit($status = false, $data = false, $message = '') {

	$array_to_jsonize = array('status' => ($status?true:false),'message' => $message,'data' => array());
	if ($data && is_array($data)) {
		foreach ($data as $key => $param) $array_to_jsonize['data'][$key] = $param;
	} 
	else if ($data && is_string($data)) {
		foreach (explode(',', $data) as $param) {
			list($key, $value) = explode(':', $param);
			$array_to_jsonize['data'][$key] = $value;
		}
	}
	
	// stop buffering
	$buffer_content = ob_get_contents();
	if (!empty($buffer_content)) $array_to_jsonize['message'] .= '['.$buffer_content.']';
	ob_end_clean();
	
	echo @json_encode($array_to_jsonize);
	exit;
}
 
define('GESTIO_IS_ADMIN',false);

$gestio_global_options = array('no_template' => true);
require_once('init.inc.php');

// test if user is connected
if (!GestioSession::checkLogin()) {
	json_exit(false,false,lang("user_not_connected"));
}

print_r($_REQUEST);
$app 	= $_REQUEST['app'];
$action = $_REQUEST['action'];
$params = $_REQUEST['params'];

// default app is main
if (empty($app)) $app = 'main';

if ($app != 'main') {

	// make sure the app is installed for the user
	$installed_modules = gestio_module::get_installed_modules(Gestio::$user->get_var('id'),false,true);

	if (!in_array($app,$installed_modules)) {
		json_exit(false,false,lang('this_application_is_not_installed_for_this_user'));
	}

	$dialog_file_path = Gestio::$path.'modules/'.$app.'/class.dialog.inc.php';
	$class_name = 'Dialog_'.$app;
}
else {
	$dialog_file_path = Gestio::$path.'class.dialog.inc.php';
	$class_name = 'Dialog';
}

// check if the file exist for the app
if (!is_file($dialog_file_path)) {
	json_exit(false,false,lang('no_dialog_file_for_the_app'));
}

require_once($dialog_file_path);
$D = new $class_name();

// check if the method exist for the app
if (!method_exists($class_name,$action)) {
	json_exit(false,false,lang('action_not_available_for_this_app'));
}

// send the app's method returned value
$res = $D->$action();
if ($res === null) {
	json_exit(false,false,lang('an_unknown_error_append'));
}

json_exit(true,
	array(
		'app' => $app,
		'action' => $action,
		'params' => $params,
		'result' => $res
	),
'');


?>