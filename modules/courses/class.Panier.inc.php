<?php

class Panier extends Entity {

	public static $classname = 'Panier';
	public static $fields = array('id','group_id','checked','created','updated','deleted');
	public static $table = 'lc_courses_panier';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $group_id;
	protected $checked;
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
	
	public function getItems($order = false,$as_array = false,$include_deleted = false) {
		PanierItem::getItemsForPanier($this->id,$order,$as_array,$include_deleted);
	}
	
	// Static Methods
	
	static function getPaniersForGroup($group_id,$order = false,$as_array = false,$include_deleted = false) {
		return parent::get(self::$classname,array('group_id' => $group_id),$order,$as_array,$include_deleted);
	}


}