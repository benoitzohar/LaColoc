<?php /* Smarty version Smarty3-b8, created on 2011-10-04 09:09:48
         compiled from "/Users/benoit/Sites/gestio/templates/login.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12557928184e8ab13c09e623-74178227%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8ce74ed7f019b76f9a6e84c9c2642f7bf7794236' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/login.tpl',
      1 => 1317712117,
    ),
  ),
  'nocache_hash' => '12557928184e8ab13c09e623-74178227',
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
	</head>
	<body>
	
	<form action="" method="post" id="login_form">
	
		<div id="form_div">
			<div class="logo_active"></div>
			<div class="div_title">Gestio.</div>
			<?php echo $_smarty_tpl->getVariable('message')->value;?>

			<div class="label">Login</div> <input type="text" name="login" id="input_login" />
			<div class="label">Mot de passe</div> <input type="password" name="password" />
			<div class="checkbox_label"><input type="checkbox" name="remember_me" id="remember_me_checkbox" /> rester connecté</div>
			<button onclick="$('#login_form').submit()" >Continuer</button>
		</div>
	</form>
	
		
	<script>
		$(document).ready(function(){
			$('#login_form #input_login').focus();
		});
	</script>

	
	</body>
</html>
