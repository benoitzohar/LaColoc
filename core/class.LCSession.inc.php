<?php
session_start();

class LCSession {

	public static $instance;
	public static $token_expire = 14400; // 4 hours
	public static $cookie_expire = 1296000; // 15 days

	private $session_prefix = 'lc';
	
	function __construct() {
		if (LC_IS_ADMIN === true) {
			$this->session_prefix = 'lc_admin';
		}
	}
	
	function createAuthForUser($login,$password,$remember = false,$already_salted = false) {
		if (!$already_salted) {
			$password = LC::M()->encodePassword($password);
		}
		
		if (!$login || !$password) return false;
		
		$current_user = User::get_user($login,$password);
		if (!$current_user) return false;

		// insert new auth row
		$this->createAuth(array(
			'user_id' => $current_user->getId(),
			'remember' => $remember
		),true);
		
		return true;
	}
	
	function loadUserFromAuth($auth = false) {
		if (!$auth) return false;
		$user = $auth->getUser();
		
		if (empty($user) || !$user->exists()) return false;

		//update IP and login time
		$user->set_var('last_login_time',time());
		$user->set_var('last_login_ip',$_SERVER['REMOTE_ADDR']);
		$user->set_var('last_activity_time',time());
		
		LC::M()->user = $user;
		LC::M()->auth = $auth;
		return true;
	}
	
	function createAuth($d = array(),$save_tokens_to_client = false) {
		if (empty($d['user_id'])) return false;
		if (empty($d['strategy'])) $d['strategy'] = 'lc';
		if (empty($d['token'])) $d['token'] = $this->generateToken($d['user_id']);
		if (empty($d['secret'])) $d['secret'] = $this->generateToken(time());
		
		if ($save_tokens_to_client) {
			$this->setSession('token',$d['token']);
			$this->setSession('secret',$d['secret']);
			if ($d['remember']) {
				$this->setCookie('token',$d['token']);
				$this->setCookie('secret',$d['secret']);
			}
		}
		
		$ua = new UserAuth(false,array(
			'user_id' => $d['user_id'],
			'strategy' => $d['strategy'],
			'token' => $d['token'],
			'secret' => $d['secret'],
			'remember' => ($d['remember']?1:0),
			'created' => time()
		));

		return $ua;
	}
	
	function logUserOut() {
		$this->deleteSession('token');
		$this->deleteSession('secret');
		$this->deleteCookie('token');
		$this->deleteCookie('secret');
		return true;
	}
	
	function userIsLogged() {
	
		if (!empty(LC::M()->user)) return true;
			
		// Try to login from the session
		$sess_auth = $this->getUserAuth($this->getSession('token'),$this->getSession('secret'));

		// if not try to log in from the cookies
		if (!$sess_auth) {
			$sess_auth = $this->getUserAuth($this->getCookie('token'),$this->getCookie('secret'));
		}
		return $sess_auth;
		
	}
	
	function getUserAuth($token = false,$secret = false) {
		if (empty($token) || empty($secret)) return null;
		$ua = UserAuth::getAuthFromToken($token,$secret);
		if (empty($ua) || intval($ua->getId()) < 1) return null; // make sure the auth exists
		
		// if local auth is expired => create a new one
		if ($ua->get_var('strategy') == 'lc' && (intval($ua->get_var('created'))+self::$token_expire) < time()) {
			
			$new_ua = $this->createAuth(array(
				'user_id' => $ua->get_var('user_id'),
				'remember' => $ua->get_var('remember')==1
			),true);
						
			return $new_ua;
		}
		
		return $ua;
	}
	
