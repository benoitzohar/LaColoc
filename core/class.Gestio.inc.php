<?php

class Gestio {

	public static $current_version = 0.01;
	
	public static $is_installed;
	
	//Template
	public static $tpl;
	
	// Config
	public static $title;
	public static $path;
	public static $uniqueKey;
	public static $url;
	public static $default_lang;
	public static $admin_password;
	
	// Database
	public static $db;
	
	//Current user
	public static $user;
	public static $admin;
	
	//Current Application
	public static $app;
	
	//Errors
	public static $errors = array();
	
	//Device (desktop, tablet, phone)
	public static $devices = array('desktop','tablet','phone');
	public static $other_devices = array('phone','tablet');
	public static $current_device;
	
	//Javascript files
	public static $js_files = array(
		// libs
		'libs/jquery-1.7.2.min',
		
		// Core
		'core/lc',
		'core/com',
		'core/fn',
		'core/ui',
	);
	
	// Javascript files for desktop only
	public static $js_files_desktop = array(
		'libs/jquery-ui-1.8.16.custom.min',
		'libs/jquery.ediTable',
		'libs/jquery.tipTip.minified',
	);
	
	// Javascript files for tablet only
	public static $js_files_tablet = array(
		'libs/jquery.mobile-1.0rc1.min'
	);
	
	// Javascript files for phone only
	public static $js_files_phone = array(
		'libs/jquery.mobile-1.0rc1.min'
	);
	
	// CSS files
	public static $css_files = array(
		
	);
	
	// CSS files for desktop only
	public static $css_files_desktop = array(
		'libs/tipTip',
		'default',
		
	);
	
	// CSS files for tablet only
	public static $css_files_tablet = array(
		'jquery_mobile/jquery.mobile-1.0rc1.min'
	);

	// CSS files for phone only
	public static $css_files_phone = array(
		'jquery_mobile/jquery.mobile-1.0rc1.min'
	);
	
	function __construct($options = array()) {
		
		if (!empty(self::$path))			$prefix = self::$path;
		else if (GESTIO_IS_ADMIN === true)	$prefix = '../';
		else								$prefix = '';
			
		// Include config
		if(@include_once($prefix.'config/config.inc.php')) {
			
			self::$title = $gestio_config['title'];
			self::$path = $gestio_config['path'];
			self::$url = $gestio_config['url'];
			self::$uniqueKey = $gestio_config['uniqueKey'];
			self::$default_lang = $gestio_config['default_lang'];
			self::$admin_password = $gestio_config['admin_password'];
			
		} else self::$is_installed = false;
		
		// Include database object
		if (@include_once($prefix.'config/db.inc.php')) {
			@include_once($prefix.'libs/adodb5/adodb.inc.php');
			if(@include_once('class.GDB.inc.php')) {
				self::$db = new GDB($gestio_db_config);
			}
		} else self::$is_installed = false;

		// Include Smarty templates
		if ($options['no_template'] !== true) {
			if(@include_once($prefix.'libs/smarty/Smarty.class.php')) {
				if (self::$is_installed !== false)
						self::$tpl = new Smarty();		
			}
			else self::throwFatalError("Could not find the template engine (SMARTY).");	
		}

	}
	
	function __destruct() {
		if (count(self::$errors)>0) {
			self::throwError();
		}
	}
	
