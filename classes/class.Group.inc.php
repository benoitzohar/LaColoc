<?php

class Group extends Entity {

	public static $classname = 'Group';
	public static $fields = array('id','name','devise','created','updated','deleted');
	public static $table = 'lc_groups';
	
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
	
	public function getUsers($only_ids = false,$include_deleted = false) {
		$users = array();
		$db_res = GDB::db()->GetAll("SELECT * FROM ".User::$table." WHERE group_id = ?",array($this->id));
		if (is_array($db_res)) {
			foreach($db_res as $row) {
				if ($only_ids) array_push($users,$row['id']);
				else array_push($users,new User($row['id'],$row));
			}
		}
		return $users;
	}
	
	// Static Methods
	static function getDepensesForUser($user_id,$order = false,$as_array = false,$include_deleted = false) {
		
	}

}