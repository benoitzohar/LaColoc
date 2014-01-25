<?php

include_once LC::$path."modules/courses/class.dialog.inc.php";

$dialog_courses = new Dialog_courses();

LC::M()->addInitialData($dialog_courses->getAllInfos(),'courses');

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