<?php
header('Content-type: application/x-javascript');
if (empty($_REQUEST['lang']) || !is_file('../../lang/'.$_REQUEST['lang'])) exit();

require_once('../../lang/'.$_REQUEST['lang']);

echo " function L(k) { \n var la = { \n";
foreach($lang as $key => $val) {
	echo " '".addslashes($key)."' : '".addslashes($val)."', \n";
}
echo " } \n";
echo " if (!la[k]) return k; \n return la[k]; \n }";

?>