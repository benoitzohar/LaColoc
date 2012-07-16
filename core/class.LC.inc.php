<?php

class LC {

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
		
	//Javascript files
	public static $js_files = array(
		// libs
		'libs/jquery-1.7.2.min',
		'bootstrap.min',
		
		// Core
		'core/lc',
		'core/com',
		'core/fn',
		'core/ui',
	);
	
	// Javascript files for desktop only
	public static $js_files_desktop = array(
	//	'libs/jquery-ui-1.8.16.custom.min',
		'libs/jquery.ediTable',
		'libs/jquery.tipTip.minified',
	);
		
	// CSS files
	public static $css_files = array(
		'bootstrap.min',
		'tipTip',
		'lacoloc',
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
				@include_once('class.Entity.inc.php');
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
		
		//check current app
		$current_app_name = false;
		if (LC::$app && LC::$app->getName()) {
			$current_app_name = LC::$app->getName();
		}
		
		$tpl = self::$tpl;
		
		$tpl->template_dir 	= self::$path.'templates';
		
		$tpl->compile_dir 	= self::$path.'smarty/templates_c';
		$tpl->cache_dir 	= self::$path.'smarty/cache';
		$tpl->config_dir 	= self::$path.'smarty/configs';
		
		$tpl->caching = 0;
		
		$tpl->assign('GESTIO_TPL',self::$url.'templates/');
		$tpl->assign('GESTIO_IMG',self::$url.'img/');
		$tpl->assign('GESTIO_JS',self::$url.'js/');
		$tpl->assign('GESTIO_CSS',self::$url.'css/');

		// Javascripts
		$js_include = '';
		foreach(self::$js_files as $k => $js_file) {
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
		foreach(self::$css_files as $k => $css_file) {
			$css_files[$k] = self::$url.'css/'.$css_file;
		}
		//include app specific CSS
		if ($current_app_name) {
			$current_app_css_folder = 'modules/'.$current_app_name.'/css/';
			if (is_file(self::$path.$current_app_css_folder.$current_app_name.'.css')) 
				$css_files[] = self::$url.$current_app_css_folder.$current_app_name;
		}
		foreach($css_files as $css_file) {
			$css_include .= '<link rel="stylesheet" href="'.$css_file.'.css" />'."\n";
		}
		
		$tpl->assign('GESTIO_CSS_FILES',$css_include);
		
		$tpl->assign('GESTIO_ADMIN_TPL',self::$url.'templates/admin/');
		$tpl->assign('GESTIO_ADMIN_IMG',self::$url.'templates/admin/images/');
		
		// Set header var 
		$header_tpl_path = self::$path.'templates/header.tpl';
		if (is_file($header_tpl_path)) {
			$tpl->assign('GESTIO_HEADER_TPL',$header_tpl_path);
		}
		// Set footer var 
		$footer_tpl_path = self::$path.'templates/footer.tpl';
		if (is_file($footer_tpl_path)) {
			$tpl->assign('GESTIO_FOOTER_TPL',$footer_tpl_path);
		}
		
		// Set menu var 
		$menu_tpl_path = self::$path.'templates/menu.tpl';
		if (is_file($menu_tpl_path)) {
			$tpl->assign('GESTIO_MENU_TPL',$menu_tpl_path);
		}
				
		self::$tpl = $tpl;

	}
	
	static function display($app,$template) {
	
		self::init_template();
		
		if (empty($app)) $app = 'main';
		
		// Set some vars
		self::$tpl->assign('title',self::$title);
		self::$tpl->assign('GESTIO_URL',self::$url);
		self::$tpl->assign('GESTIO_CURRENT_APP',$app);
		self::$tpl->assign('GESTIO_INITIAL_DATA',self::getInitialData());
		self::$tpl->assign('GESTIO_LANG',self::getLang(true));
		self::$tpl->assign('GESTIO_SITE_DESCRIPTION',lang('site_description_content'));

		// choose the template to show
		if ($app == 'main') {
			self::$tpl->template_dir = self::$path.'templates';
		}
		else if (is_dir(self::$path.'modules/'.$app.'/templates')) {
			self::$tpl->template_dir = self::$path.'modules/'.$app.'/templates';
		}
		
		// if template exists : show it
		if (is_file(self::$tpl->template_dir.'/'.$template)) {
			self::$tpl->display($template);
		}
		// Fallback if template doesn't exist
		else {
			self::$tpl->template_dir = self::$path.'templates';
			self::$tpl->display('oops.tpl');
		}
		
	}
	
	static function getInitialData() {
		$data = array();
		return base64_encode(json_encode($data));
	}
	
	static function getLang($short_version = false) {
		if ($short_version) return substr(self::$default_lang,0,2);
		return self::$default_lang;
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
		echo '<div style="border:1px solid gray;"><b>FATAL ERROR:</b><br /><p>'.$err.'</p></div>';
	}
	
	
}

new LC($gestio_global_options);

?>