<?php

//@TODO : change self::$users, self::$group, self::$user by a non-static method (for socket ....)

class LC {

	public static $instances = array();

	public static $current_version = 0.01;
	
	public static $is_installed;
	
	//Template
	public $tpl;
	
	// Config
	public static $config;
	public static $title;
	public static $path;
	public static $uniqueKey;
	public static $url;
	public static $default_lang;
	public static $admin_password;
	public static $admin_email;
	public static $status;
	
	// Database
	public static $db;
	
	//Javascript files
	public static $js_files = array(
		// libs
		'libs/jquery-1.7.2.min',
		'libs/bootstrap.min',
		'libs/bootstrap-datepicker',
		'libs/jquery.base64.min',
		'libs/jquery.ui.widget',
		'libs/jquery.iframe-transport',
		'libs/jquery.fileupload',
		
		
		// Core
		'core/lc',
		'core/com',
		'core/fn',
		'core/ui',
		'core/lc.profile',
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
	public $auth;
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
		else if (LC_IS_ADMIN === true)	$prefix = '../';
		else								$prefix = '';
			
		// Include config
		if(include_once($prefix.'config/config.inc.php')) {
			self::$title = $config['title'];
			self::$path = $config['path'];
			self::$url = $config['url'];
			self::$uniqueKey = $config['uniqueKey'];
			self::$default_lang = $config['default_lang'];
			self::$admin_password = $config['admin_password'];
			self::$admin_email = $config['admin_email'];
			self::$status = $config['status'];
			self::$config = $config;
			
		} else self::$is_installed = false;
		
		// Include database object
		if (@include_once($prefix.'config/db.inc.php')) {
			@include_once($prefix.'libs/adodb5/adodb.inc.php');
			if(@include_once('class.GDB.inc.php')) {
				self::$db = new GDB($db_config);
				@include_once('class.Entity.inc.php');
			}
		} else self::$is_installed = false;

		// Include Smarty templates
		if (!array_key_exists('no_template',$options) || $options['no_template'] !== true) {
			if(@include_once($prefix.'libs/smarty/Smarty.class.php')) {
				if (self::$is_installed !== false)
						$this->tpl = new Smarty();	
			}
			else $this->throwFatalError("Could not find the template engine (SMARTY).");
		}
		
		// init UI
		$this->ui = new UI();
		
		// init langs
		$this->lang = get_lang_array(self::getLang());
	}
	
	public function __destruct() {
		if (count($this->errors)>0) {
			$this->throwError();
		}
	}

	
	public function initInfos($app = '') {
	
		// init app
		if (!empty($app)) $this->app = $app;
		//if (empty($this->app)) $this->app = 'main';
	
		if ($this->user) {
			$this->group = $this->user->getCurrentGroup();
			if ($this->group) $this->users = $this->group->getUsers();
		}
		
		$this->loadMainInitialData();
		
	}
	
	public function loadMainInitialData() {
		$data = array('users' => array());

		if ($this->user) 	$data['current_user'] = $this->user->getId();
		if ($this->group) 	$data['group'] = $this->group->toArray();
		if (!$this->users && $this->user) $this->users = array($this->user); //get at least the current user
		if ($this->users) {
			foreach($this->users as $u) {
				if (!$u) continue;
				$data['users'][$u->getId()] = $u->toArray(false,true);
			}
		}
		$this->addInitialData($data,'main');
		
		return true;
	}
	
	public function getInitialData() {
		$data = $this->initial_data;
		return base64_encode(json_encode($data));
	}
	
	public function addInitialData($data,$app = false){
		if (empty($app)) $app = 'main';
		if (array_key_exists($app,$this->initial_data) && is_array($this->initial_data[$app]))	
			$this->initial_data[$app] = array_merge_recursive($this->initial_data[$app],$data);
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

	static function isProd() { return empty(self::$status); }
	static function isBeta() { return self::$status === 1; }
	static function isAlpha() { return self::$status === 2; }
	
	static function throwFatalError($err) {
		self::throwError($err);
		exit;	
	}
	
	static function throwError($err) {
		echo '<div style="border:1px solid gray;"><b>FATAL ERROR:</b><br /><p>'.$err.'</p></div>';
	}
	
	static function getInstance($uuid = 'default',$params = array()) {
		if (!in_array($uuid,array_keys(self::$instances)) || !self::$instances[$uuid]) self::$instances[$uuid] = new LC($params);
		return self::$instances[$uuid];
	}
	static function M($uuid = 'default') {
		return self::getInstance($uuid);
	}	
	static function UI($uuid = 'default') {
		return self::getInstance($uuid)->ui;
	}
}

if (!isset($LC_global_options)) $LC_global_options = array();
LC::getInstance('default',$LC_global_options);

?>