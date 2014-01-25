<?php

class Feedback extends Entity {

	public static $classname = 'Feedback';
	public static $fields = array('id','user_id','title','message','error','date');
	public static $table = 'lc_feedback';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	protected $id;
	protected $user_id;
	protected $title;
	protected $message;
	protected $error;
	protected $date;
	
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
	//public function getDevise() { return $this->get_var('devise','€'); }

}