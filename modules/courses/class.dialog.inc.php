<?php

require_once "class.CoursesApp.inc.php";
require_once "class.Panier.inc.php";
require_once "class.PanierItem.inc.php";

class Dialog_courses {

	private $app = false;

	private function init() {
		if (!$this->app) $this->app = new CoursesApp();
	}
	
	/**
	 *	Panier
	 **/
	
	public function addPanier($p) {
		$this->init();
		$p['group_id'] = LC::M()->user->getCurrentGroup(true);
		$this->app->addPanier($p);
		return $this->getAllInfos();
	}

	public function editPanier($p) {
		$this->init();
		if (empty($p['id'])) return null;
		$p['group_id'] = LC::M()->user->getCurrentGroup(true);
		if ($this->app->editPanier($p) === null) return null;
		return $this->getAllInfos();
	}
	
	public function deletePanier($p) {
		$this->init();
		if ($this->app->deletePanier($p['id']) === null) 
			return array('message' => lang('unable_to_delete_cart'),'type' => 'alert');
		
		return $this->getAllInfos();
	}

	/**
	 *	Panier item
	 **/
	
	public function addPanierItem($p) {
		$this->init();
		$p['user_id'] = LC::M()->user->getId();
		$this->app->addPanierItem($p);
		return $this->getAllInfos();
	}
	
	public function editPanierItem($p) {
		$this->init();
		if (empty($p['id'])) return null;
		$p['user_id'] = LC::M()->user->getId();
		if ($this->app->editPanierItem($p) === null) return null;
		return $this->getAllInfos();
	}
	
	public function deletePanierItem($p) {
		$this->init();
		if ($this->app->deletePanierItem($p['id']) === null) 
			return array('message' => lang('unable_to_delete_cart_item'),'type' => 'alert');
		
		return $this->getAllInfos();
	}
	
	
	public function getAllInfos($p = array()) {
		$this->init();
		if (!empty($p['user_id']) && $p['user_id'] != LC::M()->user->getId() && !User::is_in_group($p['user_id'],LC::M()->user->getCurrentGroup(true))) 
			return array('message' => lang('no_rights_on_this_user'),'type' => 'alert');
		
		$paniers = array();
		$panier_objects = Panier::getPaniersForGroup(LC::M()->user->getCurrentGroup(true));
		if ($panier_objects && count($panier_objects)> 0) {
			foreach($panier_objects as $pan) {
				$pan_ar = $pan->toArray();
				$pan_ar['items'] = array();
				$pan_its = PanierItem::getItemsForPanier($pan->getId(),$order = false,$as_array = true,$include_deleted = false);
				if ($pan_its) {
					foreach($pan_its as $pan_it) {
						$pan_ar['items'][$pan_it['id']] = $pan_it;
					}
				}
				$paniers[$pan->getId()] = $pan_ar;
			}
		}
	
		$infos = array(
			'paniers' => $paniers
		);
		
		return $infos;
	}
	
}


?>