<?php
/*error_log("BONJOUR!");
ini_set("error_reporting",E_ALL);
ini_set('log_errors','On'); 
ini_set('track_errors','On');
ini_set("error_log","/home/benoit/logs/lacoloc.fr/php.log");

error_log("REBONJOUR!");
bitch();*/
ini_set("display_errors","0"); //@TODO :: Handle dev/prod environnements.

define('GESTIO_IS_ADMIN',false);

require_once('init.inc.php');

LCSession::checkLogin();

$user_menu_content = $_installed_modules = array();

/*** Initializing App,group ***/

// get installed modules for the current user
$installed_modules = Module::get_installed_modules(LC::M()->user->get_var('id'));
if (is_array($installed_modules) && count($installed_modules) > 0 ) {
	foreach($installed_modules as $app) {
		$_installed_modules[$app->getName()] = $app;
	}
}

// Saving current app (if exists)
if (!empty($_GET['app']) && in_array($_GET['app'],array_keys($_installed_modules))) {
	LC::M()->app = $_installed_modules[$_GET['app']];
}

// init infos
if (LC::M()->user) {
	LC::M()->initInfos();
}


/*** Menu rendering ***/


// Home
$user_menu_content[lang('Home')] = array('link' => LC::$url,'image' => '','is_active' => (LC::M()->app?'0':'1'));

//
if (is_array($installed_modules) && count($installed_modules) > 0 ) {
	foreach($installed_modules as $app) {
		$is_active = '0';
		if (LC::M()->app && LC::M()->app->getName() == $app->getName()) $is_active = '1';
		$user_menu_content[$app->getTitle()] = array(	'link' => $app->getPublicLink(),'image' => $app->getLogo(true),'is_active' => $is_active);
	}
	
}

// Submenu
$user_login = '';
if(LC::M()->user) $user_login = LC::M()->user->get_var('login');
$group_name = '';
if (LC::M()->group) $group_name = LC::M()->group->get_var('name');

$user_submenu = array(
	lang('Profile') => array('link' => 'javascript:lc.openProfile();', 'is_last' => '0'),
	lang('Logout') => array('link' => LC::$url.'?action=logout', 'is_last' => '1')
);


LC::M()->tadd(array(
	'menu' =>  $user_menu_content,
	'submenu' => $user_submenu,
	'user_login' => $user_login,
	'group_name' => $group_name,
));


$page_displayed = false;

if (LC::M()->app) {
	include(LC::M()->app->getPageMain());
	$page_displayed = true;
	
} 
else if (!empty($_GET['view'])) {
	
	switch ($_GET['view']) {
		case 'options':
			// DO SOMETHING
			LC::M()->display(false,'options.tpl');
			$page_displayed = true;
		break;
	}
	
	
}

if (!$page_displayed) {
	LC::M()->display(false,'index.tpl');
}

?>