<?php


?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		<title>La Coloc'</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="description" lang="fr" content="Gérez votre colocation, votre couple, vos weekends entre potes. Au menu : partage des dépenses, de listes de courses et plus.">
		<meta name="author" content="Benoit Zohar">
		
		<link rel="icon" type="image/png" href="http://www.lacoloc.fr/img/favicon.png" />
		<link rel="stylesheet" href="http://www.lacoloc.fr/css/bootstrap.min.css">
		<link rel="stylesheet" href="http://www.lacoloc.fr/css/zocial.css">
		<link rel="stylesheet" href="http://www.lacoloc.fr/css/tipTip.css" type="text/css" />
		<link rel="stylesheet" href="http://www.lacoloc.fr/css/lacoloc.css" type="text/css" />
		
		<style>
			.smooth {
				-webkit-transition: 0.4s;
				-moz-transition: 0.4s;
				transition: 0.4s;
			}
			.main_logo { opacity:0.5;		}
			.main_logo:hover { opacity : 1; }
			.well { padding : 13px; 
					opacity: 0.8; 
					-webkit-transition: 0.4s;
					-moz-transition: 0.4s;
					transition: 0.4s;
			}
			.well:hover { opacity: 1; }
			.span4 { position: relative; }
			form { margin-bottom: -8px; }
			.well-divider {
				text-align: center;
				width: 100%;
				margin-top: -18px;
				color: #ccc;
			}
			a.zocial {
				margin:5px;
				opacity: 0.8;
			}
			a.zocial:hover {
				opacity: 1;
			}
			.div_title {
				position:absolute;
				right:10px;
				top:-30px;
				font-size:20px;
				color:#ccc;
				font-variant: small-caps;
				letter-spacing:3px;
				text-shadow: 0px 0px 3px #eee;
			}
			.div_title.tipTip {
				position:relative;
				width:100%;
				text-align: center;
				margin-top:30px;
			}		
			#signup_message {
				margin-top: 30px;
				margin-bottom: 1px;
			}
			
		</style>
		
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="http://www.lacoloc.fr/img//apple-touch-icon-144-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="http://www.lacoloc.fr/img//apple-touch-icon-114-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="http://www.lacoloc.fr/img//apple-touch-icon-72-precomposed.png">
		<link rel="apple-touch-icon-precomposed" href="http://www.lacoloc.fr/img//apple-touch-icon-57-precomposed.png">
		
		<script> window.addEventListener("load",function() { setTimeout(function(){ window.scrollTo(0, 0);}, 0);}); </script>
	
	</head>
	<body>
	<div class="container">
	  <div class="row">
	  	<div class="span1"></div>
	    <div class="span5">
	      <center><img src="http://www.lacoloc.fr/img/logo_lacoloc_160.png" class="main_logo smooth"></center>
	      <div style="margin-top: 20px;">
	          <span>
	            Gérez votre colocation, votre couple, vos weekends entre amis. Au menu : partage des dépenses, de listes de courses et plus.
	          </span>
	          <div class="div_title tipTip" style="font-variant: normal;top:auto;font-size:28px;cursor:pointer;" title="&alpha; : lacoloc.fr est en cours de développement (Alpha). Vous pouvez néanmoins vous faire inviter pour tester l'application via Twitter: @LaColoc_fr">&alpha;</div>
	      </div>
	    </div>
	    <div class="span5">
	    	<div class="div_title">la coloc'</div>
	      <div class="well" style="opacity:1;">
	      	<form action="/auth/login" method="post" id="login_form">
	       
	   	          <input type="text" name="login" id="input_login" placeholder="Adresse e-mail" class="input-xlarge">
	   	          <a class="btn btn-large" href="#" onclick="$('#login_form').submit()" style="float:right">Se connecter</a>
	   	          <input type="password" name="password"  placeholder="Mot de passe" class="input-large" >
	   	          	<label class="checkbox" style="float:right;width:130px;margin-top:6px;" >
		   	          	<input type="checkbox" name="remember_me" id="remember_me_checkbox" checked="checked"> se rappeler de moi
		   	        </label>
	        
	        </form>
	      </div>
	      <div class="well-divider">ou</div>
	      <div class="well smooth"><center>
		  	<a href="http://www.lacoloc.fr/auth/twitter" class="zocial twitter">Connectez-vous avec Twitter</a>
		  	<a href="http://www.lacoloc.fr/auth/facebook" class="zocial facebook">Connectez-vous avec  Facebook</a>
		  	<a href="http://www.lacoloc.fr/auth/google" class="zocial googleplus">Connectez-vous avec  Google+</a></center>
	      </div>
	      <div class="well-divider">ou</div>
	      <div class="well smooth signup_div">
	      	<div style="margin-bottom:10px;">Nouveau sur La Coloc' ?</div>
	      	<div class="control-group" style="margin-left:50px;padding-bottom:12px;">
	      	 <input type="text" name="signup_firstname" id="signup_firstname" placeholder="Prénom" class="input-small">
	      	 <input type="text" name="signup_lastname" id="signup_lastname" placeholder="Nom" class="input-small">
	      	 <input type="text" name="signup_email" id="signup_email" placeholder="Adresse e-mail" class="input-xlarge">
	      	 <input type="password" name="signup_password" id="signup_password" placeholder="Mot de passe" class="input-xlarge">
	      	  <a class="btn btn-primary pull-right" href="#" onclick="return do_signup();" style="margin-right:0;">S'inscrire sur la Coloc'</a>
	      	</div>
	      </div>
	    </div>
	    <div class="span1"></div>
	  </div>
	</div>

		
	<script type="text/javascript" src="http://www.lacoloc.fr/js/libs/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="http://www.lacoloc.fr/js/libs/jquery-ui-1.8.16.custom.min.js"></script>
	<script type="text/javascript" src="http://www.lacoloc.fr/js/libs/bootstrap.min.js"></script>
	<script type="text/javascript" src="http://www.lacoloc.fr/js/libs/jquery.tipTip.minified.js"></script>

	<script type="text/javascript">
	  var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-33326287-1']); _gaq.push(['_trackPageview']);
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>	
	
	<script>
		
		function do_signup() {
			
			$('.signup_div').css('opacity',1);
			$('#signup_message').remove();
		
			$.ajax('http://www.lacoloc.fr/auth/signup',{
				success : function(e) {
					if (e && e.status == true) {
						window.location.reload();
					}
					else if (e.message) {
						$('.signup_div').append('<div class="alert" id="signup_message" >'+e.message+'</div>');
					}
				},
				type: 'POST',
				dataType:'json',
				data : {firstname:$('#signup_firstname').val(),lastname:$('#signup_lastname').val(),email:$('#signup_email').val(),password:$('#signup_password').val()}
			});
		}
	
		$(function(){
			$('#login_form #input_login').focus();
			
			setTimeout(function() {
				$('.tipTip').tipTip({ 
					delay : 400, 
					fadeIn:800, 
					edgeOffset: 10 ,
					defaultPosition: 'bottom',
					keepAlive : true,
					activation : 'click'
				});
				
				$('.tipTip').trigger('click');
			},1000);
			
			
		});
	</script>

	
	
	</body>
</html>
