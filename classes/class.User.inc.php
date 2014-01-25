<?php

class User extends Entity {
	
	public static $classname = 'User';
	public static $fields = array('id','login','email','passwd','firstname','lastname','last_login_time','last_login_ip','last_activity_time','picture','created','updated','deleted');
	public static $private_fields = array('passwd','last_login_ip');
	public static $table = 'lc_users';
	
	protected $_classname;
	protected $_fields = array();
	protected $_private_fields = array();
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	
	protected $id;
	protected $login;
	protected $email;
	protected $passwd;
	protected $firstname;
	protected $lastname;
	protected $last_login_time;
	protected $last_login_ip;
	protected $last_activity_time;
	protected $picture;
	protected $created;
	protected $updated;
	protected $deleted;
	
	private $current_group = false;
	

	public function __construct($id,$infos = false){
		$this->_classname = self::$classname;
		$this->_fields = self::$fields;
		$this->_table = self::$table;
		if (self::$private_fields) $this->_private_fields = self::$private_fields;
	
		parent::__construct($id,$infos);
	}
	
	public function getFullname() {
		return $this->get_var('firstname').' '.$this->get_var('lastname');
	}
	
	public function setPassword($new_password) {
		return $this->set_var('passwd',LC::encodePassword($new_password));
	}
	
	public function getCurrentGroup($only_id = false) {
		if ($this->current_group) {
			if ($only_id == true) return $this->current_group->getId();
			return $this->current_group;
		}
		$db_res = GDB::db()->GetAll("SELECT group_id FROM ".Group::$link_table." WHERE user_id = ? AND current = 1",array($this->id));
		if (is_array($db_res) && count($db_res) == 1 && isset($db_res[0]['group_id'])) {
			$this->current_group = new Group($db_res[0]['group_id']);
			if ($only_id == true) return $this->current_group->getId();
			return $this->current_group;
		}
		return false;
	}
	
	public function getGroups($only_id = false) {
		$groups = array();
		$db_res = GDB::db()->GetAll("SELECT group_id FROM ".Group::$link_table." WHERE user_id = ?",array($this->id));
		if (is_array($db_res)) {
			foreach($db_res as $cur_gr_raw) {
				$cur_gr_id = $cur_gr_raw['group_id'];
				if (empty($cur_gr_id)) continue;
				if ($only_id == true) array_push($groups,$cur_gr_id);
				else array_push($groups,new Group($cur_gr_id));
			}
		}
		return $groups;
	}
	
	public function isInGroup($group_id) {
		if (empty($group_id)) return false;
		$groups = $this->getGroups(true);
		foreach($groups as $group) {
			if ($group && $group == $group_id) return true;
		}
		return false;
	}
	
	
	/**
	 *	Static functions
	 **/


    public static function get_user($login,$passwd = false){
    	$login = mysql_real_escape_string($login);
    	if (isset($passwd) && $passwd !== false) {
    		$passwd = mysql_real_escape_string($passwd);
    		$query = "SELECT id FROM ".self::$table." WHERE login = '{$login}' AND passwd = '{$passwd}' LIMIT 1;";
    	}
    	else {
    		$query = "SELECT id FROM ".self::$table." WHERE login = '{$login}' LIMIT 1;";
    	}
    	$sql = GDB::Execute($query);
    	if (!$sql->EOF){
    		return new User($sql->fields['id']);
    	}
    	return false;
    }
    
    public static function is_in_group($user_id = false,$group_id = false){
	    if ($user_id === false || $group_id === false) return false;
	    $group = new Group($group_id);
	    $users_in_group = $group->getUsers(true); // get only IDs
	    return in_array($user_id,$group_id);
    }
   
	static public function get_lang_fields(){
		$res = array();
		foreach (self::$fields as $field)
			array_push($res,lang($field));
		return $res;
	}
}

?>