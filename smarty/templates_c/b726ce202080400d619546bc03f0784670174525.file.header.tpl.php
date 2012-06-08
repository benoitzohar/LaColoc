<?php /* Smarty version Smarty3-b8, created on 2011-10-11 13:21:00
         compiled from "/Users/benoit/Sites/gestio/templates/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:20282056064e94269c7a1dd9-32369896%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'b726ce202080400d619546bc03f0784670174525' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/header.tpl',
      1 => 1318332039,
    ),
  ),
  'nocache_hash' => '20282056064e94269c7a1dd9-32369896',
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
		<?php echo $_smarty_tpl->getVariable('GESTIO_JS_FILES')->value;?>

		<?php echo $_smarty_tpl->getVariable('GESTIO_CSS_FILES')->value;?>

		
		<script>
			var gestio;
			function initGestio() {
				gestio = new Gestio();
			}
		</script>
		
	</head>
	<body onload="initGestio();">
	
	<img id="ajax-loader" src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-loader.gif" />
	<div id="ajax-error"><img src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-error.png"><span></span></div>

	
	<div id="content">

<?php $_template = new Smarty_Internal_Template('menu.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
