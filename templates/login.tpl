<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
	<head>
		<title>{$title}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="icon" type="image/png" href="{$GESTIO_IMG}/favicon.png" />
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery-ui-1.8.5.js"></script>
		<script type="text/javascript" src="{$GESTIO_JS}libs/jquery.tipTip.minified.js"></script>
		
		<link rel="stylesheet" href="{$GESTIO_TPL}default.css" type="text/css" />
		<link rel="stylesheet" href="{$GESTIO_TPL}/libs/tipTip.css" type="text/css" />
		
			<script type="text/javascript">
	  var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-33326287-1']); _gaq.push(['_trackPageview']);
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>
	
	</head>
	<body>
	
	<form action="" method="post" id="login_form">
	
		<div id="form_div">
			<div class="logo_active"></div>
			<div class="div_title">la coloc.</div>
			{$message}
			<div class="label">E-mail</div> <input type="text" name="login" id="input_login" />
			<div class="label">Mot de passe</div> <input type="password" name="password" />
			<div class="checkbox_label"><input type="checkbox" name="remember_me" id="remember_me_checkbox" /> rester connecté</div>
			<button onclick="$('#login_form').submit()" >Continuer</button>
			<div class="div_title tipTip" style="font-variant: normal;top:auto;font-size:28px;cursor:pointer;" title="&alpha; : lacoloc.fr est en cours de développement (Alpha). Vous pouvez néanmoins vous faire inviter pour tester l'application via Twitter: @BananaNetwork">&alpha;</div>
			
		</div>
	</form>
	
	<div class="banana_footer">la coloc' fait partie du <a href="http://banana-network.org/" target="_blank">Banana Network <img src="http://banana-network.org/banana_small.png" /></a></div>
		
	<script>
		$(function(){
			$('#login_form #input_login').focus();
			$('.tipTip').tipTip({ 
				delay : 400, 
				fadeIn:800, 
				edgeOffset: 10 ,
				defaultPosition: 'right',
				keepAlive : true,
				activation : 'click'
			});
			
			$('.tipTip').trigger('click');
		});
	</script>

	
	</body>
</html>
