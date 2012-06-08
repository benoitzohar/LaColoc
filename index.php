<?php

define('GESTIO_IS_ADMIN',false);

require_once('init.inc.php');

GestioSession::checkLogin();


// Menu rendering
$installed_modules = gestio_module::get_installed_modules(Gestio::$user->get_var('id'));

$user_menu_content = $_installed_modules = array();
if (is_array($installed_modules) && count($installed_modules) > 0 ) {
	foreach($installed_modules as $app) {
		$user_menu_content[$app->getTitle()] = array(	'link' => $app->getPublicLink(),'image' => $app->getLogo());
	}
	$_installed_modules[$app->getName()] = $app;
}

// Add Action to menu
$user_menu_content[lang('Logout')] = array('link' => Gestio::$url.'?action=logout','image' => Gestio::$url.'templates/images/');


Gestio::$tpl->assign('menu', $user_menu_content);

$page_displayed = false;

if (!empty($_GET['app']) && in_array($_GET['app'],array_keys($_installed_modules))) {

	// Saving current app
	Gestio::$app = $_installed_modules[$_GET['app']];
	
	include(Gestio::$app->getPageMain());
	
	$page_displayed = true;
	
} else if (!empty($_GET['view'])) {
	
	switch ($_GET['view']) {
	
		case 'options':
			Gestio::display(false,'options.tpl');
			$page_displayed = true;
		break;
	}
	
	
}

if (!$page_displayed) {
	Gestio::display(false,'index.tpl');
}

?>