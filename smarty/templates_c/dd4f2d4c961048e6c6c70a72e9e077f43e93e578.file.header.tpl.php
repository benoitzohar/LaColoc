<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:44:59
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:19916079874f7b371be72938-83382509%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'dd4f2d4c961048e6c6c70a72e9e077f43e93e578' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/header.tpl',
      1 => 1333440345,
    ),
  ),
  'nocache_hash' => '19916079874f7b371be72938-83382509',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title><?php echo $_smarty_tpl->getVariable('title')->value;?>
</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="icon" type="image/png" href="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
/favicon.png" />
		<?php echo $_smarty_tpl->getVariable('GESTIO_JS_FILES')->value;?>

		<?php echo $_smarty_tpl->getVariable('GESTIO_CSS_FILES')->value;?>

		
		<script>
			var gestio;
			function initGestio() {
				gestio = new Gestio();
			}
		</script>
		
		
		<!-- start Mixpanel --><script type="text/javascript">(function(d,c){ var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){ var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_links track_forms register register_once unregister identify name_tag set_config".split(" ");for(e=0;e<
g.length;e++)(function(a){ b[a]=function(){ b.push([a].concat(Array.prototype.slice.call(arguments,0))) }})(g[e]);c._i.push([a,d,f]) };window.mixpanel=c})(document,[]);
mixpanel.init("9de720f03cc5d0263d1d87f720dcb77b");</script><!-- end Mixpanel -->
		
	</head>
	<body onload="initGestio();">
	
		<img id="ajax-loader" src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-loader.gif" />
		<div id="ajax-error"><img src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-error.png"><span></span></div>

	
		<div id="content">

<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_MENU_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
