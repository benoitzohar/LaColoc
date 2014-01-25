<?php

require_once LC::$path."modules/depenses/class.dialog.inc.php";

$dialog_depenses = new Dialog_depenses();

LC::M()->addInitialData($dialog_depenses->getAllInfos(),'depenses');

$devise = '€';
if (LC::M()->user) {
	$group = LC::M()->user->getGroup();
	if ($group) {
		$devise = $group->getDevise();
	}
}

LC::M()->tadd(array(
	'current_day' => date("d/m/Y"),
	'devise' => $devise
));

LC::M()->display(LC::M()->app->getName(),'main.tpl');

?>