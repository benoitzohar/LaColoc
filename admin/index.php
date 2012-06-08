<?

define('GESTIO_IS_ADMIN',true);

require('../init.inc.php');

GestioSession::checkLogin();

Gestio::$tpl->assign('title',lang('Administration of %s',Gestio::$title));

/** Redirect for an Ajax call **/
if (!empty($_REQUEST['ajax_call'])) {
	if (is_file('ajax.'.$_REQUEST['ajax_call'].'.inc.php'))
		require_once ('ajax.'.$_REQUEST['ajax_call'].'.inc.php');
	else ajax_exit();
	exit;
}

//# Set a template selector
Gestio::$tpl->assign('css_file','templates/');



$page = 'home';
if (!empty($_GET['p'])) $page = $_GET['p'];

$menu_items = array();
foreach(array('home','setup','users','modules') as $menu_item) {
	$menu_items[lang($menu_item)] = array('href' => '?p='.$menu_item , 'class' => ($page==$menu_item?'item_active':''));
}

$menu_items[lang('log out')] = array('href' => '?action=logout','class' => '');

Gestio::$tpl->assign('menu',$menu_items);

switch ($page){
	
	case "setup" :
		
		Gestio::$tpl->display('admin/setup.tpl');
		break;

	case "users":
		
		$users = array();
		$tusers = gestio_user::get_all();
		foreach ($tusers as $user){
			// merging to all users
			$users = array_merge($users,$user->to_array());
		}
		
		$fields = gestio_user::get_lang_fields();
		$fields = join(',',$fields);
		
		Gestio::$tpl->assign('users',$users);
		Gestio::$tpl->assign('fields',$fields);
		
		Gestio::$tpl->display('admin/users.tpl');
		
	break;	
	case "modules":
		$available_modules = $installed_modules = array();
		
		$installed_modules_fields = array(	lang('name'),
											lang('version'),
											lang('last_edit'),
											lang('uninstall'),
										);
		foreach (gestio_app::get_all() as $module){
			$installed_modules = array_merge($installed_modules,array(  $module->getTitle(),
																		$module->getVersion(),
																		 date('d/m/Y',$module->getLastEdit()),
																		'<button class="uninstall_button" id="'.$module->getName().'-uninstall">'.lang('uninstall').'</button>'));
		}
		
		Gestio::$tpl->assign('installed_modules_label',lang('installed_modules'));
		Gestio::$tpl->assign('installed_modules_fields',$installed_modules_fields);
		Gestio::$tpl->assign('installed_modules',$installed_modules);
		
		$available_modules_fields = array(	lang('name'),
											lang('version'),
											lang('install'),
										);
		foreach(gestio_module::get_available_modules() as $module) {
			$available_modules = array_merge($available_modules,array(	$module->get_property('title'),
																		$module->get_property('version'),
																		'<button class="install_button" id="'.$module->get_var('name').'">'.lang('install').'</button>'));
		}
		
		Gestio::$tpl->assign('available_modules_label',lang('available_modules'));
		Gestio::$tpl->assign('available_modules_fields',$available_modules_fields);
		Gestio::$tpl->assign('available_modules',$available_modules);
		
		Gestio::$tpl->display('admin/modules.tpl');		
		
	break;
    default:
    	Gestio::$tpl->display('admin/index.tpl');
    break;
}

?>