<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:42:21
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1572350544f7b367d95c2a4-61691331%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4565993a9d34ebd9c4b32b97888ccd801e957b99' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/header.tpl',
      1 => 1333440345,
    ),
  ),
  'nocache_hash' => '1572350544f7b367d95c2a4-61691331',
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
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery-ui-1.8.5.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery.reflection.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
libs/jquery.ediTable.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
gestio.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->getVariable('GESTIO_JS')->value;?>
gestio.admin.js"></script>
		
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_ADMIN_TPL')->value;?>
admin.css" type="text/css" />
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->getVariable('GESTIO_TPL')->value;?>
jquery_ui/redmond/jquery-ui-1.8.5.custom.css" type="text/css" />
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
	</head>
	<body>
	
	<div id="logo"></div>
	
	<div id="menu">
		<ul>
		<?php  $_smarty_tpl->tpl_vars['menu_item'] = new Smarty_Variable;
 $_smarty_tpl->tpl_vars['value'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('menu')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if (count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['menu_item']->key => $_smarty_tpl->tpl_vars['menu_item']->value){
 $_smarty_tpl->tpl_vars['value']->value = $_smarty_tpl->tpl_vars['menu_item']->key;
?>
			<li class="<?php echo $_smarty_tpl->getVariable('menu_item')->value['class'];?>
"><a href="<?php echo $_smarty_tpl->getVariable('menu_item')->value['href'];?>
"><?php echo $_smarty_tpl->getVariable('value')->value;?>
</a></li>
		<?php }} ?>
		</ul>
		<img id="ajax-loader" src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-loader.gif" />
		<div id="ajax-error"><img src="<?php echo $_smarty_tpl->getVariable('GESTIO_IMG')->value;?>
ajax-error.png"><span></span></div>
	</div>
	
	<div id="content">
