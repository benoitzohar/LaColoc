<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title>{$title}</title>
		
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-ui-1.8.5.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery.reflection.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery.ediTable.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}gestio.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}gestio.admin.js"></script>
		
		<link rel="stylesheet" href="{$GESTIO_ADMIN_TPL}admin.css" type="text/css" />
		<link rel="stylesheet" href="{$GESTIO_TPL}jquery_ui/redmond/jquery-ui-1.8.5.custom.css" type="text/css" />
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
	</head>
	<body>
	
	<div id="logo"></div>
	
	<div id="menu">
		<ul>
		{foreach from=$menu key=value item=menu_item}
			<li class="{$menu_item.class}"><a href="{$menu_item.href}">{$value}</a></li>
		{/foreach}
		</ul>
		<img id="ajax-loader" src="{$GESTIO_IMG}ajax-loader.gif" />
		<div id="ajax-error"><img src="{$GESTIO_IMG}ajax-error.png"><span></span></div>
	</div>
	
	<div id="content">