	public function handleOpauthCallback($o) {

		/**
		* Fetch auth response, based on transport configuration for callback
		*/
		$res = null;
		
		switch($o->env['callback_transport']){	
			case 'session':
				@session_start();
				$res = $_SESSION['opauth'];
				unset($_SESSION['opauth']);
				break;
			case 'post': $res = unserialize(base64_decode( $_POST['opauth'] )); break;
			case 'get':	$res = unserialize(base64_decode( $_GET['opauth'] ));	break;
		}
		
		/**
		 * Check if it's an error callback
		 */
		if (array_key_exists('error', $res)){
			return array(false,$res);
		}
		
		if (empty($res['auth']) || empty($res['timestamp']) || empty($res['signature']) || empty($res['auth']['provider']) || empty($res['auth']['uid'])){
			return array(false,"Missing OPauth arguments");
		}
		elseif (!$o->validate(sha1(print_r($res['auth'], true)), $res['timestamp'], $res['signature'], $reason)){
			return array(false,$reason);
		}
		else{error_log(__METHOD__.':'.__LINE__."\n".print_r($res,true));
			$token = $res['auth']['credentials']['token'];
			$secret = $res['auth']['credentials']['secret'];
			$provider = $res['auth']['provider'];
			$name = $res['auth']['info']['name'];
			$nickname = $res['auth']['info']['nickname'];
			if (empty($nickname)) $nickname = $res['auth']['uid'];
			$email = $res['auth']['info']['email'];
			if (empty($token) || empty($nickname)) return array(false,"Missing tokens");
			
			$login = $provider.'-'.$nickname;
			
			//test if token already exists
			$local_auth = $this->getUserAuth($token,$secret);
			if ($local_auth === null) {
				// check if the login has been used already
				if (!empty($email)) {
					@list($existing_user) = User::get('User',array('email' => $email),$order = false, $as_array = false, $include_deleted = false);
					
					if (LC::isAlpha() && !UserAuth::emailCanAlpha($email)) return array(false,"You_are_not_a_alpha_user");
					if (LC::isBeta() && !UserAuth::emailCanBeta($email)) return array(false,"You_are_not_a_beta_user");
					
				}
				else if (!empty($nickname)){
					@list($existing_user) = User::get('User',array('login' => $login),$order = false, $as_array = false, $include_deleted = false);
				}
				error_log(__METHOD__.':'.__LINE__."\n".print_r($existing_user,true));
				if (!empty($existing_user) && ($existing_user instanceof User)) {
					//use the existing user to allow credentials via opauth
					$local_auth = $this->createAuth(array(
						'user_id' => $existing_user->getId(),
						'strategy' =>  $provider,
						'remember' => true
					),true);
				}
				else {
					// create a new user
					list($nu_firstname,$nu_lastname) = explode(" ", $name);
					if (!empty($res['auth']['info']['first_name'])) $nu_firstname = $res['auth']['info']['first_name'];
					if (!empty($res['auth']['info']['last_name'])) $nu_lastname = $res['auth']['info']['last_name'];
					$nu_email = '';
					if (!empty($email)) $nu_email = $email;
					$img_url = $res['auth']['info']['image'];
					
					if ($provider == 'Twitter' && substr($img_url, -11) == '_normal.png') { // patch taille d'image twitter
						$img_url = str_replace('_normal.png', '_bigger.png',$img_url);
					}
					else if ($provider == 'Facebook' && substr($img_url, -12) == '?type=square') { //patch taille dimage facebook
						$img_url = str_replace('?type=square', '?type=large',$img_url);
					}
					
					$nu = new User(false,array(
						'login' => $login,
						'email' => $nu_email,
						'firstname' => $nu_firstname,
						'lastname' => $nu_lastname,
						'picture' => $img_url
					));
					
					// create an auth for this user
					$local_auth = $this->createAuth(array(
						'user_id' => $nu->getId(),
						'strategy' =>  $provider,
						'remember' => true
					),true);
				}
	
			}
			else { // if auth already exists : add credentials to session + cookie
				$this->setSession('token',$local_auth->get_var('token'));
				$this->setSession('secret',$local_auth->get_var('secret'));
				$this->setCookie('token',$local_auth->get_var('token'));
				$this->setCookie('secret',$local_auth->get_var('secret'));
			}
		}
		return array(true,"");
	}
	
	function generateToken($key = '') {
		if (!empty($key)) {
			return md5(uniqid($key, true));
		}
		return md5(uniqid(rand(), true));
	}
	
	function getSession($field = '') {
		if (empty($field) || !array_key_exists($this->session_prefix.'_'.$field,$_SESSION)) return false;
		return $_SESSION[$this->session_prefix.'_'.$field];
	}
	
	function setSession($field,$value = '') {
		$_SESSION[$this->session_prefix.'_'.$field] = $value;
		return true;
	}
	
	function deleteSession($field = '') {
		if (empty($field)) return false;
		$_SESSION[$this->session_prefix.'_'.$field] = '';
		unset($_SESSION[$this->session_prefix.'_'.$field]);
		return true;
	}
	
	function getCookie($field = '') {
		if (empty($field) || !array_key_exists($this->session_prefix.'_'.$field,$_COOKIE)) return false;
		return $_COOKIE[$this->session_prefix.'_'.$field];	
	}
	
	function setCookie($field,$value = '') {
		$time = time() + self::$cookie_expire;
		setcookie($this->session_prefix."_".$field, $value, $time,'/','lacoloc.fr');
		return true;
	}
	
