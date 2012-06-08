<?
if (empty($_REQUEST['ajax_call'])) ajax_exit();

ini_set('display_errors',0);

switch ($_REQUEST['action']){

	case 'install':
		if (!request_vars_not_empty('app_name'))
			ajax_exit();
		
		$app_to_install = new gestio_module($_REQUEST['app_name']);
		$new_app = $app_to_install->install();
		if (is_object($new_app)) {
			
			$res = array('display' 	 => lang('app_installed'),
						 'name' 	 => $new_app->getName(),
						 'title' 	 => $new_app->getTitle(),
						 'version' 	 => $new_app->getVersion(),
						 'last_edit' => date('d/m/Y',$new_app->getLastEdit()),
						 'uninstall' => lang('uninstall'),
			);
			echo json_encode($res);
		}
		else {
			echo json_encode(array('success' => false,'display' => lang("could not install app")));
			exit;
		}
		
	break;
	
	case 'uninstall':
		if (!request_vars_not_empty('app_name'))
			ajax_exit();
		
		$app_to_uninstall = new gestio_module($_REQUEST['app_name']);
		if($app_to_uninstall->uninstall()) {
			$res = array('display' => lang('app_uninstalled'),
						 'name' 	 => $app_to_uninstall->get_var('name'),
						 'title' 	 => $app_to_uninstall->get_property('title'),
						 'version' 	 => $app_to_uninstall->get_property('version'),
						 'install' => lang('install'),
						 );
			echo json_encode($res);
		}
		else echo json_encode(array('success' => false,'display' => lang("could not uninstall app")));
		
	break;

	default:
		ajax_exit();
}

exit;
?>