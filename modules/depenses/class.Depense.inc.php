<?php

class Depense extends Entity {

	public static $classname = 'Depense';
	public static $fields = array('id','user_id','cost','comment','date','repeat','targeted_users','created','updated','deleted');
	public static $table = 'lc_depenses';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $user_id;
	protected $cost;
	protected $comment;
	protected $date;
	protected $repeat;
	protected $targeted_users;
	protected $date_created;
	protected $date_updated;
	
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
	
	// Static Methods
	static function getDepensesForUser($user_id,$order = false,$as_array = false,$include_deleted = false) {
		return parent::get(self::$classname,array('user_id' => $user_id),$order,$as_array,$include_deleted);
	}
	
	static function getSumForUser($user_id) {
		return GDB::GetOne("SELECT SUM(cost) FROM ".self::$table." WHERE user_id = ?",array($user_id));
	}

	static function getSumForGroup($group_id) {
		return GDB::GetOne("SELECT SUM(cost) FROM ".self::$table." WHERE user_id IN (SELECT id FROM ".User::$table." WHERE group_id = ?)",array($group_id));
	}

}