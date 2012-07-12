<?php

define('GESTIO_IS_ADMIN',false);

require_once('init.inc.php');

GestioSession::checkLogin();

// get installed modules for the current user
$installed_modules = gestio_module::get_installed_modules(Gestio::$user->get_var('id'));
if (is_array($installed_modules) && count($installed_modules) > 0 ) {
	foreach($installed_modules as $app) {
		$_installed_modules[$app->getName()] = $app;
	}
}

// Saving current app (if exists)
if (!empty($_GET['app']) && in_array($_GET['app'],array_keys($_installed_modules))) {
	Gestio::$app = $_installed_modules[$_GET['app']];
}


/*** Menu rendering ***/

$user_menu_content = $_installed_modules = array();

// Home
$user_menu_content[lang('Home')] = array('link' => Gestio::$url,'image' => '','is_active' => (Gestio::$app?'0':'1'));

//
if (is_array($installed_modules) && count($installed_modules) > 0 ) {
	foreach($installed_modules as $app) {
		$is_active = '0';
		if (Gestio::$app && Gestio::$app->getName() == $app->getName()) $is_active = '1';
		$user_menu_content[$app->getTitle()] = array(	'link' => $app->getPublicLink(),'image' => $app->getLogo(true),'is_active' => $is_active);
	}
	
}

// Submenu
$user_login = '';
if(Gestio::$user) $user_login = Gestio::$user->get_var('login');
$user_submenu = array(
	lang('Profile') => array('link' => 'javascript:lc.openProfile();', 'is_last' => '0'),
	lang('Logout') => array('link' => Gestio::$url.'?action=logout', 'is_last' => '1')
);


Gestio::$tpl->assign('menu', $user_menu_content);
Gestio::$tpl->assign('submenu', $user_submenu);
Gestio::$tpl->assign('user_login',$user_login);

$page_displayed = false;

if (Gestio::$app) {
	include(Gestio::$app->getPageMain());
	$page_displayed = true;
	
} 
else if (!empty($_GET['view'])) {
	
	switch ($_GET['view']) {
		case 'options':
			// DO SOMETHING
			Gestio::display(false,'options.tpl');
			$page_displayed = true;
		break;
	}
	
	
}

if (!$page_displayed) {
	Gestio::display(false,'index.tpl');
}

?>