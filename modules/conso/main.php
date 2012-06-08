<?
error_log(__METHOD__.':'.__LINE__.print_r($_POST,true));

include_once 'class.conso.inc.php';

$conso = new Conso();

if (!empty($_POST['conso_new_label'])) {

	$conso->add_element($_POST['conso_new_label']);

}
else if (!empty($_POST['conso_quantity']) && !empty($_POST['conso_element'])) {
	
	$conso->add_element_for_user($_POST['conso_element'],$_POST['conso_date'],$_POST['conso_quantity'],$_POST['conso_period'],$_POST['conso_color']);
	
} else if (!empty($_POST['conso_weight']) && !empty($_POST['conso_weight_date'])) {

	$conso->add_weight($_POST['conso_weight'],$_POST['conso_weight_date']);
}


Gestio::$tpl->assign('elements',$conso->get_elements());
Gestio::$tpl->assign('elements_per_user',$conso->get_elements_for_user());
Gestio::$tpl->assign('weights_per_user',$conso->get_weights());
Gestio::$tpl->assign('google_chart_src',$conso->get_google_chart());


Gestio::display(Gestio::$app->getName(),'index.tpl');

?>