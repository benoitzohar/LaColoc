 /*
 * ediTable
 * Copyright 2010 Benoit Zohar
 * www.benoitzohar.fr
 * http://benoitzohar.fr/jquery/ediTable
 *
 * Version 1.0   -   Updated: May 16, 2010
 *
 * This Plugin will add common actions to an array: EDIT, DELETE, ADD NEW. Each
 * action is binded on a button and optional. The data transfer is made using ajax.
 * @see http://benoitzohar.fr/jquery/ediTable for more informations
 *
 * This ediTable jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
	$.fn.ediTable = function(data, options) {
		var defaults = { 
		
			url : "index.php",
		
			do_not_process_lines: [1],
			
			process_fields : { id: 1, login: 2, password: 3 },
			
			edit_fields : { login: 2, password: 3},
			
			do_edit : { 	
				
				button_html : "Edit",
				button_save_html: "Save",
				url : "index.php",
				params : { ajax_call: "users", action: "update"},
				error_msg : "",
				complete_msg : ""
				
			},
			do_delete : { 	
				
				button_html : "Delete",
				button_save_html: "Confirm ?",
				url : "index.php",
				params : { ajax_call: "users", action: "delete"},
				error_msg : "",
				complete_msg : ""
				
			},
			do_add_new : {	
			
				button_html : "Add new",
				button_save_html: "save",
				url : "index.php",
				params : { ajax_call: "users", action: "add_new"},
				error_msg : "",
				complete_msg : ""
				
			},
		};  
	 	var opts = $.extend(defaults, options);	
	 	
	 	var row_count = col_count = 0;
	 	
	 	//stop the execution if the current element is NOT a table
		if (!$(this).is('table')) return false;
		
		$(this).find("tr").each(function() {
			row_count++;
			if (!$.inArray(row_count,opts.do_not_process_lines)) {
				if (opts.do_edit) 	$(this).append('<td />');
				if (opts.do_delete) $(this).append('<td />');
				return;
			}
			
			var row = $(this);

			// Do edit button and action
			if (opts.do_edit) {
			
				var edit_button = $('<button type="button">'+opts.do_edit.button_html+'</button>').click(function() {
					if (row.find("input").length){
						var fields = opts.process_fields;
						for(var field_name in fields){
							var new_value = '';
							var td = row.find(":nth-child("+fields[field_name]+")");
							if (td.find("input").length)
								new_value = td.find("input").val();
							else
								new_value = td.html();
							fields[field_name] = new_value;
						};
						var vars = $.extend(opts.do_edit.params, fields);
				      	$.get(	opts.url, vars,
								function(res, status, xhr) {
			  						if (status != "error"){
			  							row.find("input").each(function () {
			  								$(this).parent().html($(this).val());
			  							});
			  							edit_button.html(opts.do_edit.button_html);
			  						}
			  					});
			  		}
					else {
						for(field_name in opts.edit_fields){
							var td = row.find("td:eq("+(parseInt(opts.edit_fields[field_name])-1)+")");
							td.wrapInner('<input type="text" value ="' + td.html() +'" />');
						}
						$(this).html(opts.do_edit.button_save_html);
					}
				}).hide();
				$(this).append('<td />').find('td:last-child').append(edit_button.fadeIn());		
			}
			
			// Do delete button and action
			if (opts.do_delete) {
				var delete_button = $('<button type="button">'+opts.do_delete.button_html+'</button>').click(function() {	
					if ($(this).html().match(opts.do_delete.button_save_html)){ 
						var fields = opts.process_fields;
						for(var field_name in fields){
// # TODO BUG A LA SECONDE SUPPRESSION
							var new_value = '';
							var td = row.find(":nth-child("+fields[field_name]+")");
							if (td.find("input").length)
								new_value = td.find("input").val();
							else
								new_value = td.html();
							fields[field_name] = new_value;
						};
						var vars = $.extend(opts.do_delete.params, fields);
				      	$.get(	opts.url, vars,function(res, status, xhr) { if (status != "error") row.fadeOut();	});
					}
					else $(this).html(opts.do_delete.button_save_html);
				}).hide();
				$(this).append('<td />').find('td:last-child').append(delete_button.fadeIn());		
			}
			
			col_count = row.find("td").length;
			
		});
		
		//Do add new 
		if (opts.do_add_new){
		
			var new_row = $('<tr />').hide();
		
			var add_new_button = $('<button type="button">'+opts.do_add_new.button_html+'</button>').click(function() {
				var fields = opts.process_fields;
				for(var field_name in fields){
					var new_value = '';
					var td = new_row.find(":nth-child("+fields[field_name]+")");
					if (td.find("input").length)
						new_value = td.find("input").val();
					else
						new_value = td.html();
					fields[field_name] = new_value;
				};
				var vars = $.extend(opts.do_add_new.params, fields);
		      	$.get(	opts.url, vars,
						function(res, status, xhr) {
	  						if (status != "error"){
	  							new_row.find("input").each(function () {
	  								$(this).parent().html($(this).val());
	  							});
	  						}
	  					});

			});
			
			if (!opts.do_edit && !opts.do_delete)
				$(this).find("tr").each( function(){ $(this).append('<td />'); });

			for(var i=1;i<=col_count;i++) {
				new_row.append('<td />')
				for (field_name in opts.edit_fields)
					if (opts.edit_fields[field_name] == i)
						new_row.find("td:last-child").append($('<input type="text" />'));
				var add_button = false;
				if (opts.do_edit && opts.do_delete && i==col_count-1) {
					new_row.find("td:last-child").attr('colspan',2).append(add_new_button);
					break;
				}
				else if (i==col_count) {
					new_row.find("td:last-child").append(add_new_button);
				}
			}
			
			$(this).append(new_row.fadeIn());
		}
	}
})(jQuery);  	