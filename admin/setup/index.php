<?php

require_once 'class.gestio_install.inc.php';

if (!empty($_POST['ajax'])) {
	if (!empty($_POST['action'])) {
		switch($_POST['action']) {
			case 'check_db' : 

				$co = @mysql_connect($_POST['db_host'],$_POST['db_user'],$_POST['db_password']);
				if (empty($co)) {
					echo json_encode(array('status' => false,'message' => "Gestio cannot connect to the database please check the host, user and password."));	
					exit;
				}
				
				echo json_encode(array('status' => true,'message' => "Your database is successfully configured. You can now proceed to the next step."));
			exit;
		
			case 'install':
				
				$install = new Gestio_install($_POST);
				$res = $install->launchInstall();
				if ($res !== true) {
					echo json_encode(array('status' => false,'message' => $res));exit;
				}
				echo json_encode(array('status' => true,'message' => 'Gestio is configured and installed !'));
			exit;
			
		}
	
	}
	exit;
}


$title = "Gestio v".Gestio::$current_version." - Setup";

$default_url = str_replace('admin/setup/','','http'.((isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on" )? 's' : '').'://'.$_SERVER["SERVER_NAME"].($_SERVER["SERVER_PORT"] != "80" ? ":".$_SERVER["SERVER_PORT"] : '').$_SERVER["REQUEST_URI"]);

$default_path = str_replace('admin/setup','',dirname(__FILE__));

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title><?= $title; ?></title>
		<link rel="stylesheet" type="text/css" media="all" href="templates/jquery_ui/redmond/jquery-ui-1.8.5.custom.css" />
		<script type="text/javascript" src="js/libs/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="js/libs/jquery-ui-1.8.5.js"></script>
		<script type="text/javascript">

			function check_db() {
			
				var obj = { action : 'check_db',
							db_host : $("#gestio_db_host").val(),
							db_user : $("#gestio_db_user").val(),
							db_password : $("#gestio_db_pass").val(),
							db_dbname : $("#gestio_db_dbname").val()
								
  				};
		  		ajaxRequest(obj, function(reponse) { 

		  			if ($("#gestio_db_message > p > span").length == 0) {
		  				$("#gestio_db_message").addClass('ui-corner-all').css('padding','.8em')
		  										.append('<p />').children('p')
		  											.append('<span />').children('span')
				  										.addClass('ui-icon')
				  										.css({
				  											'float' : 'left',
				  											'marginRight' : '.3em'
				  										});
		 				$("#gestio_db_message > p").append('<span id="gestio_db_message_content"></span>')
		  			}		  				
		  					  		
		  			if (reponse.status) {
		  				var new_color = '#afffa3';
		  				$("#gestio_db_message").addClass('ui-state-highlight').removeClass('ui-state-error');
		  				$("#gestio_db_message > p > span").not('#gestio_db_message_content').addClass('ui-icon-info').removeClass('ui-icon-alert');
		  			}
		  			else {
		  				var new_color = '#ff4242';
		  				$("#gestio_db_message").addClass('ui-state-error').removeClass('ui-state-highlight');
		  				$("#gestio_db_message > p > span").not('#gestio_db_message_content').addClass('ui-icon-alert').removeClass('ui-icon-info');
		  			}

	  				$("#gestio_db_host, #gestio_db_user, #gestio_db_pass").each(function() {
	  					$(this).parent('td').animate({
	  						'background-color' :new_color,
	  						'border-radius' : '5px'
	  					},1000);
	  				});
	  				
	  				$("#gestio_db_message_content").text(reponse.message);
		 
		  		});			
		  		
			}
			
			function checkReadyForInstall() { 
				var inputs_to_check = {};
				
				if($('#gestio_title').val() == '')
					inputs_to_check.title = 'the title is empty';
					
				if (!$("#gestio_db_message").hasClass('ui-state-highlight'))
					inputs_to_check.db = 'the database is not properly configured';
					
				if ($("#gestio_url").val() == '')
					inputs_to_check.url = 'the URL is empty';
				
				if ($("#gestio_path").val() == '')
					inputs_to_check.path = 'the path is empty';	
				
				if ($("#gestio_admin_password").val() == '')
					inputs_to_check.admin_password = 'the admin password is empty';	
				
				if (!jQuery.isEmptyObject(inputs_to_check)) {
					$('#install_not_ready_list').html('').show();
					for(var x in inputs_to_check) {
						$('#install_not_ready_list').append('<li>'+inputs_to_check[x]+'</li>');
					}
					$('#install_not_ready_txt').show();
					$('#install_button').button( "option", "disabled", true );
					$('#install_ready_txt').hide();
				}
				else {
					$('#install_ready_txt').show();
					$('#install_button').button( "option", "disabled", false );
					$('#install_not_ready_txt').hide();
					$('#install_not_ready_list').hide();
				}
			}
			
			
			function ajaxRequest(obj,callback) {
				obj.ajax = true;
				$.ajax({url: '<? echo $default_url; ?>', data:obj, type:'POST', dataType:'json',
					success:function(reponse,status,xhr){
						if (callback) callback(reponse);
					},
					error:function(xhr,status,err) {
						alert('Service unavailable, please make sure you\'re in the Gestio root directory.');
					}
				});
			}
			
			function installProceed(button) {
				if (!button || $(button).attr('disabled')) return false;
				var obj = {	action : 'install',
							gestio_title : $('#gestio_title').val(),
							gestio_db_type : $('#gestio_db_type').val(),
							gestio_db_host : $('#gestio_db_host').val(),
							gestio_db_user : $('#gestio_db_user').val(),
							gestio_db_pass : $('#gestio_db_pass').val(),
							gestio_db_dbname : $('#gestio_db_dbname').val(),
							gestio_default_lang : $('#gestio_default_lang').val(),
							gestio_url : $('#gestio_url').val(),
							gestio_path : $('#gestio_path').val(), 
							gestio_admin_password : $('#gestio_admin_password').val(),
							current_version : '<? echo Gestio::$current_version; ?>'
				};
				ajaxRequest(obj,function(reponse) {

					if (reponse && reponse.status) {
						alert('Gestio is now fully configured and installed ! Click on "OK" to continue.');
						location.href = $('#gestio_url').val()+'admin/';
					}
					else {
						alert(reponse.message);
					}
				});
			}
			
			
			$(function() {
				$( "#accordion" ).accordion({
					autoHeight: false,
					navigation: true,
					changestart: function(event,ui) {
						checkReadyForInstall();
					}
				});
				
				$("#install_button").button();
			});
			
		</script>
		<style>
			input {
				border:1px solid #2E6E9E;
				border-radius:4px;
				padding:5px;
				margin:5px;
			}
			#gestio_title {	height:25px;width:400px; }
			#gestio_db_message { width:300px;margin-left:200px; }
			#gestio_db_message_content { font-size: 14px;	}
			
			#install_button {float:right; }
			
		</style>
	</head>
	<body>
	
	<center><h2><?=$title;?></h2></center>
	
	<div id="accordion">
	<h3><a href="#Welcome">Welcome</a></h3>
	<div id="acc_welcome">
		<p>Welcome to Gestio and thank you for trusting us.</p>
		<p>The first thing that you will have to do to make it work is to write a fancy site name. This name will appear nearly everywhere on your Gestio. No worries, you can change that name at anytime in the admin panel.</p><br />
		<center>Title : <input type="text" name="gestio_title" id="gestio_title" /></center><br />
	</div>
	<h3><a href="#Database">Database</a></h3>
	<div>
		<p>Now, you'll need to configure your database access. If you don't know how to configure it, you might want to check with your current database hoster (or leave 'localhost'). Since Gestio is entirely based on your database, this part cannot and <u>should not</u> be skipped.</p><br />
		<table border="0">
			<tr>
				<td>Type:</td>
				<td colspan="2">
					<select name="gestio_db_type" id="gestio_db_type" disabled>
						<option value="mysql">MySQL</option>
					</select>
				</td>
			</tr>
			<tr>
				<td></td>
				<td colspan="2"><p style="font-size:13px;"><i>Gestio currently supports only MySQL.</i></p></td>
			</tr>
			<tr>
				<td>Host:</td>
				<td><input type="text" name="gestio_db_host" id="gestio_db_host" value="localhost" style="color:gray;" onchange="check_db();this.style.color = 'black';" onkeydown="this.style.color = 'black';" /></td>
				<td rowspan="4"><div id="gestio_db_message" class=""></div></td>
			</tr>
			<tr>
				<td>User:</td>
				<td><input type="text" name="gestio_db_user" id="gestio_db_user" value="root" style="color:gray;" onchange="check_db();this.style.color = 'black';" onkeydown="this.style.color = 'black';" /></td>
			</tr>
			<tr>
				<td>Pass:</td>
				<td><input type="text" name="gestio_db_pass" id="gestio_db_pass" onchange="check_db();" onmouseout="check_db();" /></td>
			</tr>
			<tr>
				<td>Database:</td>
				<td><input type="text" name="gestio_db_dbname" id="gestio_db_dbname" value="gestio" style="color:gray;" onchange="check_db();this.style.color = 'black';" onkeydown="this.style.color = 'black';" /></td>
			</tr>
			<tr>
				<td></td>
				<td colspan="2"><p style="font-size:13px;"><i>The specified database will be created if it doesn't already exist. Please check MySQL Documentation to use well-formatted database name (or use 'gestio').</i></p></td>

			</tr>
		</table>
	</div>
	<h3><a href="#some_vars">Some vars ...</a></h3>
	<div>
		<p>Okay, you're almost done. Just a few variables that you need to check for us :</p>
		<ul>
			<li>Language : 
			<select name="gestio_default_lang" id="gestio_default_lang">
				<option value="fr_FR">French</option>
				<option value="en_US">English</option>
			</select>
			<p style="font-size:13px;"><i>There are few languages currently supported by Gestio, but it keeps growing up. If you're interested, you can still check our website and help us in translating Gestio and some of it's main apps.</i></p>
			</li>
			<li>Website URL : 
				<input type="text" name="gestio_url" id="gestio_url" value="<?= $default_url;?>" style="width:500px;color:gray;" onchange="this.style.color = 'black';" onkeydown="this.style.color = 'black';" />
				<p style="font-size:13px;"><i>The website URL is the url of your server. For example: <b>http://www.youraddress.com/gestio/</b></i></p>
				</li>
			<li>Path : 
				<input type="text" name="gestio_path" id="gestio_path" value="<?= $default_path;?>" style="width:500px;color:gray;" onchange="this.style.color = 'black';" onkeydown="this.style.color = 'black';" />
				<p style="font-size:13px;"><i>This is the local path to your gestio folder. If you don't know what this is, you should keep the default value.</i></p>
				</li>

		</ul>
	</div>
	
	<h3><a href="#admin_password">Admin password</a></h3>
	<div>
		<p>The last thing you have to do is to choose a password for your admin user. We wont check that, but, for your own safety, please choose a strong password (at least 8 chars, with non alpha-numeric ones).</p>
		<ul>
			<li>Password : 
				<input type="text" name="gestio_admin_password" id="gestio_admin_password" value="" />
			</li>

		</ul>
	</div>

	<h3><a href="#install">Finalize installation</a></h3>
	<div>
		<p id="install_ready_txt" style="display:none;">That's it. You're ready to install Gestio. Just click on the button to proceed the insallation.</p>
		<p id="install_not_ready_txt">Sorry, some informations are missing. Please check :
			<ul id="install_not_ready_list">
				
			</ul> 
		</p>
		<ul id="install_list">
		</ul>
		<button id="install_button" onclick="installProceed(this);" disabled="disabled">Proceed to installation</button>
	</div>
	
	
	</body>
</html>
