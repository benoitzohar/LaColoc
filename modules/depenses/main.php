<?php

require_once LC::$path."modules/depenses/class.dialog.inc.php";

$dialog_depenses = new Dialog_depenses();

LC::M()->addInitialData($dialog_depenses->getAllInfos(),'depenses');

$devise = '€';
if (LC::M()->user) {
	$group = LC::M()->user->getCurrentGroup();
	if ($group) {
		$devise = $group->getDevise();
	}
}

LC::UI()->tadd(array(
	'current_day' => date("d/m/Y"),
	'devise' => $devise
));

LC::UI()->display(LC::M()->app->getName(),'main.tpl');

?>