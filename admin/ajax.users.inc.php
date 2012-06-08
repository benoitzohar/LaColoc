<?
if (empty($_REQUEST['ajax_call'])) ajax_exit();


switch ($_REQUEST['action']){

	case 'add_new':
		if (!request_vars_not_empty('login','password'))
			ajax_exit();
		
		$adding_user = new gestio_user(null,array("login" => $_REQUEST['login'],
		"passwd" => Gestio::encodePassword($_REQUEST['password'])));
		
		echo lang('user_added');
		
	break;
	
	case 'update':
		if (!request_vars_not_empty('id','login','password')) ajax_exit();
		
		$user = new gestio_user($_REQUEST['id']);
		$user->set_var('login',$_REQUEST['login']);
		$user->set_var('passwd',Gestio::encodePassword($_REQUEST['password']));
		
		echo lang('user_updated');
		
	break;
	
	case 'delete':
		if (!request_vars_not_empty('id')) ajax_exit();
		$user_to_delete = new gestio_user($_REQUEST['id']);
		$user_to_delete->delete();
		echo lang('user_deleted');
	break;

	default:
		ajax_exit();
}


?>