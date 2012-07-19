<?php

require_once "class.DepenseApp.inc.php";
require_once "class.Depense.inc.php";

class Dialog_depenses {

	private $app = false;

	private function init() {
		if (!$this->app) $this->app = new DepenseApp();
	}
	
	public function addDepense($p) {
		$this->init();
		if (empty($p['cost'])) return array('message' => lang('you_cannot_add_an_empty_cost'),'type' => 'alert','go_back' => true);
		
		$p['user_id'] = LC::M()->user->getId();

		$this->app->addDepense($p);
		$this->app->updateTotal();
		
		return $this->getAllInfos();
	}
	
	public function editDepense($p) {
		$this->init();
		if (empty($p['id'])) return null;
		if (empty($p['cost'])) return array('message' => lang('you_cannot_add_an_empty_cost'),'type' => 'alert','go_back' => true);
		
		$p['user_id'] = LC::M()->user->getId();
		
		if ($this->app->editDepense($p) === null) return null;
		$this->app->updateTotal();
		
		return $this->getAllInfos();
	}
	
	public function deleteDepense($p) {
		$this->init();
		if ($this->app->deleteDepense($p['id']) === null) 
			return array('message' => lang('unable_to_delete_depense'),'type' => 'alert');
		$this->app->updateTotal();
		
		return $this->getAllInfos();
	}

	public function getAllInfos($p = array()) {
		$this->init();
		if (!empty($p['user_id']) && $p['user_id'] != LC::M()->user->getId() && !User::is_in_group($p['user_id'],LC::M()->user->getGroup(true))) 
			return array('message' => lang('no_rights_on_this_user'),'type' => 'alert');
		
		$users = array();
		$to_check = array();
		
		// load only current user
		if (!empty($p['user_id'])) array_push($to_check,$p['user_id']);
		// load all users from the group
		else {
			$gr = LC::M()->user->getGroup();
			$to_check = $gr->getUsers(true); 
		}
		
		foreach($to_check as $user_id) {
			
			$cur_depenses = Depense::getDepensesForUser($user_id,$order = false,$as_array = true,$include_deleted = false);
			
			$users[$user_id] = array(
				'depenses' => $cur_depenses,
				'balance' => $this->app->getBalance($user_id)
			);
		}
		
		$infos = array(
			'users' => $users,
			'total' => $this->app->getTotal()
		);
		
		return $infos;
	}
	
}


?>