	function deleteCookie($field = '') {
		if (empty($field)) return false;
		setcookie($this->session_prefix."_".$field,'',time() - 3600,'/','lacoloc.fr');
		return true;
	}
	
	/**
	 *	Static Functions
	 **/
	
	static function getInstance() {
		if (empty(self::$instance)) {
			self::$instance = new LCSession();
		}
		return self::$instance;
	}
	
	static function checkLogin($from_api = false) { 
	
	error_log('-------------------------------------------------');
	error_log('-------------------------------------------------');
	error_log('-------------------------------------------------');
	//error_log(__METHOD__.':'.__LINE__."\n".print_r($_SESSION,true));
	//error_log(__METHOD__.':'.__LINE__."\n".print_r($_COOKIE,true));
	
		$inst = self::getInstance();
		$p = $_REQUEST;
		if (array_key_exists('action',$p) && $p['action'] == 'auth') {
			
			switch ($p['option']) {
				
				// standard login
				case 'login' :
					if (!empty($p['login']) && !empty($p['password'])) {
						$logged_in = $inst->createAuthForUser($p['login'],$p['password'],!empty($p['remember_me']),false);
					}
				break;
				
				case 'logout' :
					$inst->logUserOut();
					if (!$from_api) {
						$url = LC::$url;
						if (LC_IS_ADMIN === true) $url .= 'admin/';					
						header('Location: '.$url);
						exit;
					}
					else {
						json_exit(true,$p);
					}
				break;
				
				case 'signup':
					error_log(__METHOD__.':'.__LINE__."\n".print_r($_POST,true));
					
					$firstname = $_POST['firstname'];
					$lastname = $_POST['lastname'];
					$email = $_POST['email'];
					$password = $_POST['password'];
					
					if (empty($email)) json_exit(false,false,lang('Please_specifiy_an_email_address'));
					if (!isValidEmail($email)) json_exit(false,false,lang('This_is_not_a_valid_email_address'));
					if (empty($password)) json_exit(false,false,lang('Please_specifiy_a_password'));
					
					// make sure the user does not exist already
					$existing_user = false;
					@list($existing_user) = User::get('User',array('email' => $email),$order = false, $as_array = false, $include_deleted = false);
					if (!empty($existing_user)) json_exit(false,false,lang('This_email_address_is_already_taken'));
					
					
					// check alpha / beta versions
					if (LC::isAlpha() && !UserAuth::emailCanAlpha($email))  json_exit(false,false,lang('This_is_a_closed_alpha_version_you_cannot_create_an_account'));
					if (LC::isBeta() && !UserAuth::emailCanBeta($email)) json_exit(false,false,lang('This_is_a_closed_beta_version_you_need_to_get_invited'));
					
					// Create new users
					$nu = new User(false,array(
						'login' => $email,
						'email' => $email,
						'firstname' => $firstname,
						'lastname' => $lastname
					));
					
					//save password
					//@TODO
					
					// create an auth for this user
					$local_auth = $inst->createAuth(array(
						'user_id' => $nu->getId(),
						'strategy' =>  'lc',
						'remember' => true
					),true);
					
					
					json_exit(true);
				break;
				
				case 'callback':				
					$auth_config = LC::$config['auth'];
					require_once LC::$path.'libs/Opauth/Opauth.php';
					$Opauth = new Opauth($auth_config,false);
					list($opauth_res_status,$opauth_res_content) = $inst->handleOpauthCallback($Opauth);
					error_log(__METHOD__.':'.__LINE__.' var $opauth_res_status > '.$opauth_res_status);
					error_log(__METHOD__.':'.__LINE__.' var $opauth_res_content > '.$opauth_res_content);
					header("Location: ".LC::$url);
					exit();
				break;
				default:
					$auth_config = LC::$config['auth'];
					require_once LC::$path.'libs/Opauth/Opauth.php';
					$Opauth = new Opauth( $auth_config );
					exit();
				break;
				
			}
			
		} 
		

		$auth = $inst->userIsLogged();
		if (!empty($auth)) $load_res = $inst->loadUserFromAuth($auth);
		if (empty($auth) || empty($load_res)) {
			if (!$from_api) {
				if (LC::M()->tpl) {
					LC::UI()->tadd('title',lang('la Coloc\''));
					$login_tpl = 'login.tpl';
					if (LC_IS_ADMIN === true) $login_tpl = 'admin/'.$login_tpl;
					LC::UI()->display(false,$login_tpl);
					exit;
				}
			}
			return false;
		}		
		
		LC::M()->user->set_var('last_activity_time',time(),true);
		
		return true;
	}
	
	
	
}
?>