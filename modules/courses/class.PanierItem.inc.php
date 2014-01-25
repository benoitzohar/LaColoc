<?php

class PanierItem extends Entity {

	public static $classname = 'PanierItem';
	public static $fields = array('id','user_id','panier_id','count','title','comment','price','priority','repeat','targeted_users','checked','created','updated','deleted');
	public static $table = 'lc_courses_panier_item';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $user_id;
	protected $panier_id;
	protected $count;
	protected $title;
	protected $comment;
	protected $price;
	protected $priority;
	protected $repeat;
	protected $targeted_users;
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
	

	// Static Methods
	static function getItemsForPanier($panier_id,$order = false,$as_array = false,$include_deleted = false) {
		return parent::get(self::$classname,array('panier_id' => $panier_id),$order,$as_array,$include_deleted);
	}

}