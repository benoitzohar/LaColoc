<?php /* Smarty version Smarty3-b8, created on 2011-09-14 13:02:05
         compiled from "/Users/benoit/Sites/gestio/templates/admin/users.tpl" */ ?>
<?php /*%%SmartyHeaderCode:10227919484e7089adbcd3c0-11622168%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '2b2a7e15e98ce6671845b75ae04f496c907fb9b2' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/admin/users.tpl',
      1 => 1315997881,
    ),
  ),
  'nocache_hash' => '10227919484e7089adbcd3c0-11622168',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_function_html_table')) include '/Users/benoit/Sites/gestio/libs/smarty/plugins/function.html_table.php';
?><?php $_template = new Smarty_Internal_Template('admin/header.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>

<center>
<?php echo smarty_function_html_table(array('table_attr'=>'id="users_table"','loop'=>$_smarty_tpl->getVariable('users')->value,'cols'=>$_smarty_tpl->getVariable('fields')->value),$_smarty_tpl->smarty,$_smarty_tpl);?>

</center>
<?php $_template = new Smarty_Internal_Template('admin/footer.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
