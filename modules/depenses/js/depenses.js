apps.depenses = {
	
	users : {},
	total : 0,
	
	handler : false,
		
	init: function (initial_data){
	
		this.handler = $('#dep_wrapper');
		this.modal_add_form = $('#dep_add_form');
		
		//load initial data
		if (initial_data){
			this.loadData(initial_data);
		}
		
		this.initAddForm();
		
		this.updateAll();
	},
	
	refreshAll : function() { 
		// add animation to button
		$('#dep_refresh i').addClass('rotate180');
		setTimeout(function() {
			$('#dep_refresh i').removeClass('rotate180');
		},700);
		// launch request
		com.send('getAllInfos');
	},
	
	/*
	 *	dialog()
	 *	param:	action	
	 *	param:	original_data
	 *	param:	res
	 */
	dialog : function(action,original_data,res) {
		switch (action) {
			case 'addDepense' :
				this.loadData(res); 
				break;
			case 'editDepense' : 
				this.loadData(res);
				break;
			case 'deleteDepense' : 
				this.loadData(res);
				break;
			case 'getAllInfos' : 
				this.loadData(res);
				break;
			default : fn.debug("action non gérée :"+action);
		}
		this.updateAll();
	},
	
	loadData : function(raw) {
	
		if (!raw) return false;
		
		//load users data
		if (raw.users){
			for(var k in raw.users) {
				if (!this.users[k]) this.users[k] = {};
				var user = raw.users[k];
				this.users[k].balance = user.balance;
				this.users[k].paid = user.paid;
				if(user.depenses && user.depenses.length) {
					this.users[k].to_update = true;
					for(var l in user.depenses) {
						if (user.depenses[l] && user.depenses[l].id) {
							if (!this.users[k].depenses) this.users[k].depenses = {};
							if (!this.users[k].depenses[user.depenses[l].id]) this.users[k].depenses[user.depenses[l].id] = {};
							for(var m in user.depenses[l]) {
								this.users[k].depenses[user.depenses[l].id][m] = user.depenses[l][m];
							}
							
						}
					}
				}
			}
		}

		// load total
		if (raw.total) this.total = raw.total;
		
		if (raw.owed) this.owed = raw.owed;
	},

	
	createList : function(user_id) {
		if (!user_id) return false;
		var u = this.users[user_id];
		if (!u || u.list) return false;
		
		u.list = {
			'div' : $('<div />').addClass('user-list'),
			'table' : $('<table />').addClass('table'),
			'thead' : $('<thead />'),
			'tbody' : $('<tbody />')
		};
		
		u.list.thead.append(
			$('<tr />').append($('<th>'+lc.getUser(user_id).firstname+' <span id="balance'+user_id+'"></span></th>'))
		);
		
		//u.list.tbody.append(this.createRow().tr_td);
		
		u.list.table.append(u.list.thead,u.list.tbody);
		
		u.list.div.append(u.list.table);
		this.handler.append(u.list.div);
	},
	
	createRow : function(data,editable) {
		if (!data || !data.id) return false;
		var t = this;
		
		// get date
		var date_str = fn.getDate(data.date || new Date(),'string_no_hours');
	
		// create dom
		var row = {
			tr : $('<tr />'),
			
			title : $('<span />'),
			
			td : $('<td />'),
			div : $('<div />').addClass('input-prepend input-append '),		
			span_before : $('<span />').addClass('add-on').text(date_str),
			span_after : $('<span />').addClass('add-on').text(lc.getCurrentGroup(true).devise),
			
							//$('<button />').addClass('btn').attr('type','button').html('<i class="icon-cog"></i>'),
			input : $('<input class="span2 cost_input numbered" size="16" type="text">'),
			id : data.id
		};
		
		// add dom to row div
		row.div.append(
			row.span_before,
			row.input,
			row.span_after
		);
		
		row.tr.append(row.td.append(row.title,row.div));
		
		if (editable) {
			 
			 // add menu
			 row.button_after = this.getRowMenu(row);
			 row.div.append(row.button_after);
			 
			 // bind events
			 row.input.keyup(function(e){ 
			 	t.onCostChange(e,row);
			 }).focus(function(e) { var a=this; setTimeout(function() { a.select(); },100); });
			 
			 // bind date
			 row.span_before
			 		.attr('data-date-format',lc.getPreference('dateformat','dd/mm/yyyy'))
					.attr('data-date',date_str)
					.datepicker({
					 	format : lc.getPreference('dateformat','dd/mm/yyyy'),
					 	weekStart : lc.getPreference('weekstart',1)
					 }).on('changeDate', function(e) { t.onDateChange(e,row); });
		}
		else {
			row.input.attr('readonly','readonly');
		}
		
		return row;
	},
	
	getRowMenu : function(r) {
		var t=this;
		var button_after = $('<span />').addClass('add-on btn-group');
		var dropdown_link = $('<a />').addClass('dropdown-toggle').attr('data-toggle','dropdown').attr('href','#')
							.css({'margin': '-7px', 'padding': '6px 13px'})
					 	.append($('<i />').addClass('icon-cog'));
		var dropdown_menu = $('<ul />').addClass('dropdown-menu')
						.append($('<li />').append($('<a />').click(function(e) { t.deleteCost(e,r); }).text(L('Delete'))));
		
		button_after.append(dropdown_link,dropdown_menu);
		return button_after;
	},
	
	getRowSaveMenu : function(r) {
		var t=this;
		var button_after = $('<span />').addClass('add-on btn-group save-button');
		
		var revert_link = $('<a />').addClass('btn btn-warning').css({ 'margin': '-5px -6px -5px -7px', 'width': '10px','padding-right':'14px'})
									.attr('data-title',L('Cancel_the_changes'))
									.append($('<i />').addClass('icon-remove'))
									.click(function() { t.backupData(r); });
									
									
		var save_link = $('<a />').addClass('btn btn-success').css({ 'margin': '-5px -6px -5px 5px', 'padding': '4px 18px'})
									.attr('data-title',L('Save_the_changes'))
									.append($('<i />').addClass('icon-ok'))
									.click(function() { t.sendEditedData(r); });
		
		
		button_after.append(revert_link,save_link);
		
		button_after.find('a').tooltip({placement: 'bottom' });
		
		return button_after;
	},
	
	onCostChange : function(e,r) {
		if (!r || !r.input) return false;
		var val = r.input.val();
		if (!/^[0-9]*(\.|,)*[0-9]{0,2}$/.test(val)) {
			r.input.val(r.input.data('last_val'));
		}
		else {
			r.input.data('last_val',val);
		}
		this.onRowEdit(r);
	},
	
	onDateChange : function(e,r) {
		if (r.span_before) {
			r.span_before.text(fn.getDate(e.date,'string_no_hours'));
			r.span_before.data('datets',e.date);
			this.onRowEdit(r);
		}
		
	},
	
	deleteCost : function(e,r) {
		if (confirm(L('do_you_really_want_to_delete?'))) {
			com.send('deleteDepense',{ id: r.id });
			if (this.users[lc.getCurrentUser()].depenses
				&& this.users[lc.getCurrentUser()].depenses[r.id]
				&& this.users[lc.getCurrentUser()].depenses[r.id].row) { 
				this.users[lc.getCurrentUser()].depenses[r.id].row.tr.remove();
				this.users[lc.getCurrentUser()].depenses[r.id] = false;
			}
		}
	},
	
	updateList : function(user_id) {
		if (!user_id) return false;
		var u = this.users[user_id];
		if (!u || !u.depenses) return false;
		
		$('#balance'+user_id).html(''+u.paid+lc.getCurrentGroup().devise+'<span style="margin-left:40px;color:'+(u.balance>=0?'green':'red')+';">'+u.balance+'</span>').css('float','right');
		
		var editable = user_id == lc.getCurrentUser();
		
		for(var k in u.depenses) {
			var d = u.depenses[k];
			if (!d) continue;
			if (!d.row) {
				d.row = this.createRow(d,editable);
				u.list.tbody.append(d.row.tr);
			}
			this.updateRow(d.row,d);
		}
		
	},
	
	updateRow : function(row,data) {
	
		// store data in row
		row.original_data = data;
	
		//title
		row.title.text(data.comment);
	
		//input
		row.input.val(data.cost);
		
		//date
		var date_str = fn.getDate(data.date || new Date(),'string_no_hours');
		row.span_before.text(date_str).attr('data-date',date_str).data('datets',data.date);
	},

	updateAll : function() {
		if (!this.handler) return false;
		
		// get the ordonned user_id list
		var users = [lc.getCurrentUser()];
		for(var k in this.users) users.push(k);
		
		// update each lists
		for(var i=0;i<users.length;i++) {
			var id = users[i];
			if (!this.users[id]) continue;
			if (!this.users[id].list) this.createList(id);
			if (this.users[id].to_update) {
				this.users[id].to_update = false;
				this.updateList(id);
			}
		}
		
		// update total
		this.updateTotal();
		// update owed
		this.updateOwed();
	},
	
	updateTotal : function() {
		$('#dep_total').text("Total: "+this.total+" "+lc.getCurrentGroup().devise);
	},
	
	updateOwed : function() {
	
		var content = '';
		console.log('owed=',this.owed);
		if (this.owed) {
			for(var user_from in this.owed) {
				var u = this.owed[user_from];
				if (u) {
					for(var user_to in u){
						var val_to = u[user_to];
						content += lc.users[user_from].firstname+" doit "+val_to+" "+lc.getCurrentGroup().devise+" &agrave; "+lc.users[user_to].firstname+" <br />";
					}
				}
			}
		}
	
		$('#dep_owed').html(content);	
	},
	
	onRowEdit : function(r) {
		var old_date = r.original_data.date;
		var new_date = r.span_before.data('datets');
		
		var old_cost = r.original_data.cost;
		var new_cost = r.input.val();
		
		if (old_date && new_date && old_cost && fn.exists(new_cost) && (old_date != new_date || old_cost != new_cost)) {
			// show "save | revert" buttons if they not exist
			if (r.div.find('.save-button').length  == 0) {
				r.button_after.remove();
				r.button_after = this.getRowSaveMenu(r);
				r.div.append(r.button_after);
			}
			
		}
		else {
			// hide "save | revert" buttons if they exist
			if (r.div.find('.save-button').length > 0) {
				r.button_after.find('a').each(function() {
					$(this).tooltip('destroy'); // make sure the tooltip is destroyed before removing the view
				});
				r.button_after.remove();
				r.button_after = this.getRowMenu(r);
				r.div.append(r.button_after);
			}

		}
		
	},
	
	backupData : function(r){
		if (r.div.find('.save-button').length > 0) {
			r.button_after.find('a').tooltip('destroy'); // make sure the tooltip is destroyed before removing the view
			this.updateRow(r,r.original_data); // set original data back
			r.button_after.remove();
			r.button_after = this.getRowMenu(r);
			r.div.append(r.button_after);
		}
	},
	
	sendEditedData : function(r) {
		if (!r) return false;
		var cost = r.input.val();
		var date = fn.getDate(r.span_before.data('datets'),'timestamp');
		var repeat = 0;
		com.send('editDepense',{
			id:r.id,
			cost : cost, 
			//repeat: repeat,
			//targeted_users: targeted_users,
			date:date },
		'depenses');
		
		if (r.div.find('.save-button').length > 0) {
			r.button_after.find('a').tooltip('destroy'); // make sure the tooltip is destroyed before removing the view
			r.button_after.remove();
			r.button_after = this.getRowMenu(r);
			r.div.append(r.button_after);
		}

	},
	
	
	/* MODAL ADD FORMULAIRE */
	
	initAddForm : function() {
		$('#add_form_title,#add_form_cost').val('');
		// bind date picker
		$('#add_form_date').attr('data-date-format',lc.getPreference('dateformat','dd/mm/yyyy'))
					.attr('data-date',fn.getDate(new Date(),'string_no_hours'))
					.datepicker({
					 	format : lc.getPreference('dateformat','dd/mm/yyyy'),
					 	weekStart : lc.getPreference('weekstart',1)
					 });
		
	},
	
	openAddForm : function() {
		this.modal_add_form.modal('show');
	},
	
	onAddFormValid : function() {
	
		var errors = [];
		
		var cost = $('#add_form_cost').val();
		var comment  = $('#add_form_title').val();
		var date = fn.getDate($('#add_form_date').val(),'timestamp');
		var repeat = 0;
		var targeted_users = '';
	
		if (!cost) {
			errors.push(L('you_cannot_add_an_empty_cost'));
		}
	
		if (errors.length > 0) return this.displayAddFormErrors(errors);
	
		com.send('addDepense',{	cost : cost, comment: comment,  repeat: repeat, targeted_users: targeted_users,date:date },'depenses');
		this.modal_add_form.modal('hide');
		this.initAddForm();
	},
	
	onAddFormCancel : function() {
		
	},
	
	displayAddFormErrors : function(err) {
		var str = '';
		for(var k in err) str += err[k]+"\n";
		alert(str);
	},
	
	
	// Archive
	
	onArchiveButtonClick : function() {
		if (confirm(L("Are_you_sure_you_want_to_archive_the_costs"))) {
			com.send('archiveDepenses',{},'depenses');
		}	
	}
	
	
};