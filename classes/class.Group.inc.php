<?php

class Group extends Entity {

	public static $classname = 'Group';
	public static $fields = array('id','name','devise','created','updated','deleted');
	public static $table = 'lc_groups';
	
	public static $link_table = 'lc_user_group';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $name;
	protected $devise;
	protected $created;
	protected $updated;
	protected $deleted;
	
	public function __construct($id,$infos = false){
	
		$this->_classname = self::$classname;
		$this->_fields = self::$fields;
		$this->_table = self::$table;
	
		parent::__construct($id,$infos);
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}
	public function getDevise() { return $this->get_var('devise','€'); }
	public function getName() { return $this->get_var('name'); }
	
	public function getUsers($only_ids = false,$include_deleted = false) {
		$users = array();
		$sql = "SELECT * FROM ".self::$link_table." l, ".User::$table." u WHERE u.id = l.user_id";
		if (!$include_deleted) $sql .= " AND l.deleted = 0";
		$sql .= " AND group_id = ?";
		$db_res = GDB::db()->GetAll($sql,array($this->id));
		if (is_array($db_res)) {
			foreach($db_res as $row) {
				if ($only_ids) array_push($users,$row['user_id']);
				else array_push($users,new User($row['user_id'],$row));
			}
		}
		return $users;
	}

	static public function switchGroup($user,$new_group_id) {
		if (empty($user) || !$user->getId() || empty($new_group_id)) return false;
		
		// make sure the user is in old  group
		if (!$user->isInGroup($new_group_id)) return false;
		
		$current_group_id = $user->getCurrentGroup(true);
		
		// make sure the group is not the same as the old one
		if ($current_group_id == $new_group_id) return false;
		
		// remove from old group
		GDB::db()->Execute("UPDATE ".Group::$link_table." SET current = 0, updated = ".time()." WHERE user_id = ".$user->getId()." AND group_id = ".$current_group_id);
		
		// add to new group
		GDB::db()->Execute("UPDATE ".Group::$link_table." SET current = 1, updated = ".time()." WHERE user_id = ".$user->getId()." AND group_id = ".$new_group_id);
		
		return true;
	}

}