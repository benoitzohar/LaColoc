<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:42:46
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/users.tpl" */ ?>
<?php /*%%SmartyHeaderCode:3921828284f7b3696d08156-78842081%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7182cbef4eb4c550b8c0245dfd815929d319b46f' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/admin/users.tpl',
      1 => 1333440345,
    ),
  ),
  'nocache_hash' => '3921828284f7b3696d08156-78842081',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_function_html_table')) include '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/libs/smarty/plugins/function.html_table.php';
?><?php $_template = new Smarty_Internal_Template('admin/header.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>

<center>
<?php echo smarty_function_html_table(array('table_attr'=>'id="users_table"','loop'=>$_smarty_tpl->getVariable('users')->value,'cols'=>$_smarty_tpl->getVariable('fields')->value),$_smarty_tpl->smarty,$_smarty_tpl);?>

</center>
<?php $_template = new Smarty_Internal_Template('admin/footer.tpl', $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
