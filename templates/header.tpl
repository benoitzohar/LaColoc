<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title>{$title}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="icon" type="image/png" href="{$GESTIO_IMG}/favicon.png" />
		{$GESTIO_JS_FILES}
		{$GESTIO_CSS_FILES}
		
		<script>
			var gestio;
			function initGestio() {
				gestio = new Gestio();
			}
		</script>
		
		
		<!-- start Mixpanel --><script type="text/javascript">(function(d,c){ var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){ var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_links track_forms register register_once unregister identify name_tag set_config".split(" ");for(e=0;e<
g.length;e++)(function(a){ b[a]=function(){ b.push([a].concat(Array.prototype.slice.call(arguments,0))) }})(g[e]);c._i.push([a,d,f]) };window.mixpanel=c})(document,[]);
mixpanel.init("9de720f03cc5d0263d1d87f720dcb77b");</script><!-- end Mixpanel -->
		
	</head>
	<body onload="initGestio();">
	
		<img id="ajax-loader" src="{$GESTIO_IMG}ajax-loader.gif" />
		<div id="ajax-error"><img src="{$GESTIO_IMG}ajax-error.png"><span></span></div>

	
		<div id="content">

{include file="$GESTIO_MENU_TPL"}