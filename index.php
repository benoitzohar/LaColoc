<?php

ini_set("display_errors","0"); //@TODO :: Handle dev/prod environnements.

define('LC_IS_ADMIN',false);

include_once 'init.inc.php';

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
	$cur_user_email = LC::M()->user->get_var('email');
	// make sure the user is well documented
	if ($cur_user_email == '') {
		LC::UI()->showEditUserPage();
	}
	else if ((LC::isAlpha() && !UserAuth::emailCanAlpha($cur_user_email)) || (LC::isBeta() && !UserAuth::emailCanBeta($cur_user_email))) {
		LC::UI()->showNoBetaRightsPage();
	}
	else if (!LC::M()->user->getCurrentGroup()) {
		LC::UI()->showEditGroupPage();
	}

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

// User Submenu
$user_login = '';
if(LC::M()->user) $user_login = LC::M()->user->get_var('email');
$user_id = 0;
if (LC::M()->user) $user_id = LC::M()->user->getId();

$group_name = '';
if (LC::M()->group) $group_name = LC::M()->group->get_var('name');

$user_submenu = array(
	lang('Profile') => array('link' => 'javascript:lc.profile.open();', 'is_last' => '0'),
	lang('Logout') => array('link' => LC::$url.'auth/logout', 'is_last' => '1')
);


// Groups Submenu
$group_submenu = array(
	lang('Profile') => array('link' => 'javascript:lc.group.profile.open();'),
	
);

if(LC::M()->user) {
	$user_groups = LC::M()->user->getGroups();
	if (count($user_groups) > 0) {
		$group_submenu[lang('Select_a_group').' :'] = array();
	}
	foreach($user_groups as $group) {
		$group_submenu[$group->getName()] = array(
			'link' => 'javascript:lc.switchGroup('.$group->getId().');',
			'is_current' => ($group->getId()== LC::M()->group->getId())
		);
	}
}
// Template

LC::UI()->tadd(array(
	'menu' =>  $user_menu_content,
	'subusermenu' => $user_submenu,
	'subgroupmenu' => $group_submenu,
	'user_login' => $user_login,
	'user_id' => $user_id,
	'group_name' => $group_name,
));


$page_displayed = false;

if (LC::M()->app) {
	include(LC::M()->app->getPageMain());
	$page_displayed = true;
	
} 
else if (!empty($_GET['page'])) {
	
	switch ($_GET['page']) {
		case 'options':
			// DO SOMETHING
			LC::UI()->display(false,'options.tpl');
			$page_displayed = true;
		break;
		case 'edit_user' :
			LC::UI()->showEditUserPage();
			$page_displayed = true;
		break;
		case 'edit_group' : 
			LC::UI()->showEditGroupPage();
			$page_displayed = true;
		break;
		
	}
	
	
}

if (!$page_displayed) {
	LC::UI()->display(false,'index.tpl');
}

?>