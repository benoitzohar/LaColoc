<?php /* Smarty version Smarty3-b8, created on 2011-10-11 13:21:06
         compiled from "/Users/benoit/Sites/gestio/templates/tablet/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2330581274e9426a22d1da9-35631390%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f6603d5b0f0fb3d46b8bf493d34f114344374f40' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/tablet/header.tpl',
      1 => 1318332039,
    ),
  ),
  'nocache_hash' => '2330581274e9426a22d1da9-35631390',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $_smarty_tpl->getVariable('title')->value;?>
</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php echo $_smarty_tpl->getVariable('GESTIO_JS_FILES')->value;?>

		<?php echo $_smarty_tpl->getVariable('GESTIO_CSS_FILES')->value;?>

		
		<script>
			var gestio;
			function initGestio() {
				gestio = new Gestio();
			}
		</script>
		
	</head>
	<body>