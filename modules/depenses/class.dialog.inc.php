<?php

require_once "class.DepenseApp.inc.php";
require_once "class.Depense.inc.php";
require_once "class.DepenseArchive.inc.php";

class Dialog_depenses {

	private $app = false;

	private function init() {
		if (!$this->app) $this->app = new DepenseApp();
	}
	
	public function addDepense($p) {
		$this->init();
		if (empty($p['cost'])) return array('message' => lang('you_cannot_add_an_empty_cost'),'type' => 'alert','go_back' => true);
		
		$p['user_id'] = LC::M()->user->getId();
		$p['group_id'] = LC::M()->user->getCurrentGroup(true);

		$this->app->addDepense($p);
		
		return $this->getAllInfos();
	}
	
	public function editDepense($p) {
		$this->init();
		if (empty($p['id'])) return null;
		if (empty($p['cost'])) return array('message' => lang('you_cannot_add_an_empty_cost'),'type' => 'alert','go_back' => true);
		
		$p['user_id'] = LC::M()->user->getId();
		$p['group_id'] = LC::M()->user->getCurrentGroup(true);

		if ($this->app->editDepense($p) === null) return null;
		
		return $this->getAllInfos();
	}
	
	public function deleteDepense($p) {
		$this->init();
		if ($this->app->deleteDepense($p['id']) === null) 
			return array('message' => lang('unable_to_delete_depense'),'type' => 'alert');
		
		return $this->getAllInfos();
	}
	
	public function archiveDepenses($p) {
		$this->init();
		$this->app->archiveDepenses();
		
		return $this->getAllInfos();
	}

	public function getAllInfos($p = array()) {
		$this->init();
		if (!empty($p['user_id']) && $p['user_id'] != LC::M()->user->getId() && !User::is_in_group($p['user_id'],LC::M()->user->getCurrentGroup(true))) 
			return array('message' => lang('no_rights_on_this_user'),'type' => 'alert');
		
		$users = array();
		$to_check = array();
		
		// load only current user
		if (!empty($p['user_id'])) array_push($to_check,$p['user_id']);
		// load all users from the group
		else {
			$gr = LC::M()->user->getCurrentGroup();
			$to_check = $gr->getUsers(true); 
		}
		
		// get totaux
		$tots = $this->app->getBalanceForGroup();
		
		foreach($to_check as $user_id) {
			
			$cur_depenses = Depense::getDepensesForUser($user_id,$gr->getId(),$order = false,$as_array = true,$include_deleted = false);
			
			$cur_paid = 0;
			if ($tots['paid'][$user_id]) $cur_paid = $tots['paid'][$user_id];
			$cur_balance = 0;
			if ($tots['balances'][$user_id]) $cur_balance = $tots['balances'][$user_id];
			
			$users[$user_id] = array(
				'depenses' => $cur_depenses,
				'paid' => $cur_paid,
				'balance' => $cur_balance
			);
		}
		
		// get archives
		$archives = DepenseArchive::getArchivesForGroup($gr->getId(),$order = false,$as_array = true,$include_deleted = false);		
		
		$infos = array(
			'users' => $users,
			'total' => $tots['total'],
			'owed' => $tots['owed'],
			'archives' => $archives,
			
		);
		
		return $infos;
	}
	
}


?>