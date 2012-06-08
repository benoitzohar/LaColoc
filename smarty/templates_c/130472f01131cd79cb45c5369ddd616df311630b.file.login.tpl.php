<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:38:20
         compiled from "/nfs/http6/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/login.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12578961074f7b358cdad996-72798556%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '130472f01131cd79cb45c5369ddd616df311630b' => 
    array (
      0 => '/nfs/http6/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/login.tpl',
      1 => 1333474697,
    ),
  ),
  'nocache_hash' => '12578961074f7b358cdad996-72798556',
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
		<link rel="icon" type="image/png" href="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
/favicon.png" />
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-ui-1.8.5.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery.tipTip.minified.js"></script>
		
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_TPL')->value;?>
default.css" type="text/css" />
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_TPL')->value;?>
/libs/tipTip.css" type="text/css" />
		
		<!-- start Mixpanel --><script type="text/javascript">(function(d,c){ var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){ var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_links track_forms register register_once unregister identify name_tag set_config".split(" ");for(e=0;e<
g.length;e++)(function(a){ b[a]=function(){ b.push([a].concat(Array.prototype.slice.call(arguments,0))) }})(g[e]);c._i.push([a,d,f]) };window.mixpanel=c})(document,[]);
mixpanel.init("9de720f03cc5d0263d1d87f720dcb77b");</script><!-- end Mixpanel -->

	</head>
	<body>
	
	<form action="" method="post" id="login_form">
	
		<div id="form_div">
			<div class="logo_active"></div>
			<div class="div_title">la coloc.</div>
			<?php echo $_smarty_tpl->getVariable('message')->value;?>

			<div class="label">E-mail</div> <input type="text" name="login" id="input_login" />
			<div class="label">Mot de passe</div> <input type="password" name="password" />
			<div class="checkbox_label"><input type="checkbox" name="remember_me" id="remember_me_checkbox" /> rester connecté</div>
			<button onclick="$('#login_form').submit()" >Continuer</button>
			<div class="div_title tipTip" style="font-variant: normal;top:auto;font-size:28px;cursor:pointer;" title="&alpha; : lacoloc.fr est en cours de développement (Alpha). Vous pouvez néanmoins vous faire inviter pour tester l'application via Twitter: @BananaNetwork">&alpha;</div>
			
		</div>
	</form>
	
	<div class="banana_footer">la coloc' fait partie du <a href="http://banana-network.org/" target="_blank">Banana Network <img src="http://banana-network.org/banana_small.png" /></a></div>
		
	<script>
		$(function(){
			$('#login_form #input_login').focus();
			$('.tipTip').tipTip({ 
				delay : 400, 
				fadeIn:800, 
				edgeOffset: 10 ,
				defaultPosition: 'right',
				keepAlive : true,
				activation : 'click'
			});
			
			$('.tipTip').trigger('click');
		});
	</script>

	
	</body>
</html>
