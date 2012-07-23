<?php

//@TODO : change self::$users, self::$group, self::$user by a non-static method (for socket ....)

class LC {

	public static $instances = array();

	public static $current_version = 0.01;
	
	public static $is_installed;
	
	//Template
	public $tpl;
	
	// Config
	public static $title;
	public static $path;
	public static $uniqueKey;
	public static $url;
	public static $default_lang;
	public static $admin_password;
	
	// Database
	public static $db;
	
	//Javascript files
	public static $js_files = array(
		// libs
		'libs/jquery-1.7.2.min',
		'libs/bootstrap.min',
		'libs/bootstrap-datepicker',
		// Core
		'core/lc',
		'core/com',
		'core/fn',
		'core/ui',
	);
		
	// CSS files
	public static $css_files = array(
		'bootstrap.min',
		'datepicker',
		'tipTip',
		'lacoloc',
	);
	
	//Current user
	public $user;
	public $admin;
	
	// Group / Users
	public $group;
	public $users;
	
	//Current Application
	public $app;
	
	public $lang;
	
	//Errors
	public $errors = array();
	
	public $initial_data = array();
	
	
	public function __construct($options = array()) {
		
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
						$this->tpl = new Smarty();		
			}
			else $this->throwFatalError("Could not find the template engine (SMARTY).");	
		}

	}
	
	public function __destruct() {
		if (count($this->errors)>0) {
			$this->throwError();
		}
	}
	
	public function init_template() {
		
		// init langs
		$this->lang = get_lang_array(self::getLang());
		
		//check current app
		$current_app_name = false;
		if ($this->app && $this->app->getName()) {
			$current_app_name = $this->app->getName();
		}
		
		$tpl = $this->tpl;
		
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
				
		$this->tpl = $tpl;

	}
	
	public function display($app,$template) {
	
		$this->init_template();
		$this->initInfos($app);
		
		// Set some vars
		$this->tpl->assign('title',self::$title);
		$this->tpl->assign('GESTIO_URL',self::$url);
		$this->tpl->assign('GESTIO_CURRENT_APP',$this->app);
		$this->tpl->assign('GESTIO_INITIAL_DATA',$this->getInitialData());
		$this->tpl->assign('GESTIO_LANG',self::getLang(true));
		$this->tpl->assign('GESTIO_LANG_LONG',self::getLang());
		$this->tpl->assign('GESTIO_SITE_DESCRIPTION',lang('site_description_content'));
		
		// Langs
		$this->tpl->assign('lang',$this->lang);

		// choose the template to show
		if ($app == 'main') {
			$this->tpl->template_dir = self::$path.'templates';
		}
		else if (is_dir(self::$path.'modules/'.$app.'/templates')) {
			$this->tpl->template_dir = self::$path.'modules/'.$app.'/templates';
		}
		
		// if template exists : show it
		if (is_file($this->tpl->template_dir.'/'.$template)) {
			$this->tpl->display($template);
		}
		// Fallback if template doesn't exist
		else {
			$this->tpl->template_dir = self::$path.'templates';
			$this->tpl->display('oops.tpl');
		}
		
	}
	
	public function tadd($name,$value = '') {
		if (is_array($name)) 	$this->tpl->assign($name);
		else 					$this->tpl->assign($name,$value);
		
	}
	
	public function initInfos($app = 'main') {
	
		// init app
		if (!empty($app)) $this->app = $app;
		if (empty($this->app)) $this->app = 'main';
	
		// self::$user should be initialized by the LCSession checklogin()
		if ($this->user) {
			$this->group = new Group($this->user->get_var('group_id'));
			$this->users = $this->group->getUsers();
		}
		
		$this->loadMainInitialData();
		
	}
	
	public function loadMainInitialData() {
		$data = array('users' => array());
		
		$user_private_data = array('passwd','last_login_ip');
		
		if ($this->user) 	$data['current_user'] = $this->user->getId();
		if ($this->group) 	$data['group'] = $this->group->toArray();
		if ($this->users) {
			foreach($this->users as $u) {
				if (!$u) continue;
				$data['users'][$u->getId()] = $u->toArray();	
				// clean some data (private data)
				foreach($user_private_data as $k) {
					$data['users'][$u->getId()][$k] = false;
					unset($data['users'][$u->getId()][$k]);
				}
				
			}
		}
		$this->addInitialData($data,'main');
		
		return true;
	}
	
	public function getInitialData() {
		$data = $this->initial_data;
		return json_encode($data);
	}
	
	public function addInitialData($data,$app = false){
		if (empty($app)) $app = 'main';
		if (is_array($this->initial_data[$app]))	$this->initial_data[$app] = array_merge_recursive($this->initial_data[$app],$data);
		else $this->initial_data[$app] = $data;
	}
	
	public function getLang($short_version = false) {
		if ($short_version) return substr(self::$default_lang,0,2);
		return self::$default_lang;
	}
	
	public function getPreference($preference_name = '',$app = false,$as_object = false,$from_group_only = false) {
		// get preference for current user	
		if ($this-user) {
			$user_pref = Preference::getPreferencesForUser($this->user->getId(),$preference_name,$app,!$as_object);
			if ($user_pref && is_array($user_pref) && count($user_pref) > 0){
				if ($as_object) return $user_pref[0];
				else if (is_array($user_pref[0]) && array_key_exists($preference_name, $user_pref[0])) {
					return  $user_pref[0][$preference_name];
				}
			}
			// fallback : get pref from current group
			else if ($this->group){
				$group_pref = Preference::getPreferencesForGroup($this->group->getId(),$preference_name,$app,!$as_object);
				if ($group_pref && is_array($group_pref) && count($group_pref) > 0){
				if ($as_object) return $group_pref[0];
				else if (is_array($group_pref[0]) && array_key_exists($preference_name, $group_pref[0])) {
					return  $group_pref[0][$preference_name];
				}
			}

			}
		}
		return false;
	}
	
	public function setPreference($preference_name = '',$value = '',$group = false,$app = false) {
		if (empty($preference_name)) return false;
		if (empty($app)) $app = 'main';
		
		$existing_obj = false;
		if ($group && $this->group) {
			$group_pref = Preference::getPreferencesForGroup($this->group->getId(),$preference_name,$app);
			if ($group_pref && is_array($group_pref) && count($group_pref) > 0 && is_object($group_pref[0])){
				$existing_obj = $group_pref[0];
			}

		}
		else if ($this->user) {
			$user_pref = Preference::getPreferencesForUser($this->user->getId(),$preference_name,$app);
			if ($user_pref && is_array($user_pref) && count($user_pref) > 0 && is_object($user_pref[0])){
				$existing_obj = $user_pref[0];
			}
		}
		
		if ($existing_obj) {
			$existing_obj->set_var('val',$value);
			return true;
		}
	
		$pref_ar = array(
			'app' => $app,
			'name' => $preference_name,
			'val' => $value
		);
		if ($group && $this->group) $pref_ar['group_id'] = $this->group->getId();
		else if ($this->user)		$pref_ar['user_id'] = $this->user->getId();
		else return false;
		
		$new_obj = new Preference(false,$pref_ar);
		
		return $new_obj;
	}
	
		
	public function encodePassword($password = '',$uniqueKey = '') {
		if (empty($password)) return false;
		if (!empty($uniqueKey)) {
			return crypt($password,$uniqueKey);
		}
		return crypt($password,self::$uniqueKey);
	}
	
	
	public function checkPassword($password_to_check = '',$crypted_value = '') {
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
	
	static function getInstance($uuid = 'default',$params = array()) {
		if (!self::$instances[$uuid]) self::$instances[$uuid] = new LC($params);
		return self::$instances[$uuid];
	}
	static function M($uuid = 'default') {
		return self::getInstance($uuid);
	}	
}

LC::getInstance('default',$gestio_global_options);

?>