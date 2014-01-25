<?php

class DepenseApp {

	private $error_msg = array();
	
	private $editable_fields = array('user_id','group_id','cost','comment','date','repeat','targeted_users');

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
		return true;
	}
	
	public function archiveDepenses() {
		
		$archive = array();
		$gr = LC::M()->user->getCurrentGroup();
		$to_check = $gr->getUsers(true); 
		
		foreach($to_check as $user_id) {
			
			$cur_depenses = Depense::getDepensesForUser($user_id,$gr->getId(),$order = false,$as_array = false,$include_deleted = false);
			if ($cur_depenses && count($cur_depenses) > 0) {
				foreach($cur_depenses as $cur_depense) {
					array_push($archive,$cur_depense->toArray());
					$cur_depense->delete();
				}
			}
		}
		
		new DepenseArchive(false,array(
			'group_id' => $gr->get_var('id'),
			'user_id'  =>  LC::M()->user->get_var('id'),
			'content'  => json_encode($archive),
			'created'  => time()
		));

		
	}
	
	public function getBalanceForGroup() {
		$gr = LC::M()->user->getCurrentGroup();
		if (!$gr) return false;
		
		$group_users_ids = $gr->getUsers(true,true);

		$total_paid = array();
		$total_owed = array();
		$balances = array();
		$grand_total = 0;
	
		$deps =  Depense::getDepensesForGroup($gr->getId(),$order = false,$as_array = false,$include_deleted = false);		
		foreach($deps as $dep) {
			$uid = $dep->get_var('user_id');
			
			// get value
			$val = floatval($dep->get_var('cost'));
			
			// get concerned users
			$users = @json_decode($dep->get_var('targeted_users'));
			if (empty($users)) $users = $group_users_ids; // by default : everyone is concerned
			
			// get price owed by everyone
			foreach($users as $cur_uid) {
				if (!$total_owed[$cur_uid]) $total_owed[$cur_uid] = 0; // init
				$total_owed[$cur_uid] += floatval($val/count($users));
			}
			
			// total paid
			if (!$total_paid[$uid]) $total_paid[$uid] = 0;
			$total_paid[$uid] += $val;
			
			// total for everybody
			$grand_total += $val;
		}
		
		$nb_of_parts = count($group_users_ids);
		
		// get balances
		foreach($group_users_ids as $cur_uid) {
			if (!$balances[$cur_uid]) $balances[$cur_uid] = 0;
			$balances[$cur_uid] = floatval($total_paid[$cur_uid] - $total_owed[$cur_uid]);
		}
		
		// Get owed
		$owed = array();
		
		$tmp_bal = $balances;
		
		while (count($tmp_bal) > 0) {
			asort($tmp_bal); // from less expensive to most expensive
			$akeys = array_keys($tmp_bal);
			
			// get first key
			$fk = $akeys[0];
			// get last key
			$lk = $akeys[count($akeys)-1];
			// take the less expensive (it should be negative)
			$diff = round($tmp_bal[$fk],2) + round($tmp_bal[$lk],2);
			if ($diff == 0) { // exact amout : delete both
				if(!$owed[$fk]) $owed[$fk] = array();
				$owed[$fk][$lk] = round(0-$tmp_bal[$fk],2);
				unset($tmp_bal[$lk]);
				unset($tmp_bal[$fk]);
			}
			else if ($diff > 0) { // owed more : remove the first (less exp) and do the substraction
				if(!$owed[$fk]) $owed[$fk] = array();
				$owed[$fk][$lk] = round(0-$tmp_bal[$fk],2);
				$tmp_bal[$lk] += $tmp_bal[$fk];
				unset($tmp_bal[$fk]);
			}
			else if ($diff < 0) { // owed less : remove the last (most exp.) and do the sub.
				if(!$owed[$fk]) $owed[$fk] = array();
				$owed[$fk][$lk] = round(0-$diff,2);
				$tmp_bal[$fk] -= $tmp_bal[$lk];
				unset($tmp_bal[$lk]);
			}
		}
	
		return array(
			'paid' => $total_paid,
			'balances' => $balances,
			'total' => $grand_total,
			'owed' => $owed
		);
	}
	
}