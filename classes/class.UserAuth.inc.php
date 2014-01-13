<?php

class UserAuth extends Entity {
	
	public static $classname = 'UserAuth';
	public static $fields = array('id','strategy','user_id','token','secret','remember','created');
	public static $private_fields = array();
	public static $table = 'lc_user_auths';
	
	protected $_classname;
	protected $_fields = array();
	protected $_private_fields = array();
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $strategy;
	protected $user_id;
	protected $token;
	protected $secret;
	protected $remember;
	protected $created;
	
	

	public function __construct($id,$infos = false){
		$this->_classname = self::$classname;
		$this->_fields = self::$fields;
		$this->_table = self::$table;
		if (self::$private_fields) $this->_private_fields = self::$private_fields;
	
		parent::__construct($id,$infos);
	}
	
		
	public function getUser($only_id = false) {
		$user_id = $this->get_var('user_id');
		if (empty($user_id)) return false;
		if ($only_id) return $user_id;
		return new User($user_id);
	}
	
	
	/**
	 *	Static functions
	 **/
	
	static public function getAuthFromToken($token = '',$secret = '') {
		if (empty($token) || empty($secret)) return null;
		$token = mysql_real_escape_string($token);
		$secret = mysql_real_escape_string($secret);
		$sql = GDB::Execute("SELECT id FROM ".self::$table." WHERE token = '".$token."' AND secret = '".$secret."' ORDER BY created DESC LIMIT 1");
    	if (!$sql->EOF){
    		return new UserAuth($sql->fields['id']);
    	}

		return null;
	}
	
    static public function get_user($login,$passwd = false){
    	$login = mysql_real_escape_string($login);
    	if (isset($passwd) && $passwd !== false) {
    		$passwd = mysql_real_escape_string($passwd);
    		$query = "SELECT id FROM ".self::$table." WHERE email = '{$login}' AND passwd = '{$passwd}' LIMIT 1;";
    	}
    	else {
    		$query = "SELECT id FROM ".self::$table." WHERE email = '{$login}' LIMIT 1;";
    	}
    	$sql = GDB::Execute($query);
    	if (!$sql->EOF){
    		return new User($sql->fields['id']);
    	}
    	return false;
    }
    
    static public function emailCanAlpha($email = '') {
	    if (empty($email)) return false;
	    @list($count) = GDB::GetRow("SELECT COUNT(*) FROM lc_alpha_users WHERE email = '".mysql_real_escape_string($email)."' LIMIT 1"); 
	    return ($count == 1);
    }
    
    static public function emailCanBeta($email = '') {
	    if (empty($email)) return false;
	    @list($count) = GDB::GetRow("SELECT COUNT(*) FROM lc_beta_users WHERE email = '".mysql_real_escape_string($email)."' LIMIT 1");
	    return ($count == 1);
    }
    
 }

?>