<?php /* Smarty version Smarty3-b8, created on 2012-04-03 21:25:30
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/options.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1822036964f7b4eaa9eec54-13970854%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '93f4eb708f1462bebc4eeee898d0fc87b47ec5ca' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/tablet/options.tpl',
      1 => 1333440352,
    ),
  ),
  'nocache_hash' => '1822036964f7b4eaa9eec54-13970854',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_HEADER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>

<div data-role="content">	
		<div data-role="controlgroup" data-type="horizontal">
			<a href="?device=desktop" data-role="button">Desktop</a>
			<a href="?device=tablet" data-role="button">Tablet</a>
			<a href="?device=phone" data-role="button">Phone</a>
		</div>

<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_FOOTER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
