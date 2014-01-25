$(document).ready(function() {
  
	
	$("#ajax-loader").ajaxStart(function(){
		$(this).fadeIn();
	});
	$("#ajax-loader").ajaxStop(function(){
		$(this).delay(2000).fadeOut();
	});
	$("#ajax-error").ajaxComplete(function(ev,xhr,ao){ console.log('xhr',xhr);
		var to_show = '';
		if ($.parseJSON(xhr.responseText) != null) {
			var xhrjson = $.parseJSON(xhr.responseText);
			to_show = xhrjson.display;
		}
		else
			to_show = xhr.responseText;
		
		$(this).find('span').html(to_show);	
		$(this).fadeIn('fast').delay(2000).fadeOut();
	});
	$("#ajax-error").ajaxError(function(e, xhr, settings, exception) {
		$(this).find('span').html("Unable to complete the request !<br />".exception);
		$(this).fadeIn('fast').delay(2000).fadeOut();
	});
	
	$("#users_table").ediTable({
		
	});
	
	var button_original_value = '';
	
	install_button($('.install_button'));
	uninstall_button($('.uninstall_button'));
		
 	
});


	function install_button(button) {
		button.each(function() {
			$(this).click(function() {
			var app_to_install = $(this).attr('id');
			$(this).css('background','gray').css('border-color','white').hover(function() {
				$(this).css('border-color','white');
				$(this).css('cursor','default');
				$(this).unbind('click');
			});
			$.getJSON(	'index.php', 
					{ 	ajax_call: "modules", 
						action: "install",
						app_name: app_to_install},
					function(res, status, xhr) { 
						if (status != "error") {
							var row = $('<tr></tr>').hide();
							var fields = ['title','version','last_edit'];
							for (var cell in res) {
								if (jQuery.inArray(cell,fields) > -1)
									row.append($('<td />').html(res[cell]));
							}
							
							//adding uninstall button
							var uninst_button = $('<button></button>').attr('id',res['name']+'-uninstall')
																		.addClass('uninstall_button')
																		.html(res['uninstall']);
							uninstall_button(uninst_button);
							row.append(uninst_button);
							
							$("#installed_modules_table").append(row);
							row.fadeIn('fast');
							$("#"+app_to_install).closest("tr").fadeOut('fast').remove();	
						}
					});
			});
		});
	}
	
	function uninstall_button(button) {
		button.each(function() {
			$(this).click(function() {
				var app_to_uninstall = $(this).attr('id').split('-')[0];
				$(this).css('background','gray').css('border-color','white').hover(function() {
					$(this).css('border-color','white');
					$(this).css('cursor','default');
					$(this).unbind('click');
				});
				$.getJSON(	'index.php', 
						{ 	ajax_call: "modules", 
							action: "uninstall",
							app_name: app_to_uninstall},
						function(res, status, xhr) { 
							if (status != "error") {
								var row = $('<tr></tr>').hide();
								var fields = ['title','version'];
								for (var cell in res) {
									if (jQuery.inArray(cell,fields) > -1)
										row.append($('<td />').html(res[cell]));
								}
								
								//adding install button
								var inst_button = $('<button></button>').attr('id',res['name'])
																			.addClass('install_button')
																			.html(res['install']);
								install_button(inst_button);
								row.append(inst_button);

								$("#available_modules_table").append(row);
								row.fadeIn('fast');
								$("#"+app_to_uninstall+'-uninstall').closest("tr").fadeOut('fast').remove();	
							}
						});
			});
		});
	}