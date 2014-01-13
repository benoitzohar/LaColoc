<?

/****************
 *	webservice.php (for ajax use)
 *	
 *	@author	Benoit Zohar
 ****************/
 
// Start buffering (the result must be a JSON file ... )
ob_start();
error_log(__METHOD__.':'.__LINE__."\n".print_r($_REQUEST,true));
 
define('LC_IS_ADMIN',false);

$gestio_global_options = array('no_template' => true);
require_once('init.inc.php');

// test if user is connected
if (!LCSession::checkLogin(true)) {
	json_exit(false,false,lang("user_not_connected"));
}

$app = $action = $params = '';

if (isset($_REQUEST['app']))	$app 	= $_REQUEST['app'];
if (isset($_REQUEST['action'])) $action = $_REQUEST['action'];
if (isset($_REQUEST['params'])) $params = $_REQUEST['params'];

// default app is main
if (empty($app)) $app = 'main';

if ($app != 'main') {

	// make sure the app is installed for the user
	$installed_modules = Module::get_installed_modules(LC::M()->user->getId(),false,true);

	if (!in_array($app,$installed_modules)) {
		json_exit(false,false,lang('this_application_is_not_installed_for_this_user'));
	}

	$dialog_file_path = LC::$path.'modules/'.$app.'/class.dialog.inc.php';
	$class_name = 'Dialog_'.$app;
}
else {
	$dialog_file_path = LC::$path.'class.dialog.inc.php';
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
$res = $D->$action($params);
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