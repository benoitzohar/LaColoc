<?php /* Smarty version Smarty3-b8, created on 2011-09-14 13:02:27
         compiled from "/Users/benoit/Sites/gestio/templates/admin/modules.tpl" */ ?>
<?php /*%%SmartyHeaderCode:18539491254e7089c39e7db4-69762136%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4f88b6faf559e0ee4c3360d9983845837f1fdd65' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/admin/modules.tpl',
      1 => 1315997881,
    ),
  ),
  'nocache_hash' => '18539491254e7089c39e7db4-69762136',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_function_html_table')) include '/Users/benoit/Sites/gestio/libs/smarty/plugins/function.html_table.php';
?><?php $_template = new Smarty_Internal_Template('admin/header.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>

<center>
<h3><?php echo $_smarty_tpl->getVariable('installed_modules_label')->value;?>
</h3>
<?php echo smarty_function_html_table(array('table_attr'=>'id="installed_modules_table"','loop'=>$_smarty_tpl->getVariable('installed_modules')->value,'cols'=>$_smarty_tpl->getVariable('installed_modules_fields')->value),$_smarty_tpl->smarty,$_smarty_tpl);?>

<br /><br />
<h3><?php echo $_smarty_tpl->getVariable('available_modules_label')->value;?>
</h3>
<?php echo smarty_function_html_table(array('table_attr'=>'id="available_modules_table"','loop'=>$_smarty_tpl->getVariable('available_modules')->value,'cols'=>$_smarty_tpl->getVariable('available_modules_fields')->value),$_smarty_tpl->smarty,$_smarty_tpl);?>

</center>
<?php $_template = new Smarty_Internal_Template('admin/footer.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
