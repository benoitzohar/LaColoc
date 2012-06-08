<?php /* Smarty version Smarty3-b8, created on 2012-04-03 19:44:59
         compiled from "/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:15231581034f7b371c010c97-61606146%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e7db357300050ed0d5b8c55baa452b1f0f8b1bea' => 
    array (
      0 => '/home/jeoffrey54/jeoffrey/lacoloc.fr/www/templates/menu.tpl',
      1 => 1333440351,
    ),
  ),
  'nocache_hash' => '15231581034f7b371c010c97-61606146',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<div id="top_bar"><span></span></div>


<ul id="menu-list" class="hidden">
	<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable;
 $_smarty_tpl->tpl_vars['title'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('menu')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if (count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
 $_smarty_tpl->tpl_vars['title']->value = $_smarty_tpl->tpl_vars['v']->key;
?>
	<li class="menu-item"><a href="<?php echo $_smarty_tpl->getVariable('v')->value['link'];?>
"><img src="<?php echo $_smarty_tpl->getVariable('v')->value['image'];?>
" /><span><?php echo $_smarty_tpl->getVariable('title')->value;?>
</span></a></li>
	<?php }} ?>	
</ul>

<div id="logo" class="logo_inactive"></div>