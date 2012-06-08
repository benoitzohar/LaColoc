<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:42:17
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/login.tpl" */ ?>
<?php /*%%SmartyHeaderCode:21109152914f7b36793443a6-27068512%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '1a86b98f598540d6c3e4b09db0af8db3b4280e9a' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/login.tpl',
      1 => 1333440345,
    ),
  ),
  'nocache_hash' => '21109152914f7b36793443a6-27068512',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
	<head>
		<title><?php echo $_smarty_tpl->getVariable('title')->value;?>
</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-ui-1.8.5.js"></script>
		
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_TPL')->value;?>
default.css" type="text/css" />
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_TPL')->value;?>
admin/admin.css" type="text/css" />
	</head>
	<body>
	
	<form action="" method="post" id="login_form">
	
		<div id="form_div">
			<div class="logo_active"></div>
			<div class="div_title">Admin.</div>
			<div class="label">Mot de passe</div> <input type="password" name="password" id="input_password" />
			<div class="checkbox_label"><input type="checkbox" name="remember_me" id="remember_me_checkbox" /> rester connecté</div>
			<button onclick="$('#login_form').submit()" >Continuer</button>
		</div>
	</form>
	
	<script>
		$(document).ready(function(){
			$('#login_form #input_password').focus();
		});
	</script>
	
	</body>
</html>
