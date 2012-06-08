<?php /* Smarty version Smarty3-b8, created on 2011-10-11 13:37:01
         compiled from "/Users/benoit/Sites/gestio/templates/tablet/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:14628980644e942a5d6506d1-90077348%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '16326af46703eb2b384d3222b19bf910ed917f57' => 
    array (
      0 => '/Users/benoit/Sites/gestio/templates/tablet/index.tpl',
      1 => 1318333019,
    ),
  ),
  'nocache_hash' => '14628980644e942a5d6506d1-90077348',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_HEADER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>



<!-- Start of first page -->
<div data-role="page" id="home">

	<div data-role="header">
		<h1>Gestio.</h1>
	</div><!-- /header -->

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
		</div><!-- /content -->

</div><!-- /page -->


<!-- Start of second page -->
<div data-role="page" id="options">

	<div data-role="header">
		<a href="#home" data-role="button" data-icon="arrow-l">Back</a><h1>Options</h1>
	</div><!-- /header -->

	<div data-role="content">	
		<div data-role="controlgroup" data-type="horizontal">
			<a href="?device=desktop" data-role="button">Desktop</a>
			<a href="?device=tablet" data-role="button">Tablet</a>
			<a href="?device=phone" data-role="button">Phone</a>
		</div>


	</div><!-- /content -->

	<div data-role="footer">
		<h4>gestio.</h4>
	</div><!-- /footer -->
</div><!-- /page -->

<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->getVariable('GESTIO_FOOTER_TPL')->value), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
 echo $_template->getRenderedTemplate();?><?php $_template->updateParentVariables(0);?><?php unset($_template);?>
