<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:44:20
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/modules.tpl" */ ?>
<?php /*%%SmartyHeaderCode:15070962774f7b36f4c5c0b9-89402574%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '449f940ce9a496218dee06cfc4ad46538969410c' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/modules.tpl',
      1 => 1333440345,
    ),
  ),
  'nocache_hash' => '15070962774f7b36f4c5c0b9-89402574',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_function_html_table')) include '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/libs/smarty/plugins/function.html_table.php';
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
