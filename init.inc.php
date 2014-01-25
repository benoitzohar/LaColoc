<?php

require_once('func.inc.php');

// Include Core classes
require_once('core/class.UI.inc.php');
require_once('core/class.LCSession.inc.php');
require_once('core/class.LC.inc.php');


// If application is not installed
if (LC::$is_installed === false) {
	require_once('admin/setup/index.php');
	exit;
}

include_all_in('classes/');

$current_lang = 'fr_FR';


?>