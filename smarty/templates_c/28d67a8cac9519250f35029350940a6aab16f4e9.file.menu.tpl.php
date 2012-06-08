<?php /* Smarty version Smarty3-b8, created on 2011-09-14 13:04:43
         compiled from "/Users/benoit/Sites/gestio/templates/menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:12334032184e708a4bf25270-11414381%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '28d67a8cac9519250f35029350940a6aab16f4e9' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/menu.tpl',
      1 => 1315997881,
    ),
  ),
  'nocache_hash' => '12334032184e708a4bf25270-11414381',
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