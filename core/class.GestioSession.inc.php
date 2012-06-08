<?php
session_start();

class GestioSession {

	public static $instance;
	
	/**
	 *	Cookie length
	 *	Time of cookie availability (default : 2592000 => 30 days)
	 **/
	private $cookie_length = 2592000;
	
	private $session_prefix = 'gestio';
	
	function __construct() {
		
		if (GESTIO_IS_ADMIN === true) {
			$this->session_prefix = 'gestio_admin';
		}
	
	}
	
	function logUserIn($login,$password,$remember = false,$already_salted = false) {
		if (!$already_salted) {
			$password = Gestio::encodePassword($password);
		}
		
		if (GESTIO_IS_ADMIN === true) {
			if (!$password) return false;
			Gestio::$admin = ($password == Gestio::$admin_password);
			if (Gestio::$admin !== true) return false;
			$this->setSession('password',$password);
			if ($remember) {
				$this->setCookie('password',$password);
			}
			return true;
		}
		else {
	
			if (!$login || !$password) return false;
			
			$current_user = gestio_user::get_user($login,$password);
			if (!$current_user) return false;
			$this->setSession('login',$login);
			$this->setSession('password',$password);
			if ($remember) {
				$this->setCookie('login',$login);
				$this->setCookie('password',$password);
			}
			//update IP and login time
			$current_user->set_var('last_login_time',time());
			$current_user->set_var('last_login_ip',$_SERVER['REMOTE_ADDR']);
			
			Gestio::$user = $current_user;
			return true;
		}
		return false;
	}
	
	function logUserOut() {
		
		$this->deleteSession();
		$this->deleteCookie('login');
		$this->deleteCookie('password');
		return true;
		
	}
	
	function userIsLogged() {
	
		if (GESTIO_IS_ADMIN === true) {
			if (Gestio::$admin === true) return true;
			// Try to login from the session
			$session_login = $this->logUserIn(false,$this->getSession('password'),false,true);
			
			// if not try to log in from the cookies
			if (!$session_login) {
				$cookie_login = $this->logUserIn(false,$this->getCookie('password'),false,true);
			}
	
			return ($session_login || $cookie_login);
		}
		else {	
			if (!empty(Gestio::$user)) return true;
			
			// Try to login from the session
			$session_login = $this->logUserIn($this->getSession('login'),$this->getSession('password'),false,true);
			
			// if not try to log in from the cookies
			if (!$session_login) {
				$cookie_login = $this->logUserIn($this->getCookie('login'),$this->getCookie('password'),false,true);
			}
	
			return ($session_login || $cookie_login);
		}
		return false;
	}
	
	
	function getSession($field = '') {
		if (empty($field)) return false;
		return $_SESSION[$this->session_prefix][$field];
	}
	
	function setSession($field,$value = '') {
		$_SESSION[$this->session_prefix][$field] = $value;
		return true;
	}
	
	function deleteSession() {
		$_SESSION[$this->session_prefix] = false;
		unset($_SESSION[$this->session_prefix]);
		return true;
	}
	
	function getCookie($field = '') {
		if (empty($field)) return false;
		return $_COOKIE[$this->session_prefix][$field];	
	}
	
	function setCookie($field,$value = '') {
		$time = time() + $this->cookie_length;
		setcookie($this->session_prefix."[".$field."]", $value, $time);
		return true;
	}
	
	function deleteCookie($field = '') {
		if (empty($field)) return false;
		setcookie($this->session_prefix."[".$field."]", time() - 3600);
		return true;
	}
	
	static function getInstance() {
		if (empty(self::$instance)) {
			self::$instance = new GestioSession();
		}
		return self::$instance;
	}
	
	static function checkLogin() {
	
		self::getInstance();
		
		if (GESTIO_IS_ADMIN === true) {
			if (!empty($_POST['password'])) {
				$logged_in = self::getInstance()->logUserIn(false,$_POST['password'],!empty($_POST['remember_me']),false);
			}
		}
		else if (!empty($_POST['login']) && !empty($_POST['password'])) {
			$logged_in = self::getInstance()->logUserIn($_POST['login'],$_POST['password'],!empty($_POST['remember_me']),false);
		}
		
		if ($_REQUEST['action'] == 'logout'){
			self::getInstance()->logUserOut();
			$url = Gestio::$url;
			if (GESTIO_IS_ADMIN === true) $url .= 'admin/';
			header('Location: '.$url);
			exit;
		}
		
		if (!self::$instance->userIsLogged()) {	
			Gestio::$tpl->assign('title',lang('la Coloc\''));
			$login_tpl = 'login.tpl';
			if (GESTIO_IS_ADMIN === true) $login_tpl = 'admin/'.$login_tpl;
			Gestio::display(false,$login_tpl);
			exit;
		}
	}
	
	
}
?>