<?php /* Smarty version Smarty3-b8, created on 2012-04-03 21:25:26
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:10263559594f7b4ea61682a1-00750645%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'cefb1d0491a449ae6ed41128199007010aacce3c' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/header.tpl',
      1 => 1333440352,
    ),
  ),
  'nocache_hash' => '10263559594f7b4ea61682a1-00750645',
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
	
<div data-role="page">

	<div data-id="headeru" data-role="header" data-position="inline">
		<h1>Gestio.</h1>
		<a href="?view=options" data-icon="gear" class="ui-btn-right" data-transition="fade">Options</a>
	</div>