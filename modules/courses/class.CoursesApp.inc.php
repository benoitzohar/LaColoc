<?php

class CoursesApp {

	private $error_msg = array();
	
	private $editable_fields_panier = array('group_id');
	private $editable_fields_panier_item = array('user_id','panier_id','count','title','comment','price','priority','repeat','targeted_users','checked');

	public function __construct() {
		
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}
	
	/**
	 *	Panier
	 */
	
	public function addPanier($p) {
		// create panier
		new Panier(false,clean_array($p,$this->editable_fields_panier));
		return true;
	}
	
	public function deletePanier($id) { error_log(__METHOD__.':'.__LINE__."\n".print_r(func_get_args(),true));
		/*$pan = new Panier($id);
		$pan->set_var('deleted',time());
		$items = PanierItem::getItemsForPanier($id);
		foreach($items as $item) {
			$item->set_var('deleted',time());
		}*/
		return true;
	}
	
	public function editPanier($p) {
		if (!$p['id']) return null;
		$pan = new Panier($p['id']);
		$c = clean_array($p,$this->editable_fields_panier);
		foreach($c as $k => $v) {
			$pan->set_var($k,$v);
		}
		return true;
	}
	
	/**
	 *	PanierItem
	 **/
	
	public function addPanierItem($p) {

		if (empty($p['panier_id']) || $p['panier_id'] == 'false') { // create new panier if necessary
			$cur_group = LC::M()->user->getCurrentGroup(true);
			if (!$cur_group) return null;
			$panier = new Panier(false,array('group_id' => $cur_group));
			$p['panier_id'] = $panier->getId();
		}
		// create panier item
		new PanierItem(false,clean_array($p,$this->editable_fields_panier_item));
		return true;
	}
	
	public function deletePanierItem($id) {
		$pan = new PanierItem($id);
		$pan->set_var('deleted',time());
		return true;
	}
	
	public function editPanierItem($p) {
		if (!$p['id']) return null;
		$pan = new PanierItem($p['id']);
		$c = clean_array($p,$this->editable_fields_panier_item);
		foreach($c as $k => $v) {
			$pan->set_var($k,$v);
		}
		return true;
	} 
	
	
}