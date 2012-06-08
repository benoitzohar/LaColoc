<?

// Include Core classes
require_once('core/class.GestioSession.inc.php');
require_once('core/class.Gestio.inc.php');


// If application is not installed
if (Gestio::$is_installed === false) {
	require_once('admin/setup/index.php');
	exit;
}

require_once('func.inc.php');

include_all_in('classes/');

$current_lang = 'fr_FR';


?>