	static function init_template() {
		
		$device = self::getDevice();
		
		//check current app
		$current_app_name = false;
		if (Gestio::$app && Gestio::$app->getName()) {
			$current_app_name = Gestio::$app->getName();
		}
		
		$tpl = self::$tpl;
		
		$tpl->template_dir 	= self::$path.'templates';
		
		$tpl->compile_dir 	= self::$path.'smarty/templates_c';
		$tpl->cache_dir 	= self::$path.'smarty/cache';
		$tpl->config_dir 	= self::$path.'smarty/configs';
		
		$tpl->caching = 0;
		
		$tpl->assign('title',self::$title);
		
		$tpl->assign('GESTIO_URL',self::$url);
		$tpl->assign('GESTIO_TPL',self::$url.'templates/');
		$tpl->assign('GESTIO_IMG',self::$url.'templates/images/');
		$tpl->assign('GESTIO_JS',self::$url.'js/');

		// Javascripts
		$js_include = '';
		$js_files = array_merge(self::$js_files,self::${'js_files_'.$device});
		foreach($js_files as $k => $js_file) {
			$js_files[$k] = self::$url.'js/'.$js_file.'.js';
		}
		//include app specific JS (all files in the folder)
		if ($current_app_name) {
			$current_app_js_folder = 'modules/'.$current_app_name.'/js/';				
			$current_js_files = get_dir_content(self::$path.$current_app_js_folder);
			foreach($current_js_files as $current_js_file) {
				$js_files[] = self::$url.$current_app_js_folder.$current_js_file;
			}
		}
		foreach($js_files as $js_file) {
			$js_include .= '<script type="text/javascript" src="'.$js_file.'"></script>'."\n";	
		}
		$tpl->assign('GESTIO_JS_FILES',$js_include);
		
		// Css
		$css_include = '';
		$css_files = array_merge(self::$css_files,self::${'css_files_'.$device});
		foreach($css_files as $k => $css_file) {
			$css_files[$k] = self::$url.'templates/'.$css_file;
		}
		//include app specific CSS
		if ($current_app_name) {
			$current_app_css_folder = 'modules/'.$current_app_name.'/css/';
			if (is_file(self::$path.$current_app_css_folder.$current_app_name.'.css')) 
				$css_files[] = self::$url.$current_app_css_folder.$current_app_name;
			if (is_file(self::$path.$current_app_css_folder.$current_app_name.'_'.$device.'.css')) 
				$css_files[] = self::$url.$current_app_css_folder.$current_app_name.'_'.$device;
		}
		foreach($css_files as $css_file) {
			$css_include .= '<link rel="stylesheet" href="'.$css_file.'.css" type="text/css" />'."\n";
		}
		
		$tpl->assign('GESTIO_CSS_FILES',$css_include);
		
		$tpl->assign('GESTIO_ADMIN_TPL',self::$url.'templates/admin/');
		$tpl->assign('GESTIO_ADMIN_IMG',self::$url.'templates/admin/images/');
		
		// Set header var depending on the device used
		$header_tpl_path = self::$path.'templates/header.tpl';
		if (is_file($header_tpl_path)) {
			if (in_array(self::$current_device,self::$other_devices) && is_file(self::$path.'templates/'.self::$current_device.'/header.tpl')) {
				$header_tpl_path = self::$path.'templates/'.self::$current_device.'/header.tpl';
			}
			$tpl->assign('GESTIO_HEADER_TPL',$header_tpl_path);
		}
		// Set footer var depending on the device used
		$footer_tpl_path = self::$path.'templates/footer.tpl';
		if (is_file($footer_tpl_path)) {
			if (in_array(self::$current_device,self::$other_devices) && is_file(self::$path.'templates/'.self::$current_device.'/footer.tpl')) {
				$footer_tpl_path = self::$path.'templates/'.self::$current_device.'/footer.tpl';
			}
			$tpl->assign('GESTIO_FOOTER_TPL',$footer_tpl_path);
		}
		
		// Set menu var depending on the device used
		$menu_tpl_path = self::$path.'templates/menu.tpl';
		if (is_file($menu_tpl_path)) {
			if (in_array(self::$current_device,self::$other_devices) && is_file(self::$path.'templates/'.self::$current_device.'/menu.tpl')) {
				$menu_tpl_path = self::$path.'templates/'.self::$current_device.'/menu.tpl';
			}
			$tpl->assign('GESTIO_MENU_TPL',$menu_tpl_path);
		}
				
		self::$tpl = $tpl;

	}
	
	static function display($app,$template) {
	
		self::init_template();
		
		$display = false;

		if (!$app || $app == 'main') {
			$display = true;
			self::$tpl->template_dir = self::$path.'templates';
		}
		else if (is_dir(self::$path.'modules/'.$app.'/templates')) {	
			$display = true;
			self::$tpl->template_dir = self::$path.'modules/'.$app.'/templates';
		}
		
		// Check template specific dir
		if ($display) {
			if (in_array(self::$current_device,self::$other_devices) && is_file(self::$tpl->template_dir.'/'.self::$current_device.'/'.$template)) {
				self::$tpl->template_dir = self::$tpl->template_dir.'/'.self::$current_device;
			} else if (!is_file(self::$tpl->template_dir.'/'.$template)) {
				$display = false;
			}
		} 
		
		if ($display) {
			self::$tpl->display($template);
		}
		// Fallback if template doesn't exist
		else {
			self::$tpl->template_dir = self::$path.'templates';
			self::$tpl->display('oops.tpl');
		}
		
	}
	
	static function getDevice() {
		if (!empty(self::$current_device)) return self::$current_device;
		$_GestioSession = GestioSession::getInstance();
		
		// check if device is forced
		if (!empty($_GET['device']) && in_array($_GET['device'],self::$devices)) {
			$_GestioSession->setSession('device',$_GET['device']);
		}
		
		// Check if device is stocked into session
		$session_device = $_GestioSession->getSession('device');
		if (!empty($session_device) && in_array($session_device,self::$devices)) {
			self::$current_device = $session_device;
			return $session_device;
		} 
		
		//Try to catch device type from user agent
		$device = 'desktop';
		require_once self::$path.'libs/mdetect.php';		
		$_mdetect = new uagent_info();
		
		if($_mdetect->DetectTierIphone()) {
			$device = 'phone';
		} else if ($_mdetect->DetectTierTablet()) {
			$device = 'tablet';
		}
		
		$_GestioSession->setSession('device',$device);
		self::$current_device = $device;
		return $device;
	}
	
	static function encodePassword($password = '',$uniqueKey = '') {
		if (empty($password)) return false;
		if (!empty($uniqueKey)) {
			return crypt($password,$uniqueKey);
		}
		return crypt($password,self::$uniqueKey);
	}
	
	
	static function checkPassword($password_to_check = '',$crypted_value = '') {
		if (empty($password_to_check)) return false;
		if (empty($crypted_value)) {
			$crypted_value = self::$admin_password;
		}

		return (crypt($password_to_check,self::$uniqueKey) == $crypted_value);
	}

	
	static function throwFatalError($err) {
		self::throwError($err);
		exit;	
	}
	
	static function throwError($err) {
		echo '<div style="border:1px solid gray;"><b>GESTIO FATAL ERROR:</b><br /><p>'.$err.'</p></div>';
	}
	
	
}

new Gestio($gestio_global_options);

?>