<?php

class Dialog {

	
	public function getPreference($p) {
		$pref = LC::M()->getPreference($p['name'],$p['app']);
		return $pref;
	}
	
	public function setPreference($p) {
		$res = LC::M()->setPreference($p['name'],$p['value'],$group = false,$p['app']);
		if (!$res) return null;
		return $this->getPreference($p);
	}
	
}


?>