<?php

class Depense {

	static protected $_tablename = 'gestio_depenses';
	static protected $_primary = 'id';
	static protected $_cols = array('id','user','cost','comment','recursive','date_created','date_updated');
	
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $user;
	protected $cost;
	protected $comment;
	protected $recursive;
	protected $date_created;
	protected $date_updated;
	
	protected $edited_fields = array();
	
	public function __construct($primary,$data) {
	
		if($data && count($data) > 0) {
			foreach(self::$_cols as $col) {
				$this->$col = $data[$col];
			}
		}
		
		if (!empty($primary)) {
			if ($data && count($data) > 0) {
				$this->$_primary = $primary;
			}
			else {
		       	$res = GDB::Execute("SELECT * FROM ".self::$_tablename."  WHERE ".self::$_primary."='{$primary}' LIMIT 1;");
		    	if (!$res->EOF){
		    		foreach(self::$_cols as $col) {
		    			$this->$col = $res->fields[$col];
		    		}
		    	}
		    	else return null;
			}
		}
		else return null;
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}
	public function get($fieldname) {
		return $this->$fieldname;
	}
	public function set($fieldname,$value,$no_flag = false) {
		$this->$fieldname = $value;
		if (!$no_flag && !in_array($fieldname,$this->edited_fields)) {
			$this->edited_fields[] = $fieldname;
		}
	}
	
	public function save() {
		
		$data = array();
		
		//make sure changes have been made
		if (count($this->edited_fields) == 0) return false;
		
		// get all the changes made
		foreach($this->edited_fields as $field) {
			$data[$field] = $this->$field;
		}
		
		// save update time
		if (in_array('date_updated',self::$_cols)) $data['date_updated'] = time();
		
		// update db
		if ($this->$_primary) {
			$update_res = GDB::Update(self::$_tablename,$data,$_primary."=".$this->$_primary);
		}
		// insert in db
		else {
			if (in_array('date_created',self::$_cols)) $data['date_created'] = time();
			$insert_res = GDB::Insert(self::$tablename,$data);
		}
	}

	// Static Methods
	
	static function getDepensesForUser($user_id) {
	
	}

}