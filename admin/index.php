<?

define('LC_IS_ADMIN',true);

require('../init.inc.php');

LCSession::checkLogin();

LC::M()->tpl->assign('title',lang('Administration of %s',LC::$title));

/** Redirect for an Ajax call **/
if (!empty($_REQUEST['ajax_call'])) {
	if (is_file('ajax.'.$_REQUEST['ajax_call'].'.inc.php'))
		require_once ('ajax.'.$_REQUEST['ajax_call'].'.inc.php');
	else ajax_exit();
	exit;
}

//# Set a template selector
LC::M()->tpl->assign('css_file','templates/');


$page = 'home';
if (!empty($_GET['p'])) $page = $_GET['p'];

$menu_items = array();
foreach(array('home','setup','users','modules') as $menu_item) {
	$menu_items[lang($menu_item)] = array('href' => '?p='.$menu_item , 'class' => ($page==$menu_item?'item_active':''));
}

$menu_items[lang('log out')] = array('href' => '?action=logout','class' => '');

LC::M()->tpl->assign('menu',$menu_items);

switch ($page){
	
	case "setup" :
		
		LC::M()->display('main','admin/setup.tpl');
		break;

	case "users":
		
		$users = array();
		$tusers = User::get_all('User');
		foreach ($tusers as $user){
			// merging to all users
			$users = array_merge($users,array_values($user->to_array()));
		}
		
		$fields = User::$fields;
		$fields = join(',',$fields);
		LC::M()->tpl->assign('users',$users);
		LC::M()->tpl->assign('fields',$fields);
		
		LC::M()->display('main','admin/users.tpl');
		
	break;	
	case "modules":
		$available_modules = $installed_modules = array();
		
		$installed_modules_fields = array(	lang('name'),
											lang('version'),
											lang('last_edit'),
											lang('uninstall'),
										);
		foreach (App::get_all('App') as $module){
			$installed_modules = array_merge($installed_modules,array(  $module->getTitle(),
																		$module->getVersion(),
																		 date('d/m/Y',$module->getLastEdit()),
																		'<button class="uninstall_button" id="'.$module->getName().'-uninstall">'.lang('uninstall').'</button>'));
		}
		
		LC::M()->tpl->assign('installed_modules_label',lang('installed_modules'));
		LC::M()->tpl->assign('installed_modules_fields',$installed_modules_fields);
		LC::M()->tpl->assign('installed_modules',$installed_modules);
		
		$available_modules_fields = array(	lang('name'),
											lang('version'),
											lang('install'),
										);
		foreach(Module::get_available_modules() as $module) {
			$available_modules = array_merge($available_modules,array(	$module->get_property('title'),
																		$module->get_property('version'),
																		'<button class="install_button" id="'.$module->get_var('name').'">'.lang('install').'</button>'));
		}
		
		LC::M()->tpl->assign('available_modules_label',lang('available_modules'));
		LC::M()->tpl->assign('available_modules_fields',$available_modules_fields);
		LC::M()->tpl->assign('available_modules',$available_modules);
		
		LC::M()->display('main','admin/modules.tpl');		
		
	break;
    default:
    	LC::M()->display('main','admin/index.tpl');
    break;
}

?>