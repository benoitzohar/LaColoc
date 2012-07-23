<?php

class DepenseApp {

	private $error_msg = array();
	
	private $editable_fields = array('user_id','cost','comment','date','repeat','targeted_users');

	public function __construct() {
		
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}
	
	public function addDepense($p) {
		//clean cost
		$p['cost'] = str_replace(',','.',$p['cost']);
		// create depense
		new Depense(false,clean_array($p,$this->editable_fields));
	}
	
	public function deleteDepense($id) {
		$dep = new Depense($id);
		$dep->set_var('deleted',time());
		return true;
	}
	
	public function editDepense($p) {
		if (!$p['id']) return null;
		$dep = new Depense($p['id']);
		$c = clean_array($p,$this->editable_fields);
		foreach($c as $k => $v) {
			$dep->set_var($k,$v);
		}
	}
	
	public function updateTotal() {
		
	}
	
	public function getBalance($user_id = false) {
		if (empty($user_id)) return 0;
		return 42;
	}
	
	public function getTotal() {
		return 99;
	}
	
	
}