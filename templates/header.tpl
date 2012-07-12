<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title>{$title}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="icon" type="image/png" href="{$GESTIO_IMG}/favicon.png" />
		{$GESTIO_JS_FILES}
		{$GESTIO_CSS_FILES}
		
		<script> function initLC() { lc.init('{$GESTIO_URL}'); } </script>
		
		<script type="text/javascript">
	  var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-33326287-1']); _gaq.push(['_trackPageview']);
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>		
	</head>
	<body onload="initLC();">
	
		<img id="ajax-loader" src="{$GESTIO_IMG}ajax-loader.gif" />
		<div id="ajax-error"><img src="{$GESTIO_IMG}ajax-error.png"><span></span></div>

	
		<div id="content">

{include file="$GESTIO_MENU_TPL"}