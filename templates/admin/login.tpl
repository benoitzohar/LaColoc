<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
	<head>
		<title>{$title}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-ui-1.8.5.js"></script>
		
		<link rel="stylesheet" href="{$GESTIO_TPL}default.css" type="text/css" />
		<link rel="stylesheet" href="{$GESTIO_TPL}admin/admin.css" type="text/css" />
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
