<?php

require_once LC::$path."modules/depenses/class.dialog.inc.php";

$dialog_depenses = new Dialog_depenses();

LC::M()->addInitialData($dialog_depenses->getAllInfos(),'depenses');

LC::M()->tadd(array(
	'lang' => array(
		'add' => lang('Add'),
		'cancel' => lang('Cancel'),
		'add_expense'=> lang('Add_an_expense')
	)
));


LC::M()->display(LC::M()->app->getName(),'main.tpl');

?>