<?php /* Smarty version Smarty3-b8, created on 2012-04-03 21:25:25
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12089941124f7b4ea5e47ec6-05244845%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '2faddaf88302995dc4e330fe20a0fcae74e7ae33' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/index.tpl',
      1 => 1333440352,
    ),
  ),
  'nocache_hash' => '12089941124f7b4ea5e47ec6-05244845',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_HEADER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>


<div data-role="content">
	<ul data-role="listview" data-theme="d" data-inset="true">
		<li data-role="list-divider">Menu</li>
		<li><a href="app_1.html">App 1</a></li>
		<li><a href="app_2.html">App 2</a></li>
		<li><a href="app_3.html">App 3</a></li>
	</ul>
	<ul data-role="listview" data-theme="d" data-inset="true">
		<li data-role="list-divider">Compte</li>
		<li><a href="#options">Options</a></li>
	</ul>
</div>

<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_FOOTER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
