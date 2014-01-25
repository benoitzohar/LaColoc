<?php

class Preference extends Entity {
	
	public static $classname = 'Preference';
	public static $fields = array('id','app','user_id','group_id','name','val','created','updated');
	public static $table = 'lc_preferences';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	
	protected $id;
	protected $app;
	protected $user_id;
	protected $group_id;
	protected $name;
	protected $val;
	protected $created;
	protected $updated;

	public function __construct($id,$infos = false){
		$this->_classname = self::$classname;
		$this->_fields = self::$fields;
		$this->_table = self::$table;
	
		parent::__construct($id,$infos);
	}
	
	static function getPreferencesForUser($user_id = 0,$preference_name = '',$app = '',$as_array = false,$order = '') {
		if (empty($user_id)) return false;
		if (empty($app)) $app = 'main';
		$where = array('user_id' => $user_id);
		if (!empty($preference_name)) $where['name'] = $preference_name;
		return parent::get(self::$classname,$where,$order,$as_array,true);
	}
	
	static function getPreferencesForGroup($group_id = 0,$preference_name = '',$app = '',$as_array = false,$order = '') {
		if (empty($group_id)) return false;
		if (empty($app)) $app = 'main';
		$where = array('group_id' => $group_id);
		if (!empty($preference_name)) $where['name'] = $preference_name;
		return parent::get(self::$classname,$where,$order,$as_array,true);
	}
	
	
	
}

?>